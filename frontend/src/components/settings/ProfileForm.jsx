

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useToast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export function ProfileForm({ user }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { accessToken } = useAuth()
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    country: user?.country || "",
    city: user?.city || "",
    address: user?.address || "",
    zipCode: user?.zipCode || "",
  })

  // Maneja los cambios
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!accessToken) {
        throw new Error("No estás autenticado")
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada exitosamente.",
      })
    } catch (error) {
      // Error toast is handled by the API function
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Ingrese su nombre"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Apellido
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Ingrese su apellido"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo Electrónico
          </label>
          <Input
            id="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Número de Teléfono
          </label>
          <Input id="phone" name="phone" placeholder="+51 987 654 321" value={formData.phone} onChange={handleChange} />
        </div>

        <h3 className="mt-6 text-lg font-medium">Dirección Personal</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              País
            </label>
            <Input id="country" name="country" placeholder="Perú" value={formData.country} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              Ciudad
            </label>
            <Input id="city" name="city" placeholder="Lima" value={formData.city} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Dirección
            </label>
            <Input
              id="address"
              name="address"
              placeholder="Av. Lima 123"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="zipCode" className="text-sm font-medium">
              Código Postal
            </label>
            <Input id="zipCode" name="zipCode" placeholder="15001" value={formData.zipCode} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="btn-standard" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  )
}
