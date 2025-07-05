// extiende la funcionalidad de la ruta privada, 
// añadiendo verificación de roles específicos a restaurnat y provider.
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/use-toast"
import { useEffect } from "react"

export function RoleRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, isInitializing, getUserRole } = useAuth()
  const location = useLocation()
  const { toast } = useToast()

  const currentRole = getUserRole()

  useEffect(() => {
    //para mostrar notificaciones cuando sea necesario 
    if (isAuthenticated && !loading && currentRole && !allowedRoles.includes(currentRole)) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this area. Redirecting to your dashboard.`,
        variant: "destructive",
      })
    }
  }, [isAuthenticated, loading, currentRole, allowedRoles, toast])

  // verrifica la caraga de la informacion al authenticar
  if (isInitializing) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // si no esta autehnticaion regidirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // si el usuario está autenticado pero no tiene uno de los roles permitidos:
  // Construye una ruta de redirección basada en el rol 
  // Redirige al usuario a su panel correspondiente
  if (currentRole && !allowedRoles.includes(currentRole)) {
    const redirectPath = `/${currentRole}-panel`
    return <Navigate to={redirectPath} replace />
  }

  // Si el usuario está autenticado y tiene uno de los roles permitidos carga los componete shijos
  return children
}
