

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"

export function RestaurantAccountSettings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Mock restaurant data - in a real app, this would come from an API or context
  const [formData, setFormData] = useState({
    // General info
    restaurantName: "Restaurant Example",
    description: "We are a cozy restaurant specializing in traditional Peruvian cuisine with a modern twist.",
    email: "contact@restaurantexample.com",
    phone: "+51 987 654 321",
    website: "www.restaurantexample.com",

    // Address
    address: "Av. Lima 456",
    city: "Lima",
    state: "Lima",
    zipCode: "15001",
    country: "Perú",

    // Business details
    businessType: "restaurant",
    taxId: "20123456789",
    foundedYear: "2015",
    capacity: "80",
    openingHours: "11:00 - 23:00",

    // Preferences
    emailNotifications: true,
    smsNotifications: false,
    orderUpdates: true,
    marketingEmails: false,

    // Profile image
    profileImage: null,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Cambios guardados",
      description: "La información de tu restaurante ha sido actualizada exitosamente.",
    })

    setIsLoading(false)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just store it in state
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
      }))

      toast({
        title: "Imagen subida",
        description: "La imagen de tu restaurante ha sido actualizada.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Configuración de Restaurante</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="address">Dirección</TabsTrigger>
          <TabsTrigger value="business">Datos Comerciales</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="pt-6">
              <TabsContent value="general" className="space-y-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4 flex flex-col items-center">
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-muted mb-4">
                      {formData.profileImage ? (
                        <img
                          src={formData.profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          <span className="text-6xl">🍽️</span>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <Button variant="outline" className="flex items-center gap-2" type="button">
                        <Upload className="h-4 w-4" />
                        <span>Subir imagen</span>
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </Button>
                    </div>
                  </div>

                  <div className="md:w-3/4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="restaurantName">Nombre del Restaurante</Label>
                      <Input
                        id="restaurantName"
                        name="restaurantName"
                        value={formData.restaurantName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input id="website" name="website" value={formData.website} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="address" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado/Provincia</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input id="country" name="country" value={formData.country} onChange={handleChange} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="business" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de Restaurante</Label>
                  <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleChange({ target: { name: "businessType", value } })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurante</SelectItem>
                      <SelectItem value="cafe">Café</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="fast_food">Comida Rápida</SelectItem>
                      <SelectItem value="food_truck">Food Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxId">RUC</Label>
                    <Input id="taxId" name="taxId" value={formData.taxId} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">Año de Fundación</Label>
                    <Input id="foundedYear" name="foundedYear" value={formData.foundedYear} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidad (personas)</Label>
                    <Input id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="openingHours">Horario de Atención</Label>
                    <Input
                      id="openingHours"
                      name="openingHours"
                      value={formData.openingHours}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones importantes por correo electrónico
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">Notificaciones por SMS</Label>
                      <p className="text-sm text-muted-foreground">Recibe alertas por mensaje de texto</p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={formData.smsNotifications}
                      onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderUpdates">Actualizaciones de Pedidos</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones sobre cambios en tus pedidos
                      </p>
                    </div>
                    <Switch
                      id="orderUpdates"
                      checked={formData.orderUpdates}
                      onCheckedChange={(checked) => handleSwitchChange("orderUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketingEmails">Emails de Marketing</Label>
                      <p className="text-sm text-muted-foreground">Recibe ofertas especiales y novedades</p>
                    </div>
                    <Switch
                      id="marketingEmails"
                      checked={formData.marketingEmails}
                      onCheckedChange={(checked) => handleSwitchChange("marketingEmails", checked)}
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="flex justify-end mt-6">
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
            </CardContent>
          </Card>
        </form>
      </Tabs>
    </div>
  )
}
