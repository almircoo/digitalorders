
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { OrderTracking } from "./OrderTracking"

export function OrderDetails({ order, onUpdateStatus, isProvider = false }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Ver detalles</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del Pedido #{order.id.slice(-6)}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-2 text-sm font-medium">Restaurante</h4>
              <p>{order.restaurant}</p>
            </div>
            <div>
              <h4 className="mb-2 text-sm font-medium">Ubicación</h4>
              <p>{order.location}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Fecha y Hora</h4>
            <p>
              {order.date} {order.time}
            </p>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium">Estado</h4>
            <Badge variant="outline" className="bg-primary/20 text-primary">
              {order.status}
            </Badge>
          </div>

          <OrderTracking
            orderId={order.id}
            status={order.status}
            onUpdateStatus={isProvider ? onUpdateStatus : undefined}
            readOnly={!isProvider}
          />

          <div>
            <h4 className="mb-2 text-sm font-medium">Productos</h4>
            <div className="max-h-[200px] overflow-y-auto rounded-md border p-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="mb-2 border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span>S/. {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit} - {item.quality}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between border-t pt-4 font-medium">
            <span>Total</span>
            <span>S/. {order.total}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
