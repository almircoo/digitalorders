// se encarga de proteger rutas que requieren que el usuario esté autenticado, 
// independientemente de su rol (restaurant o provider).
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // verifica si el sistema esta cargando información de autenticación
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // Si el usuario no está autenticado redirige al usuario a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

//   Si el usuario está autenticado, renderiza los componentes hijos (`children`)
// Esto permite que el contenido protegido se muestre solo a usuarios autenticados
  return children
}
