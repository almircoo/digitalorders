
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/use-toast"
import { login } from "../services/api"

// Este contexto va a manejar todo lo relacionado con la autenticación
const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Cargamos estado inicial desde sessionStorage, si existe algo guardado
  const [authState, setAuthState] = useState(() => {
    const saved = sessionStorage.getItem("authState")

    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        console.error("No se pudo parsear el estado de auth guardado:", err)
      }
    }

    // Default si no hay nada guardado
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      isAuthenticated: false,
    }
  })

  // Persistimos el estado en sessionStorage siempre que cambie
  useEffect(() => {
    if (authState.isAuthenticated) {
      sessionStorage.setItem("authState", JSON.stringify(authState))
    } else {
      sessionStorage.removeItem("authState") // limpiamos si se cierra sesión
    }
  }, [authState])

  // Cerrar session
  const signOut = useCallback(() => {
    console.log("Sesión cerrada manualmente")

    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      isAuthenticated: false,
    })

    sessionStorage.removeItem("authState")

    toast({
      title: "Sesión finalizada",
      description: "Has salido correctamente",
    })

    navigate("/login")
  }, [navigate, toast])

  // Validación periódica deshabilitada por ahora — revisar más adelante

  // Maneja el login del usuario
  const signIn = async (email, password, role, rememberMe = false) => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      console.log("Iniciando sesión con:", email, role)
      const result = await login(email, password, role)

      const newState = {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        loading: false,
        isAuthenticated: true,
        rememberMe,
      }

      setAuthState(newState)

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido de nuevo, rol: ${role}`,
      })

      return true
    } catch (err) {
      console.error("Error durante login:", err)

      setAuthState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
      }))

      toast({
        title: "Error de inicio de sesión",
        description: err.message || "Verifica tus datos e intenta de nuevo",
        variant: "destructive",
      })

      return false
    }
  }

  // Chequea si el usuario tiene un rol específico
  const hasRole = useCallback((roleName) => {
    return authState.user?.role === roleName
  }, [authState.user])

  // Devuelve el rol actual del usuario
  const getUserRole = useCallback(() => {
    return authState.user?.role ?? null
  }, [authState.user])

  // Valores expuestos desde el contexto
  const value = {
    user: authState.user,
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    rememberMe: authState.rememberMe,
    signIn,
    signOut,
    hasRole,
    getUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth debe estar dentro de un AuthProvider")
  }
  return ctx
}

