import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/use-toast"
import { signIn as login, getUserProfile } from "../apis"

// Este contexto va a manejar todo lo relacionado con la autenticación
const AuthContext = createContext(undefined)

// Mapeo para convertir los roles del backend a frontend
const ROLE_MAPPING_REVERSE = {
  1: "restaurant",
  2: "provider"
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Inicializamos el estado desde sessionStorage. Esta lógica se ejecuta solo una vez.
  const [authState, setAuthState] = useState(() => {
    try {
      const saved = sessionStorage.getItem("authState")
      if (saved) {
        const parsedState = JSON.parse(saved)
        if (parsedState.isAuthenticated && parsedState.accessToken) {
          // Convertir el rol del backend a frontend si existe
          if (parsedState.user && parsedState.user.role) {
            parsedState.user.role = ROLE_MAPPING_REVERSE[parsedState.user.role] || parsedState.user.role
          }
          return {
            ...parsedState,
            isInitializing: false, // La inicialización ha terminado si hay estado guardado
          }
        }
      }
    } catch (err) {
      console.error("No se pudo parsear el estado de auth guardado:", err)
      // Si hay un error, limpiar el storage para evitar problemas futuros
      sessionStorage.removeItem("authState")
    }

    // Estado inicial por defecto si no hay nada guardado o si hubo un error
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      isAuthenticated: false,
      profile: null,
      isInitializing: false, // Por defecto, se considera inicializado si no hay sesión
    }
  })

  // Carga el perfil del usuario desde el backend
  const loadUserProfile = useCallback(async (token) => {
    try {
      console.log("Cargando perfil de usuario...")
      const profileData = await getUserProfile(token)
      console.log("Datos de perfil cargados:", profileData)

      setAuthState(prev => ({ ...prev, profile: profileData }))
      return profileData
    } catch (error) {
      console.error("Error al cargar perfil de usuario:", error)
      // Si es un error 404, el perfil podría no existir (usuario nuevo)
      if (error.message.includes("404") || error.message.includes("Not found")) {
        console.log("Perfil no encontrado - el usuario podría ser nuevo")
        setAuthState(prev => ({ ...prev, profile: null }))
        return null
      }
      
      toast({
        title: "Error al cargar perfil",
        description: "No se pudo cargar la información del perfil.",
        variant: "destructive",
      })
      return null
    }
  }, [toast])

  // Efecto para cargar el perfil si ya estamos autenticados y el perfil no se ha cargado
  useEffect(() => {
    // Solo cargar el perfil si no estamos inicializando, estamos autenticados y no tenemos el perfil
    if (!authState.isInitializing && authState.isAuthenticated && authState.accessToken && !authState.profile) {
      loadUserProfile(authState.accessToken)
    }
  }, [authState.isAuthenticated, authState.accessToken, authState.profile, authState.isInitializing, loadUserProfile])


  // Persistimos el estado en sessionStorage cada vez que cambie authState,
  // pero solo si la inicialización ha terminado
  useEffect(() => {
    if (!authState.isInitializing) {
      if (authState.isAuthenticated) {
        sessionStorage.setItem("authState", JSON.stringify(authState))
      } else {
        sessionStorage.removeItem("authState")
      }
    }
  }, [authState, authState.isInitializing]) // Añadir isInitializing como dependencia para reaccionar a su cambio

  // Cerrar sesión
  const signOut = useCallback(() => {
    console.log("Sesión cerrada manualmente")

    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      isAuthenticated: false,
      profile: null,
      isInitializing: false, // Al cerrar sesión, ya no estamos inicializando
    })

    sessionStorage.removeItem("authState")

    toast({
      title: "Sesión finalizada",
      description: "Has salido correctamente.",
    })

    navigate("/login")
  }, [navigate, toast])

  // Maneja el login del usuario
  const signIn = async (email, password, role, rememberMe = false) => {
    setAuthState(prev => ({ ...prev, loading: true }))

    try {
      console.log("Iniciando sesión con:", email, role)
      const result = await login(email, password, role)
      const userStringRole = {
        ...result.user,
        role: ROLE_MAPPING_REVERSE[result.user.role] || result.user.role
      }
      console.log("Rol de usuario convertido:", userStringRole)

      const newState = {
        user: userStringRole,
        accessToken: result.access,
        refreshToken: result.refresh,
        loading: false,
        isAuthenticated: true,
        rememberMe,
        profile: null, // El perfil se cargará en el siguiente efecto
        isInitializing: false, // Login exitoso, la inicialización ha terminado
      }

      setAuthState(newState)

      // Cargar el perfil inmediatamente después de un inicio de sesión exitoso
      await loadUserProfile(result.access)

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido de nuevo, ${userStringRole.first_name}.`,
      })

      return true
    } catch (err) {
      console.error("Error durante el login:", err)

      setAuthState(prev => ({
        ...prev,
        loading: false,
        isAuthenticated: false,
        profile: null, // Asegurar que el perfil se limpia en caso de error
      }))

      toast({
        title: "Error de inicio de sesión",
        description: err.message || "Verifica tus datos e intenta de nuevo.",
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
    ...authState, // Desestructura todo el estado para mayor concisión
    signIn,
    signOut,
    hasRole,
    getUserRole,
    loadUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth debe estar dentro de un AuthProvider.")
  }
  return ctx
}