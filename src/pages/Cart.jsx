import { useNavigate } from "react-router-dom"
import { Trash2 } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { MainLayout } from "../layouts/MainLayout"
import { useCart } from "../contexts/CartContext"
// import { useOrders } from "../contexts/OrderContext"
import { useToast } from "../components/ui/use-toast"

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, total } = useCart()
  // const { addOrder } = useOrders()
  const { toast } = useToast()
  // Verificamos que sea un número válido y mayor a cero
  const handleQuantityChange = (index, value) => {
    const quantity = Number.parseInt(value) // combierte el dato string a 
    if (!isNaN(quantity) && quantity > 0) {
      // ctualizamos la cantidad
      updateQuantity(index, quantity)
    }
  }

  // rgb(40, 67, 59)

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos a tu carrito antes de realizar un pedido",
        variant: "destructive",
      })
      return
    }
    // clearCart()
    navigate("/checkout")
    
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
                    Proceder al Pago
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