

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CheckCircle, Clock, Package, Truck } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { MainLayout } from "../components/MainLayout"
import { useOrders } from "../contexts/OrderContext"

export default function OrderDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const { getOrderById, getStatus } = useOrders()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const orderId = params.id
      const orderData = getOrderById(orderId)

      if (orderData) {
        setOrder(orderData)
      }

      setLoading(false)
    }
  }, [params.id, getOrderById])

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8 text-center">
          <p>Loading order details...</p>
        </div>
      </MainLayout>
    )
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">The order you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </MainLayout>
    )
  }

  const status = getStatus(order.id)

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(-6)}</CardTitle>
                <CardDescription>
                  Placed on {order.date} at {order.time}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Order Status</h3>
                    <div className="flex items-center space-x-2">
                      <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {status}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between border-b pb-2">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} {item.unit} - {item.quality}
                            </p>
                          </div>
                          <div className="text-right">
                            <p>S/. {(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              S/. {item.price.toFixed(2)} / {item.unit}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>S/. {order.total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Restaurant</h3>
                    <p>{order.restaurant}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Delivery Location</h3>
                    <p>{order.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Tracking</h3>
                    <div className="space-y-3 mt-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">Order Placed</p>
                          <p className="text-sm text-muted-foreground">
                            {order.date} {order.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock
                          className={`h-5 w-5 ${order.statusIndex >= 1 ? "text-primary" : "text-muted-foreground"} mt-0.5`}
                        />
                        <div>
                          <p className="font-medium">Processing</p>
                          <p className="text-sm text-muted-foreground">Order is being processed</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Package
                          className={`h-5 w-5 ${order.statusIndex >= 2 ? "text-primary" : "text-muted-foreground"} mt-0.5`}
                        />
                        <div>
                          <p className="font-medium">Prepared</p>
                          <p className="text-sm text-muted-foreground">Order is ready for delivery</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Truck
                          className={`h-5 w-5 ${order.statusIndex >= 3 ? "text-primary" : "text-muted-foreground"} mt-0.5`}
                        />
                        <div>
                          <p className="font-medium">On the way</p>
                          <p className="text-sm text-muted-foreground">Order is on its way to you</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
