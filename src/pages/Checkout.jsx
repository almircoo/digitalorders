
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, CreditCard, Landmark, Truck, ArrowLeft } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { MainLayout } from "../layouts/MainLayout"
import { useCart } from "../contexts/CartContext"
import { useOrders } from "../contexts/OrderContext"
import { useToast } from "../components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"

export default function Checkout() {
  const navigate = useNavigate()
  const { items, clearCart, total } = useCart()
  const { addOrder } = useOrders()
  const { toast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  // detalles de targeta
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })
  // 
  const [isProcessing, setIsProcessing] = useState(false)

  // verifica si el checkout tiene itmes sino redirige a cart
  if (items.length === 0) {
    navigate("/cart")
    return null
  }
  // maneja los cambios en las targetas 
  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  // Maneja el pedido
  const handlePlaceOrder = () => {
    // valida los fields
    if (!deliveryAddress) {
      toast({
        title: "Dirección requerida",
        description: "Por favor ingresa una dirección de entrega",
        variant: "destructive",
      })
      return
    }

    if (paymentMethod === "credit-card") {
      // Valida los detalles de la targeta
      if (!cardDetails.cardNumber || !cardDetails.cardHolder || !cardDetails.expiryDate || !cardDetails.cvv) {
        toast({
          title: "Detalles de tarjeta incompletos",
          description: "Por favor completa todos los campos de la tarjeta",
          variant: "destructive",
        })
        return
      }
    }

    // Simula el proceso success de pago = true
    setIsProcessing(true)

    setTimeout(() => {
      // Create order
      const order = {
        restaurant: "Restaurante Demo", // en real pagina - aqui cargar datos del perfil de usauro
        location: deliveryAddress,
        items,
        total: total.toFixed(2),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: "Registrado",
        paymentMethod,
        additionalNotes,
      }

      const orderId = addOrder(order)
      clearCart()

      toast({
        title: "¡Pago exitoso!",
        description: "Tu pedido ha sido registrado y está siendo procesado",
      })

      navigate(`/orders/${orderId}`) // redirige ala lista de pedidos
    }, 3000)
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <Button variant="ghost" className="mb-4 flex items-center gap-2" onClick={() => navigate("/cart")}>
          <ArrowLeft className="h-4 w-4" /> Volver al carrito
        </Button>

        <h1 className="mb-6 text-2xl font-bold text-center">Finalizar Compra</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" /> Dirección de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ingresa la dirección completa de entrega"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" /> Tarjeta de Crédito/Débito
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Label htmlFor="bank-transfer" className="flex items-center gap-2">
                      <Landmark className="h-4 w-4" /> Transferencia Bancaria
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardDetails.cardNumber}
                        onChange={handleCardDetailsChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardHolder">Titular de la Tarjeta</Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="Nombre como aparece en la tarjeta"
                        value={cardDetails.cardHolder}
                        onChange={handleCardDetailsChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Fecha de Expiración</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/AA"
                          value={cardDetails.expiryDate}
                          onChange={handleCardDetailsChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank-transfer" && (
                  <div className="mt-4 p-4 bg-muted rounded-md">
                    <p className="font-medium">Instrucciones para Transferencia Bancaria:</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>Banco: Banco Nacional de Perú</li>
                      <li>Cuenta: 123-456789-0</li>
                      <li>Titular: Restaurante Demo S.A.</li>
                      <li>Referencia: Tu número de pedido</li>
                    </ul>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Una vez realizada la transferencia, envía el comprobante a pagos@restaurantedemo.com
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notas Adicionales</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Instrucciones especiales para la entrega o preparación (opcional)"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity} x {item.name} ({item.quality})
                      </span>
                      <span>S/. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>S/. {total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Envío</span>
                      <span>Gratis</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-4">
                      <span>Total</span>
                      <span>S/. {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full mt-6 btn-standard" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                        Procesando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" /> Confirmar y Pagar
                      </span>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
