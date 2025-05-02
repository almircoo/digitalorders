

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { MainLayout } from "../components/MainLayout"
import { useToast } from "../components/ui/use-toast"

export default function Register() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("restaurant")
  const [loading, setLoading] = useState(false)

  // Common form fields
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Restaurant fields
  const [restaurantName, setRestaurantName] = useState("")
  const [restaurantAddress, setRestaurantAddress] = useState("")
  const [restaurantPhone, setRestaurantPhone] = useState("")
  const [restaurantRuc, setRestaurantRuc] = useState("")

  // Provider fields
  const [companyName, setCompanyName] = useState("")
  const [providerCategory, setProviderCategory] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [companyRuc, setCompanyRuc] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock registration - replace with actual registration logic
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registration successful",
        description: "Please check your email to verify your account",
      })

      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please check your information and try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container flex items-center justify-center py-10">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                <TabsTrigger value="provider">Proveedor</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common Fields */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Restaurant Fields */}
                <TabsContent value="restaurant" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="restaurantName">Nombre del Restaurante</Label>
                    <Input
                      id="restaurantName"
                      value={restaurantName}
                      onChange={(e) => setRestaurantName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restaurantAddress">Dirección</Label>
                    <Input
                      id="restaurantAddress"
                      value={restaurantAddress}
                      onChange={(e) => setRestaurantAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restaurantPhone">Número de Teléfono</Label>
                    <Input
                      id="restaurantPhone"
                      value={restaurantPhone}
                      onChange={(e) => setRestaurantPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="restaurantRuc">RUC del Restaurante</Label>
                    <Input
                      id="restaurantRuc"
                      value={restaurantRuc}
                      onChange={(e) => setRestaurantRuc(e.target.value)}
                      required
                    />
                  </div>
                </TabsContent>

                {/* Provider Fields */}
                <TabsContent value="provider" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la Empresa</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="providerCategory">Categoría del Proveedor</Label>
                    <Input
                      id="providerCategory"
                      value={providerCategory}
                      onChange={(e) => setProviderCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Número de Contacto</Label>
                    <Input
                      id="contactNumber"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyRuc">RUC de la Empresa</Label>
                    <Input
                      id="companyRuc"
                      value={companyRuc}
                      onChange={(e) => setCompanyRuc(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                  </div>
                </TabsContent>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Registrarse"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Ya tienes una cuenta?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Iniciar Sesión
                  </Link>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
