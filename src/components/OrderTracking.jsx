
import { ClipboardListIcon, TruckIcon, ClipboardCheckIcon, InboxIcon, BuildingIcon } from "lucide-react"
import { Button } from "./ui/button"

const stepsIcons = [
  { name: "Registrado", icon: <ClipboardCheckIcon className="h-5 w-5" /> },
  { name: "Aprobado", icon: <ClipboardListIcon className="h-5 w-5" /> },
  { name: "Preparado", icon: <InboxIcon className="h-5 w-5" /> },
  { name: "Llevando", icon: <TruckIcon className="h-5 w-5" /> },
  { name: "Entregado", icon: <BuildingIcon className="h-5 w-5" /> },
]

export function OrderTracking({ orderId, status, onUpdateStatus, readOnly = false }) {
  const currentStep = stepsIcons.findIndex((s) => s.name === status)

  return (
    <div className="w-full">
      <div className="relative mb-8 mt-4">
        {/* barra de prgroso */}
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-muted"></div>

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {stepsIcons.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index <= currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-background"
                }`}
              >
                {step.icon}
              </div>
              <span className="mt-2 text-xs font-medium">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {!readOnly && onUpdateStatus && (
        <div className="flex justify-center">
          <Button
            onClick={() => onUpdateStatus(orderId)}
            disabled={currentStep >= stepsIcons.length - 1}
            className="btn-standard"
          >
            {currentStep < stepsIcons.length - 1 ? "Avanzar Estado" : "Finalizado"}
          </Button>
        </div>
      )}
    </div>
  )
}
