import React, { useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form" // Import useForm

import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { MainLayout } from "../layouts/MainLayout"
import { useToast } from "../components/ui/use-toast"

import { registerUser } from '../apis'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { 
  RESTAURANT_BUSINESS_TYPES, 
  PROVIDER_BUSINESS_TYPES,
  getRestaurantTypeName,
  getProviderTypeName
} from "../lib/constants"

// Helper function to get business type key from value
const getBusinessTypeKey = (value, isRestaurant = true) => {
  const mapping = isRestaurant ? RESTAURANT_BUSINESS_TYPES : PROVIDER_BUSINESS_TYPES;
  return Object.keys(mapping).find(key => mapping[key] === value);
};

export default function Register() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState(1)
  const [loading, setLoading] = useState(false)

  const {register, handleSubmit, watch, setValue, control, // Used to programmatically set form values
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      password2: "",
      role: 1, // Default role
      // Initialize nested objects for conditional fields
      restaurant_profile: {
        restaurant_name: "",
        // description: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        business_type: 1, // Keep as integer for backend
        tax_id: "",
        founded_year: "",
      },
      provider_profile: {
        company_name: "",
        // description: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        business_type: 1, // Keep as integer for backend
        tax_id: "",
        founded_year: "",
      },
    },
  })

  // Watch password field for validation
  const password = watch("password");

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update the 'role' field in react-hook-form state
    setValue("role", tab);
  }

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      // Clean up the form data before sending
      const cleanedData = {
        ...formData,
        // Ensure role is a number
        role: Number(formData.role),
        // Clean up nested objects
        restaurant_profile: formData.restaurant_profile ? {
          ...formData.restaurant_profile,
          business_type: Number(formData.restaurant_profile.business_type),
          founded_year: formData.restaurant_profile.founded_year ? 
            Number(formData.restaurant_profile.founded_year) : "",
        } : undefined,
        provider_profile: formData.provider_profile ? {
          ...formData.provider_profile,
          business_type: Number(formData.provider_profile.business_type),
          founded_year: formData.provider_profile.founded_year ? 
            Number(formData.provider_profile.founded_year) : "",
        } : undefined,
      };

      // Remove undefined profiles based on role
      if (cleanedData.role === 1) {
        delete cleanedData.provider_profile;
      } else {
        delete cleanedData.restaurant_profile;
      }

      await registerUser(cleanedData);
      console.log('register payload:', cleanedData); 
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please check your information and try again. " + (error.response?.data?.message || error.message),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container flex items-center justify-center py-10">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
                <TabsTrigger value={1}>Restaurant</TabsTrigger>
                <TabsTrigger value={2}>Proveedor</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      <Label htmlFor="first_name">Nombre</Label>
                      <Input
                      id="first_name"
                      {...register("first_name", {
                          required: "First name is required",
                      })}
                      />
                      {errors.first_name && <p className="text-sm text-red-500">{errors.first_name.message}</p>}
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="last_name">Apellido</Label>
                      <Input
                      id="last_name"
                      {...register("last_name", {
                          required: "Last name is required",
                      })}
                      />
                      {errors.last_name && <p className="text-sm text-red-500">{errors.last_name.message}</p>}
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
                      <Label htmlFor="password2">Confirmar Contraseña</Label>
                      <Input
                      id="password2"
                      type="password"
                      {...register("password2", {
                          required: "Please confirm your password",
                          validate: (value) => value === password || "Passwords do not match",
                      })}
                      />
                      {errors.password2 && <p className="text-sm text-red-500">{errors.password2.message}</p>}
                  </div>
                </div>
                {/* Tab-specific fields */}

                {activeTab === 1 && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-lg">Restaurant Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant_name">Nombre del Restaurante</Label>
                      <Input
                        id="restaurant_name"
                        {...register("restaurant_profile.restaurant_name", {
                          required: activeTab === 1 ? "Restaurant name is required" : false,
                        })}
                      />
                      {errors.restaurant_name && <p className="text-sm text-red-500">{errors.restaurant_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant_address">Dirección</Label>
                      <Input
                        id="restaurant_address"
                        {...register("restaurant_profile.restaurant_address", {
                          required: activeTab === "restaurant" ? "Address is required" : false,
                        })}
                      />
                      {errors.restaurant_address && (
                        <p className="text-sm text-red-500">{errors.restaurant_address.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant_phone">Número de Teléfono</Label>
                      <Input
                        id="restaurant_phone"
                        {...register("restaurant_profile.restaurant_phone", {
                          required: activeTab === "restaurant" ? "Phone number is required" : false,
                        })}
                      />
                      {errors.restaurant_phone && (
                        <p className="text-sm text-red-500">{errors.restaurant_phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant_ruc">RUC del Restaurante</Label>
                      <Input
                        id="restaurant_ruc"
                        {...register("restaurant_profile.restaurant_ruc", {
                          required: activeTab === "restaurant" ? "RUC is required" : false,
                        })}
                      />
                      {errors.restaurant_ruc && <p className="text-sm text-red-500">{errors.restaurant_ruc.message}</p>}
                    </div>
                    {/* Add other restaurant-specific fields here, ensuring they are registered with react-hook-form */}
                    <div className="space-y-2">
                      <Label htmlFor="restaurant_description">Descripción</Label>
                      <Input
                        id="restaurant_description"
                        {...register("restaurant_profile.restaurant_description")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant_email">Correo Corporativo</Label>
                      <Input
                        id="restaurant_email"
                        type="email"
                        {...register("restaurant_profile.email")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city_restaurant">Ciudad</Label>
                      <Input
                        id="restaurant_city"
                        {...register("restaurant_profile.city")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state_restaurant">Estado</Label>
                      <Input
                        id="restaurant_state"
                        {...register("restaurant_profile.state")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code_restaurant">Código Postal</Label>
                      <Input
                        id="restaurant_zip_code"
                        {...register("restaurant_profile.zip_code")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country_restaurant">País</Label>
                      <Input
                        id="restaurant_country"
                        {...register("restaurant_profile.country")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_type">Tipo de Negocio</Label>
                      <Controller
                        name="restaurant_profile.business_type"
                        control={control}
                        render={({ field }) => (
                          <Select
                            // The value for the Select component needs to be the string
                            value={getRestaurantTypeName(field.value)}
                            onValueChange={(selectedString) => {
                              const intValue = RESTAURANT_BUSINESS_TYPES[selectedString];
                              field.onChange(intValue); // This updates the react-hook-form state
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Elegir tipo de restaurante" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(RESTAURANT_BUSINESS_TYPES).map((typeName) => (
                                <SelectItem key={typeName} value={typeName}>
                                  {typeName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded_year_restaurant">Año de Fundación</Label>
                      <Input
                        id="restaurant_founded_year"
                        type="number"
                        {...register("restaurant_profile.founded_year")}
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label htmlFor="capacity_restaurant">Capacidad</Label>
                      <Input
                        id="restaurant_capacity"
                        type="number"
                        {...register("restaurant_profile.capacity")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="opening_hours_restaurant">Horario de Apertura</Label>
                      <Input
                        id="restaurant_opening_hours"
                        {...register("restaurant_profile.opening_hours")}
                      />
                    </div> */}
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="font-medium text-lg">Provider Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nombre de la Empresa</Label>
                      <Input
                        id="company_name"
                        {...register("provider_profile.company_name", {
                          required: activeTab === 2 ? "Company name is required" : false,
                        })}
                      />
                      {errors.company_name && <p className="text-sm text-red-500">{errors.company_name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="provider_category">Categoría del Proveedor</Label>
                      <Input
                        id="provider_category"
                        {...register("provider_profile.provider_category", {
                          required: activeTab === 2 ? "Category is required" : false,
                        })}
                      />
                      {errors.provider_category && (
                        <p className="text-sm text-red-500">{errors.provider_category.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Número de Contacto</Label>
                      <Input
                        id="phone"
                        {...register("provider_profile.phone", {
                          required: activeTab === "provider" ? "Contact number is required" : false,
                        })}
                      />
                      {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_ruc">RUC de la Empresa</Label>
                      <Input
                        id="company_ruc"
                        {...register("provider_profile.tax_id", {
                          required: activeTab === "provider" ? "Company RUC is required" : false,
                        })}
                      />
                      {errors.company_ruc && <p className="text-sm text-red-500">{errors.company_ruc.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        {...register("provider_profile.address", {
                          required: activeTab === "provider" ? "Location is required" : false,
                        })}
                      />
                      {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                    </div>
                    {/* Add other provider-specific fields here, ensuring they are registered with react-hook-form */}
                    {/* <div className="space-y-2">
                      <Label htmlFor="description_provider">Descripción</Label>
                      <Input
                        id="description_provider"
                        {...register("description_provider")}
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="corp_email_provider">Correo Corporativo</Label>
                      <Input
                        id="corp_email_provider"
                        type="email"
                        {...register("provider_profile.email")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city_provider">Ciudad</Label>
                      <Input
                        id="city_provider"
                        {...register("provider_profile.city")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state_provider">Estado</Label>
                      <Input
                        id="state_provider"
                        {...register("provider_profile.state")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code_provider">Código Postal</Label>
                      <Input
                        id="zip_code_provider"
                        {...register("provider_profile.zip_code")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country_provider">País</Label>
                      <Input
                        id="country_provider"
                        {...register("provider_profile.country")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_type_provider">Tipo de Negocio</Label>
                      <Controller
                        name="provider_profile.business_type"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={getProviderTypeName(field.value)}
                            onValueChange={(selectedString) => {
                              const intValue = PROVIDER_BUSINESS_TYPES[selectedString];
                              field.onChange(intValue);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Elegir tipo de negocio" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(PROVIDER_BUSINESS_TYPES).map((typeName) => (
                                <SelectItem key={typeName} value={typeName}>
                                  {typeName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                        
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="founded_year_provider">Año de Fundación</Label>
                      <Input
                        id="provider_founded_year"
                        type="number"
                        {...register("provider_profile.founded_year")}
                      />
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
