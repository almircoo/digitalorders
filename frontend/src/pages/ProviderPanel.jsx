
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { Sidebar } from "../components/dashboard/Sidebar"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useAuth } from "../contexts/AuthContext"
import { useOrders } from "../contexts/OrderContext"
import { ProviderCatalog } from "../components/provider/catalog"
import { OrderDetails } from "../components/OrderDetails"
import { ProviderAnalytics } from "../components/analitycs/ProviderAnalitics"
import { useLocation } from "react-router-dom"
import { ProviderAccountSettings } from "../components/provider/Account"
import { Promotions } from "../components/provider/Promotions"
import { InvoiceManagement } from "../components/provider/InvoiceMannager"

export default function ProviderPanel() {
  const { user, profile } = useAuth()
  const { orders, updateOrderStatus } = useOrders()
  const [activeTab, setActiveTab] = useState("catalog")
  const [providerOrders, setProviderOrders] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])

  // 
  const location = useLocation()
  const navigate = useNavigate()

  // perfil de emulacion
  // const mockProfile = {
  //   name: user?.firstName + " " + user?.lastName || "Jane Smith",
  //   businessName: "Provider Company",
  //   role: "provider",
  // }

  const userInfo = {
    name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.email,
    businessName: profile?.provider?.company_name || "Mi Empresa",
    role: "provider",
  }

  const sidebarItems = [
    { title: "Mi catálogo", href: "/provider-panel" },
    { title: "Solicitudes", href: "/provider-panel/orders" },
    { title: "Mis entregas", href: "/provider-panel/deliveries" },
    { title: "Informe", href: "/provider-panel/analytics" },
    { title: "Promociones", href: "/provider-panel/promotions" },
    { title: "Facturas", href: "/provider-panel/invoices" },
    { title: "Mi cuenta", href: "/provider-panel/account" },
  ]

 // Reemplazar el efecto de uso existente que establece los pedidos de proveedores con esta versión actualizada.
// Que también gestiona la selección de pestañas según la URL.
  useEffect(() => {
    // agrega los pedios e
    setProviderOrders(orders)

    // si los datos del arrays estan en 0 se crag estos datos
    if (completedOrders.length === 0) {
      setCompletedOrders([
        {
          id: "order-123456",
          restaurant: "Restaurante Demo",
          location: "Lima, Perú",
          items: [
            { name: "Manzana", quality: "Premium", quantity: 2, unit: "kg", price: 5.99 },
            { name: "Plátano", quality: "Estándar", quantity: 3, unit: "kg", price: 3.99 },
          ],
          total: "25.95",
          date: "2023-05-01",
          time: "14:30:00",
          status: "Entregado",
        },
      ])
    }

    // regire a by tabs
    const path = location.pathname
    if (path.includes("/analytics")) {
      setActiveTab("analytics")
    } else if (path.includes("/orders")) {
      setActiveTab("orders")
    } else if (path.includes("/deliveries")) {
      setActiveTab("deliveries")
    } else if (path.includes("/promotions")) {
      setActiveTab("promotions")
    } else if (path.includes("/invoices")) {
      setActiveTab("invoices")
    } else if (path.includes("/account")) {
      setActiveTab("account")
    } else {
      setActiveTab("catalog")
    }
  }, [orders, completedOrders.length, location.pathname])

  const handleAdvanceStatus = (orderId) => {
    updateOrderStatus(orderId)
  }

  // Acceptar orden
  const acceptOrder = (orderId) => {
    const acceptedOrder = orders.find((order) => order.id === orderId)
    if (!acceptedOrder) return
    // actualiza el "Registrado" para nuevas entewgas
    const updatedOrder = { ...acceptedOrder, status: "Registrado" }
    // agrrega el cmabio en los estados
    setCompletedOrders((prev) => [...prev, updatedOrder])

  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <Sidebar items={sidebarItems} />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Replace the Tabs onValueChange handler with this updated version
            that updates both the state and the URL */}
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value)
                // Update URL based on selected tab
                switch (value) {
                  case "analytics":
                    navigate("/provider-panel/analytics")
                    break
                  case "orders":
                    navigate("/provider-panel/orders")
                    break
                  case "deliveries":
                    navigate("/provider-panel/deliveries")
                    break
                  case "promotions":
                    navigate("/provider-panel/promotions")
                    break
                  case "invoices":
                    navigate("/provider-panel/invoices")
                    break
                  case "account":
                    navigate("/provider-panel/account")
                    break
                  default:
                    navigate("/provider-panel")
                }
              }}
            >
              {/* <TabsList className="mb-6">
                <TabsTrigger value="catalog">Mi Catálogo</TabsTrigger>
                <TabsTrigger value="orders">Pedidos Recibidos</TabsTrigger>
                <TabsTrigger value="deliveries">Mis Entregas</TabsTrigger>
                <TabsTrigger value="analytics">Análisis</TabsTrigger>
                <TabsTrigger value="promotions">Promociones</TabsTrigger>
                <TabsTrigger value="invoices">Facturas</TabsTrigger>
                <TabsTrigger value="account">Mi Cuenta</TabsTrigger>
              </TabsList> */}

              <TabsContent value="catalog">
                <ProviderCatalog />
              </TabsContent>

              <TabsContent value="orders">
                <h2 className="mb-4 text-2xl font-bold">Pedidos Recibidos</h2>

                {providerOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">No hay pedidos pendientes</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {providerOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <h3 className="font-medium">Pedido #{order.id.slice(-6)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {order.restaurant} - {order.date} {order.time}
                              </p>
                              <p className="mt-1">
                                <span className="font-medium">Total:</span> S/. {order.total}
                              </p>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <OrderDetails order={order} onUpdateStatus={handleAdvanceStatus} isProvider={true} />
                              <Button onClick={() => acceptOrder(order.id)} className="btn-standard">
                                Aceptar Pedido
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="deliveries">
                <h2 className="mb-4 text-2xl font-bold">Mis Entregas</h2>

                {completedOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">No hay entregas en proceso</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {completedOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">Pedido #{order.id.slice(-6)}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {order.restaurant} - {order.date} {order.time}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">S/. {order.total}</p>
                                <p className="text-sm text-primary">{order.status}</p>
                              </div>
                            </div>

                            <OrderDetails order={order} onUpdateStatus={handleAdvanceStatus} isProvider={true} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics">
                <ProviderAnalytics />
              </TabsContent>

              <TabsContent value="promotions">
                <Promotions />
              </TabsContent>

              <TabsContent value="invoices">
                <InvoiceManagement />
              </TabsContent>

              <TabsContent value="account">
                <ProviderAccountSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
