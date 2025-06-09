import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { MainLayout } from "../layouts/MainLayout"
import { useToast } from "../components/ui/use-toast"

export default function Register() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("restaurant")
  const [loading, setLoading] = useState(false)

  // React Hook Form setup
  const {register, handleSubmit, watch, formState: { errors },} = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      // Restaurant fields
      restaurantName: "",
      restaurantAddress: "",
      restaurantPhone: "",
      restaurantRuc: "",
      // Provider fields
      companyName: "",
      providerCategory: "",
      contactNumber: "",
      companyRuc: "",
      location: "",
    },
  })

  // Watch password for confirmation validation
  const password = watch("password")

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    console.log('register data:', data)
    try {
      // Simulate registration delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      })

      // Redirect to login page after successful registration
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
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
                <TabsTrigger value="provider">Proveedor</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Common Fields - Always visible */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === password || "Passwords do not match",
                      })}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                {/* Tab-specific fields */}
                {activeTab === "restaurant" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-lg">Restaurant Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="restaurantName">Nombre del Restaurante</Label>
                      <Input
                        id="restaurantName"
                        {...register("restaurantName", {
                          required: activeTab === "restaurant" ? "Restaurant name is required" : false,
                        })}
                      />
                      {errors.restaurantName && <p className="text-sm text-red-500">{errors.restaurantName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurantAddress">Dirección</Label>
                      <Input
                        id="restaurantAddress"
                        {...register("restaurantAddress", {
                          required: activeTab === "restaurant" ? "Address is required" : false,
                        })}
                      />
                      {errors.restaurantAddress && (
                        <p className="text-sm text-red-500">{errors.restaurantAddress.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurantPhone">Número de Teléfono</Label>
                      <Input
                        id="restaurantPhone"
                        {...register("restaurantPhone", {
                          required: activeTab === "restaurant" ? "Phone number is required" : false,
                        })}
                      />
                      {errors.restaurantPhone && (
                        <p className="text-sm text-red-500">{errors.restaurantPhone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurantRuc">RUC del Restaurante</Label>
                      <Input
                        id="restaurantRuc"
                        {...register("restaurantRuc", {
                          required: activeTab === "restaurant" ? "RUC is required" : false,
                        })}
                      />
                      {errors.restaurantRuc && <p className="text-sm text-red-500">{errors.restaurantRuc.message}</p>}
                    </div>
                  </div>
                )}

                {activeTab === "provider" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-lg">Provider Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa</Label>
                      <Input
                        id="companyName"
                        {...register("companyName", {
                          required: activeTab === "provider" ? "Company name is required" : false,
                        })}
                      />
                      {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="providerCategory">Categoría del Proveedor</Label>
                      <Input
                        id="providerCategory"
                        {...register("providerCategory", {
                          required: activeTab === "provider" ? "Category is required" : false,
                        })}
                      />
                      {errors.providerCategory && (
                        <p className="text-sm text-red-500">{errors.providerCategory.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactNumber">Número de Contacto</Label>
                      <Input
                        id="contactNumber"
                        {...register("contactNumber", {
                          required: activeTab === "provider" ? "Contact number is required" : false,
                        })}
                      />
                      {errors.contactNumber && <p className="text-sm text-red-500">{errors.contactNumber.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyRuc">RUC de la Empresa</Label>
                      <Input
                        id="companyRuc"
                        {...register("companyRuc", {
                          required: activeTab === "provider" ? "Company RUC is required" : false,
                        })}
                      />
                      {errors.companyRuc && <p className="text-sm text-red-500">{errors.companyRuc.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        {...register("location", {
                          required: activeTab === "provider" ? "Location is required" : false,
                        })}
                      />
                      {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                    </div>
                  </div>
                )}

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
