"use client"

import { useNavigate } from "react-router-dom"
import { Trash2 } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { MainLayout } from "../components/main-layout"
import { useCart } from "../contexts/cart-context"
import { useOrders } from "../contexts/order-context"
import { useToast } from "../components/ui/use-toast"

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()
  const { addOrder } = useOrders()
  const { toast } = useToast()

  const handleQuantityChange = (index, value) => {
    const quantity = Number.parseInt(value)
    if (!isNaN(quantity) && quantity > 0) {
      updateQuantity(index, quantity)
    }
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos a tu carrito antes de realizar un pedido",
        variant: "destructive",
      })
      return
    }

    const order = {
      restaurant: "Restaurante Demo", // In a real app, fetch from user profile
      location: "Lima, Perú",
      items,
      total: total.toFixed(2),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: "Registrado",
    }

    const orderId = addOrder(order)
    clearCart()

    toast({
      title: "Pedido realizado",
      description: "Tu pedido ha sido registrado y está siendo procesado",
    })

    navigate(`/orders/${orderId}`)
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="mb-6 text-2xl font-bold text-center">Carrito de Compras</h1>

        <Card>
          <CardHeader>
            <CardTitle>Productos en el Carrito</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tu carrito está vacío</p>
                <Button className="mt-4 btn-standard" onClick={() => navigate("/restaurant-panel")}>
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 font-medium mb-4 text-center">
                  <div className="col-span-3 md:col-span-4">Producto</div>
                  <div className="col-span-2">Calidad</div>
                  <div className="col-span-2">Cantidad</div>
                  <div className="col-span-1">Unidad</div>
                  <div className="col-span-2">Precio</div>
                  <div className="col-span-2 md:col-span-1">Subtotal</div>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 items-center text-center border-b pb-4">
                      <div className="col-span-3 md:col-span-4 text-left">{item.name}</div>
                      <div className="col-span-2">{item.quality}</div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e.target.value)}
                          className="w-16 mx-auto text-center"
                        />
                      </div>
                      <div className="col-span-1">{item.unit}</div>
                      <div className="col-span-2">S/. {item.price.toFixed(2)}</div>
                      <div className="col-span-1">S/. {(item.price * item.quantity).toFixed(2)}</div>
                      <div className="col-span-1">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <div className="text-lg font-semibold">Total:</div>
                  <div className="text-xl font-bold">S/. {total.toFixed(2)}</div>
                </div>

                <div className="mt-8 text-center">
                  <Button className="btn-standard w-full md:w-auto px-8 py-2" onClick={handleCheckout}>
                    Realizar Pedido
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
