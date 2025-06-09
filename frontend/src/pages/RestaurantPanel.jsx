
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MainLayout } from "../layouts/MainLayout"
import { Sidebar } from "../components/dashboard/Sidebar"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { useAuth } from "../contexts/AuthContext"
import { useOrders } from "../contexts/OrderContext"
import { RestaurantList } from "../components/restaurant/RestaurantList"
import { OrderDetails } from "../components/OrderDetails"
import { OrderTracking } from "../components/OrderTracking"
import { RestaurantAnalytics } from "../components/analitycs/RestaurantAnalytics"
import { RestaurantAccountSettings } from "../components/restaurant/Account"
import { RestaurantInvoiceViewer } from "../components/restaurant/Invoice"

export default function RestaurantPanel() {
  const { user } = useAuth()
  const { orders } = useOrders()
  const [activeTab, setActiveTab] = useState("list")
  const [restaurantOrders, setRestaurantOrders] = useState([])

  const location = useLocation()
  const navigate = useNavigate()

  // Mock profile data - in a real app, this would come from the user object
  const mockProfile = {
    name: user?.firstName + " " + user?.lastName || "John Doe",
    businessName: "Restaurant Example",
    role: "restaurant",
  }

  // Updated sidebar items - removed promotions
  const sidebarItems = [
    { title: "Mi lista", href: "/restaurant-panel" },
    { title: "Mis pedidos", href: "/restaurant-panel/orders" },
    { title: "Seguimiento", href: "/restaurant-panel/tracking" },
    { title: "Informe", href: "/restaurant-panel/analytics" },
    { title: "Facturas", href: "/restaurant-panel/invoices" },
    { title: "Mi cuenta", href: "/restaurant-panel/account" },
  ]

  // Filter orders for this restaurant
  useEffect(() => {
    // In a real app, you would filter by the actual restaurant ID
    setRestaurantOrders(orders.filter((order) => order.restaurant === "Restaurante Demo"))

    // Set active tab based on URL path
    const path = location.pathname
    if (path.includes("/analytics")) {
      setActiveTab("analytics")
    } else if (path.includes("/orders")) {
      setActiveTab("orders")
    } else if (path.includes("/tracking")) {
      setActiveTab("tracking")
    } else if (path.includes("/invoices")) {
      setActiveTab("invoices")
    } else if (path.includes("/account")) {
      setActiveTab("account")
    } else {
      setActiveTab("list")
    }
  }, [orders, location.pathname])

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="sticky top-20">
              <Sidebar items={sidebarItems} userInfo={mockProfile} />
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value)
                // Update URL based on selected tab
                switch (value) {
                  case "analytics":
                    navigate("/restaurant-panel/analytics")
                    break
                  case "orders":
                    navigate("/restaurant-panel/orders")
                    break
                  case "tracking":
                    navigate("/restaurant-panel/tracking")
                    break
                  case "invoices":
                    navigate("/restaurant-panel/invoices")
                    break
                  case "account":
                    navigate("/restaurant-panel/account")
                    break
                  default:
                    navigate("/restaurant-panel")
                }
              }}
            >
              {/* <TabsList className="mb-6">
                <TabsTrigger value="list">Mi Lista</TabsTrigger>
                <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
                <TabsTrigger value="tracking">Seguimiento</TabsTrigger>
                <TabsTrigger value="analytics">Análisis</TabsTrigger>
                <TabsTrigger value="invoices">Facturas</TabsTrigger>
                <TabsTrigger value="account">Mi Cuenta</TabsTrigger>
              </TabsList> */}

              <TabsContent value="list">
                <RestaurantList />
              </TabsContent>

              <TabsContent value="orders">
                <h2 className="mb-4 text-2xl font-bold">Mis Pedidos</h2>

                {restaurantOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">No has realizado ningún pedido aún</p>
                      <Button className="mt-4" onClick={() => setActiveTab("list")}>
                        Crear una lista
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {restaurantOrders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <h3 className="font-medium">Pedido #{order.id.slice(-6)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {order.date} {order.time}
                              </p>
                              <p className="mt-1">
                                <span className="font-medium">Total:</span> S/. {order.total}
                              </p>
                            </div>
                            <div className="flex items-center justify-end">
                              <OrderDetails order={order} readOnly />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tracking">
                <h2 className="mb-4 text-2xl font-bold">Seguimiento de Pedidos</h2>

                {restaurantOrders.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground">No hay pedidos para rastrear</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {restaurantOrders.map((order) => (
                      <Card key={order.id}>
                        <CardHeader>
                          <CardTitle>Pedido #{order.id.slice(-6)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <OrderTracking orderId={order.id} status={order.status} readOnly />

                          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <h3 className="mb-2 text-sm font-medium">Detalles del Pedido</h3>
                              <p className="text-sm">Fecha: {order.date}</p>
                              <p className="text-sm">Hora: {order.time}</p>
                              <p className="text-sm">Total: S/. {order.total}</p>
                            </div>
                            <div>
                              <h3 className="mb-2 text-sm font-medium">Productos</h3>
                              <ul className="space-y-1 text-sm">
                                {order.items.slice(0, 3).map((item, idx) => (
                                  <li key={idx}>
                                    {item.quantity} {item.unit} de {item.name}
                                  </li>
                                ))}
                                {order.items.length > 3 && <li>... y {order.items.length - 3} más</li>}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="analytics">
                <RestaurantAnalytics />
              </TabsContent>

              <TabsContent value="invoices">
                <RestaurantInvoiceViewer />
              </TabsContent>

              <TabsContent value="account">
                <RestaurantAccountSettings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
