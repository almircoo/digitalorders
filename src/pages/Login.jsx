
import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { MainLayout } from "../components/MainLayout"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/use-toast"

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, loading, isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("restaurant")
  const [rememberMe, setRememberMe] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || "/"

  // Check if already authenticated and redirect if needed
  useEffect(() => {
    if (isAuthenticated && user && !redirecting) {
      setRedirecting(true)
      const roleBasedPath = `/${user.role}-panel`
      console.log(`Already authenticated as ${user.role}, redirecting to ${roleBasedPath}`)

      // Small delay to ensure state updates have propagated
      setTimeout(() => {
        navigate(roleBasedPath, { replace: true })
      }, 100)
    }
  }, [isAuthenticated, user, navigate, redirecting])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setRedirecting(false)

    try {
      console.log("Submitting login form...")
      const success = await signIn(email, password, role, rememberMe)

      if (success) {
        console.log("Login successful, preparing to redirect...")
        setRedirecting(true)

        // Small delay to ensure auth state is updated
        setTimeout(() => {
          // If there was an attempted access to a specific page, go there
          // Otherwise redirect based on role
          if (from !== "/") {
            console.log(`Redirecting to previously attempted page: ${from}`)
            navigate(from, { replace: true })
          } else {
            // Role-based redirect
            const roleBasedPath = `/${role}-panel`
            console.log(`Redirecting to role-based path: ${roleBasedPath}`)
            navigate(roleBasedPath, { replace: true })

            toast({
              title: "Welcome back!",
              description: `You've been redirected to your ${role} dashboard.`,
            })
          }
        }, 500)
      }
    } catch (error) {
      console.error("Login error:", error)
      setRedirecting(false)
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  // const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [role, setRole] = useState("restaurant");

  // //validador de rutas
  // const auth = useContext(useAuth);

  // // redireciona al perfil a cada perfil (restaurant , provider)
  // useEffect(()=> {
  //     if(auth.accessToken && auth.refreshToken){
  //         navigate(`/${role}-panel`);
  //     }
  // })
  // // funcion bootn para validar el regsitro
  // const handleSubmit = ()=>{
  //     auth.signIn(email, password, role, () => navigate(`/${role}-panel`));
  //     console.log()
  // }

  return (
    <MainLayout>
      <div className="container flex items-center justify-center py-10">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder a su cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
                <Label htmlFor="role">Tipo de Cuenta</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="provider">Proveedor</SelectItem>
                  </SelectContent>
                </Select>
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
