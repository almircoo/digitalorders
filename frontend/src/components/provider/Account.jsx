import { useState, useEffect } from "react"
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

import { updateUserProfile } from "@/apis"
import { useAuth } from "@/contexts/AuthContext"
import AccountSettings  from "../../components/settings/AccountSettings"

export function ProviderAccountSettings() {
  // const { toast } = useToast()
  // const { user, profile, accessToken, loadUserProfile } = useAuth()
  // const [isLoading, setIsLoading] = useState(false)
  // const [activeTab, setActiveTab] = useState("general")

  // const isProvider = user?.role === 'provider';

  // Initialize form data with profile data or defaults
  // const [formData, setFormData] = useState({
  //   // General info
  //   companyName: "",
  //   description: "",
  //   email: "",
  //   phone: "",

  //   // Address
  //   address: "",
  //   city: "",
  //   state: "",
  //   zipCode: "",
  //   country: "",

  //   // Business details
  //   businessType: "corporation",
  //   taxId: "",
  //   foundedYear: "",

  //   // Preferences
  //   emailNotifications: true,
  //   smsNotifications: false,
  //   orderUpdates: true,
  //   marketingEmails: false,

  //   // Profile image
  //   profileImage: null,
  // })

  // Load profile data when component mounts or profile changes
  // useEffect(() => {
  //   if (profile && user?.role === "provider") {
  //     const providerData = profile.provider || {}
  //     const userProfileData = profile.user_profile || {}
      
  //     setFormData({
  //       // General info
  //       companyName: providerData.company_name || "",
  //       description: providerData.description || "",
  //       email: providerData.email || user.email || "",
  //       phone: providerData.phone || userProfileData.phone || "",

  //       // Address
  //       address: providerData.address || userProfileData.address || "",
  //       city: providerData.city || userProfileData.city || "",
  //       state: providerData.state || "",
  //       zipCode: providerData.zip_code || userProfileData.zip_code || "",
  //       country: providerData.country || userProfileData.country || "",

  //       // Business details
  //       businessType: providerData.business_type || "corporation",
  //       taxId: providerData.tax_id || "",
  //       foundedYear: providerData.founded_year || "",

  //       // Preferences
  //       emailNotifications: providerData.email_notifications ?? true,
  //       smsNotifications: providerData.sms_notifications ?? false,
  //       orderUpdates: providerData.order_updates ?? true,
  //       marketingEmails: providerData.marketing_emails ?? false,

  //       // Profile image
  //       profileImage: providerData.profile_image || null,
  //     })
  //   } else if (user?.role === "provider" && profile === null) {
  //     // For new users, initialize with user's email
  //     setFormData(prev => ({
  //       ...prev,
  //       email: user.email || "",
  //     }))
  //   }
  // }, [profile, user])

  // const handleChange = (e) => {
  //   const { name, value } = e.target
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }))
  // }

  // const handleSwitchChange = (name, checked) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: checked,
  //   }))
  // }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   try {
  //     // Prepare data for backend
  //     const updateData = {
  //       first_name: user.first_name,
  //       last_name: user.last_name,
  //       user_profile: {
  //         phone: formData.phone,
  //         address: formData.address,
  //         city: formData.city,
  //         country: formData.country,
  //         zip_code: formData.zipCode,
  //       },
  //       provider_profile: {
  //         company_name: formData.companyName,
  //         description: formData.description,
  //         email: formData.email,
  //         phone: formData.phone,
  //         address: formData.address,
  //         city: formData.city,
  //         state: formData.state,
  //         zip_code: formData.zipCode,
  //         country: formData.country,
  //         business_type: formData.businessType,
  //         tax_id: formData.taxId,
  //         founded_year: formData.foundedYear,
  //         email_notifications: formData.emailNotifications,
  //         sms_notifications: formData.smsNotifications,
  //         order_updates: formData.orderUpdates,
  //         marketing_emails: formData.marketingEmails,
  //       }
  //     }

  //     await updateUserProfile(updateData, accessToken)
      
  //     // Reload profile data to get updated information
  //     await loadUserProfile(accessToken)

  //     toast({
  //       title: "Cambios guardados",
  //       description: "La información de tu cuenta ha sido actualizada exitosamente.",
  //     })
  //   } catch (error) {
  //     console.error("Error updating profile:", error)
  //     toast({
  //       title: "Error al guardar",
  //       description: "No se pudieron guardar los cambios. Intenta de nuevo.",
  //       variant: "destructive",
  //     })
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0]
  //   if (file) {
  //     // In a real app, you would upload the file to a server
  //     // For now, we'll just store it in state
  //     setFormData((prev) => ({
  //       ...prev,
  //       profileImage: URL.createObjectURL(file),
  //     }))

  //     toast({
  //       title: "Imagen subida",
  //       description: "Tu imagen de perfil ha sido actualizada.",
  //     })
  //   }
  // }

  return (
    <>
      <AccountSettings />
    </>
    // <div className="space-y-6">
    //   <div className="flex items-center justify-between">
    //     <h2 className="text-3xl font-bold tracking-tight">Configuración de Cuenta</h2>
    //   </div>

    //   <Tabs value={activeTab} onValueChange={setActiveTab}>
    //     <TabsList className="mb-6">
    //       <TabsTrigger value="general">Información General</TabsTrigger>
    //       <TabsTrigger value="address">Dirección</TabsTrigger>
    //       <TabsTrigger value="business">Datos Comerciales</TabsTrigger>
    //       <TabsTrigger value="preferences">Preferencias</TabsTrigger>
    //     </TabsList>

    //     <form onSubmit={handleSubmit}>
    //       <Card>
    //         <CardContent className="pt-6">
    //           <TabsContent value="general" className="space-y-4">
    //             <div className="flex flex-col md:flex-row gap-6">
    //               <div className="md:w-1/4 flex flex-col items-center">
    //                 <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-muted mb-4">
    //                   {formData.profileImage ? (
    //                     <img
    //                       src={formData.profileImage || "/placeholder.svg"}
    //                       alt="Profile"
    //                       className="w-full h-full object-cover"
    //                     />
    //                   ) : (
    //                     <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
    //                       <span className="text-6xl">🏢</span>
    //                     </div>
    //                   )}
    //                 </div>
    //                 <div className="relative">
    //                   <Button variant="outline" className="flex items-center gap-2" type="button">
    //                     <Upload className="h-4 w-4" />
    //                     <span>Subir imagen</span>
    //                     <input
    //                       type="file"
    //                       className="absolute inset-0 opacity-0 cursor-pointer"
    //                       accept="image/*"
    //                       onChange={handleImageUpload}
    //                     />
    //                   </Button>
    //                 </div>
    //               </div>

    //               <div className="md:w-3/4 space-y-4">
    //                 <div className="space-y-2">
    //                   <Label htmlFor="company_name">Nombre de la Empresa</Label>
    //                   <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} />
    //                 </div>

    //                 <div className="space-y-2">
    //                   <Label htmlFor="description">Descripción</Label>
    //                   <Textarea
    //                     id="description"
    //                     name="description"
    //                     value={formData.description}
    //                     onChange={handleChange}
    //                     rows={4}
    //                   />
    //                 </div>

    //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                   <div className="space-y-2">
    //                     <Label htmlFor="email">Correo Electrónico</Label>
    //                     <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
    //                   </div>

    //                   <div className="space-y-2">
    //                     <Label htmlFor="phone">Teléfono</Label>
    //                     <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </TabsContent>

    //           <TabsContent value="address" className="space-y-4">
    //             <div className="space-y-2">
    //               <Label htmlFor="address">Dirección</Label>
    //               <Input id="address" name="address" value={formData.address} onChange={handleChange} />
    //             </div>

    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //               <div className="space-y-2">
    //                 <Label htmlFor="city">Ciudad</Label>
    //                 <Input id="city" name="city" value={formData.city} onChange={handleChange} />
    //               </div>

    //               <div className="space-y-2">
    //                 <Label htmlFor="state">Estado/Provincia</Label>
    //                 <Input id="state" name="state" value={formData.state} onChange={handleChange} />
    //               </div>
    //             </div>

    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //               <div className="space-y-2">
    //                 <Label htmlFor="zip_code">Código Postal</Label>
    //                 <Input id="zip_code" name="zip_code" value={formData.zip_code} onChange={handleChange} />
    //               </div>

    //               <div className="space-y-2">
    //                 <Label htmlFor="country">País</Label>
    //                 <Input id="country" name="country" value={formData.country} onChange={handleChange} />
    //               </div>
    //             </div>
    //           </TabsContent>

    //           <TabsContent value="business" className="space-y-4">
    //             <div className="space-y-2">
    //               <Label htmlFor="business_type">Tipo de Empresa</Label>
    //               <Select
    //                 value={formData.business_type}
    //                 onValueChange={(value) => handleChange({ target: { name: "business_type", value } })}
    //               >
    //                 <SelectTrigger>
    //                   <SelectValue placeholder="Selecciona un tipo" />
    //                 </SelectTrigger>
    //                 <SelectContent>
    //                   <SelectItem value="sole_proprietor">Persona Natural con Negocio</SelectItem>
    //                   <SelectItem value="partnership">Sociedad</SelectItem>
    //                   <SelectItem value="corporation">Corporación</SelectItem>
    //                   <SelectItem value="cooperative">Cooperativa</SelectItem>
    //                   <SelectItem value="llc">Sociedad de Responsabilidad Limitada</SelectItem>
    //                 </SelectContent>
    //               </Select>
    //             </div>

    //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //               <div className="space-y-2">
    //                 <Label htmlFor="tax_id">RUC</Label>
    //                 <Input id="tax_id" name="tax_id" value={formData.tax_id} onChange={handleChange} />
    //               </div>

    //               <div className="space-y-2">
    //                 <Label htmlFor="founded_year">Año de Fundación</Label>
    //                 <Input id="founded_year" name="founded_year" value={formData.founded_year} onChange={handleChange} />
    //               </div>
    //             </div>
    //           </TabsContent>

    //           <TabsContent value="preferences" className="space-y-4">
    //             <div className="space-y-4">
    //               <div className="flex items-center justify-between">
    //                 <div className="space-y-0.5">
    //                   <Label htmlFor="email_notifications">Notificaciones por Email</Label>
    //                   <p className="text-sm text-muted-foreground">
    //                     Recibe actualizaciones importantes por correo electrónico
    //                   </p>
    //                 </div>
    //                 <Switch
    //                   id="email_notifications"
    //                   checked={formData.email_notifications}
    //                   onCheckedChange={(checked) => handleSwitchChange("email_notifications", checked)}
    //                 />
    //               </div>

    //               <div className="flex items-center justify-between">
    //                 <div className="space-y-0.5">
    //                   <Label htmlFor="sms_notifications">Notificaciones por SMS</Label>
    //                   <p className="text-sm text-muted-foreground">Recibe alertas por mensaje de texto</p>
    //                 </div>
    //                 <Switch
    //                   id="sms_notifications"
    //                   checked={formData.sms_notifications}
    //                   onCheckedChange={(checked) => handleSwitchChange("sms_notifications", checked)}
    //                 />
    //               </div>

    //               <div className="flex items-center justify-between">
    //                 <div className="space-y-0.5">
    //                   <Label htmlFor="order_updates">Actualizaciones de Pedidos</Label>
    //                   <p className="text-sm text-muted-foreground">
    //                     Recibe notificaciones sobre cambios en tus pedidos
    //                   </p>
    //                 </div>
    //                 <Switch
    //                   id="order_updates"
    //                   checked={formData.order_updates}
    //                   onCheckedChange={(checked) => handleSwitchChange("order_updates", checked)}
    //                 />
    //               </div>

    //               <div className="flex items-center justify-between">
    //                 <div className="space-y-0.5">
    //                   <Label htmlFor="marketing_emails">Emails de Marketing</Label>
    //                   <p className="text-sm text-muted-foreground">Recibe ofertas especiales y novedades</p>
    //                 </div>
    //                 <Switch
    //                   id="marketing_emails"
    //                   checked={formData.marketing_emails}
    //                   onCheckedChange={(checked) => handleSwitchChange("marketing_emails", checked)}
    //                 />
    //               </div>
    //             </div>
    //           </TabsContent>

    //           <div className="flex justify-end mt-6">
    //             <Button type="submit" className="btn-standard" disabled={isLoading}>
    //               {isLoading ? (
    //                 <>
    //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    //                   Guardando...
    //                 </>
    //               ) : (
    //                 "Guardar Cambios"
    //               )}
    //             </Button>
    //           </div>
    //         </CardContent>
    //       </Card>
    //     </form>
    //   </Tabs>
    // </div>
  )
}
