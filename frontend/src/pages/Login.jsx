import { useState} from "react"
import { Link, useNavigate} from "react-router-dom"
import { useForm, Controller} from "react-hook-form"
import { Loader2 } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { MainLayout } from "../layouts/MainLayout"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/use-toast"

// Role mapping constants
const ROLE_MAPPING = {
  restaurant: 1,  // Frontend string -> Backend integer
  provider: 2    // Frontend string -> Backend integer
}

export default function Login() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  // const [role, setRole] = useState("restaurant")
  const [rememberMe, setRememberMe] = useState(false)

  // React Hook Form setup
  const {register, handleSubmit, control, formState: { errors },} = useForm({
    defaultValues: {
      email: "",
      password: "",
      role: "restaurant", // Frontend uses string values
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      // Keep the original string role for frontend routing
      const roleString = data.role // "restaurant" or "provider"
      
      // Convert to integer only for backend API call
      const backendRoleId = ROLE_MAPPING[roleString]
      
      console.log("Role conversion:", { roleString, backendRoleId })
      
      // Send integer role to backend
      const success = await signIn(data.email, data.password, backendRoleId, rememberMe)
      
      console.log("Login success:", { success, roleString })
      
      if (success) {
        // Always use the string role for frontend routing
        const roleBasedPath = `/${roleString}-panel`
        console.log("Redirecting to:", roleBasedPath)
        navigate(roleBasedPath, { replace: true })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder a su cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is requirido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo Invalido",
                    },
                  })}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                {/* <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /> */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password ies requirido",
                    minLength: {
                      value: 8,
                      message: "La contraseña debe tener al menos 8 caracteres",
                    },
                  })}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Cuenta</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de cuenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="provider">Proveedor</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} />
                  <Label htmlFor="remember" className="text-sm">
                    Recordar
                  </Label>
                </div>
                <Link to="/password-reset-request" className="text-sm text-primary hover:underline">
                  Olvidaste tu contraseña?
                </Link>
              </div>
              <Button type="submit" className="w-full btn-standard" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
              <div className="text-center text-sm">
                Aun no tienes cuenta?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Registrate
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
