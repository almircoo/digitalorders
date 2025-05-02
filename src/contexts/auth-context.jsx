
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/use-toast"
import { login } from "../services/api"

const AuthContext = createContext(undefined)

// Helper function to safely parse JSON
// const safeJsonParse = (str, fallback = null) => {
//   try {
//     return str ? JSON.parse(str) : fallback
//   } catch (e) {
//     console.error("Error parsing JSON:", e)
//     return fallback
//   }
// }

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Initialize state from sessionStorage to persist across page refreshes
  const [authState, setAuthState] = useState(() => {
    // Try to get auth data from sessionStorage
    const savedAuth = sessionStorage.getItem("authState")
    if (savedAuth) {
      try {
        return JSON.parse(savedAuth)
      } catch (e) {
        console.error("Error parsing saved auth state:", e)
      }
    }

    // Default state if nothing in sessionStorage
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      isAuthenticated: false,
    }
  })

  // Save auth state to sessionStorage whenever it changes
  useEffect(() => {
    if (authState.isAuthenticated) {
      // Only save if authenticated to avoid overwriting with logged-out state
      sessionStorage.setItem("authState", JSON.stringify(authState))
    } else if (sessionStorage.getItem("authState")) {
      // Clear storage on logout
      sessionStorage.removeItem("authState")
    }
  }, [authState])

  // Check if token is expired or invalid with improved error handling
  const isTokenValid = useCallback((token) => {
    if (!token) return false

    try {
      // Basic format check
      const parts = token.split(".")
      if (parts.length !== 3) return false

      // For mock tokens in preview mode, always return true
      if (token === "mock-access-token") return true

      // Try to decode the payload
      const payload = JSON.parse(atob(parts[1]))

      // Add debug logging
      console.log("Token payload:", payload)
      console.log("Token expiration:", payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "No expiration")
      console.log("Current time:", new Date().toLocaleString())
      console.log("Is token valid:", payload.exp * 1000 > Date.now())

      return payload.exp * 1000 > Date.now()
    } catch (error) {
      console.error("Token validation error:", error)
      // If there's an error parsing the token, consider it valid to prevent immediate logout
      return true
    }
  }, [])

  // Sign out function
  const signOut = useCallback(() => {
    console.log("Sign out called")
    // Reset state and clear sessionStorage
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      loading: false,
      isAuthenticated: false,
    })

    // Clear session storage
    sessionStorage.removeItem("authState")

    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    })

    navigate("/login")
  }, [navigate, toast])

  // Auto-logout check on mount and when token changes
  useEffect(() => {
    // const validateSession = () => {
    //   const { accessToken } = authState

    //   // Add debug logging
    //   console.log("Validating session, token exists:", !!accessToken)

    //   if (accessToken && !isTokenValid(accessToken)) {
    //     // Token expired or invalid, log out automatically
    //     console.log("Session expired. Logging out automatically.")
    //     signOut()
    //   }
    // }

    // Don't validate immediately after component mount
    // This gives time for the login process to complete
    // const timeoutId = setTimeout(validateSession, 5000)

    // // Set up periodic validation - increase interval to reduce chances of premature logout
    // const intervalId = setInterval(validateSession, 1000000) // Check every 5 minutes instead of every minute

    // return () => {
    //   clearTimeout(timeoutId)
    //   clearInterval(intervalId)
    // }
  }, [authState, isTokenValid, signOut])

  // Sign in function with improved error handling
  const signIn = async (email, password, role, rememberMe = false) => {
    setAuthState((prev) => ({ ...prev, loading: true }))

    try {
      // Call the API login function
      console.log("Attempting login with:", { email, role })
      const response = await login(email, password, role)
      console.log("Login response:", response)

      // Update state with the response data
      const newAuthState = {
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        loading: false,
        isAuthenticated: true,
        rememberMe,
      }
      console.log('User authe status', newAuthState)
      setAuthState(newAuthState)

      // If using mock data, ensure the token won't be considered expired
      if (response.accessToken === "mock-access-token") {
        console.log("Using mock token - session will be maintained")
      }

      toast({
        title: "Login successful",
        description: `Welcome back! You are logged in as a ${role}.`,
      })

      return true
    } catch (error) {
      console.error("Login error details:", error)
      setAuthState((prev) => ({ ...prev, loading: false, isAuthenticated: false }))

      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive",
      })

      return false
    }
  }

  // Check if user has a specific role
  const hasRole = useCallback(
    (role) => {
      return authState.user?.role === role
    },
    [authState.user],
  )

  // Get user's role
  const getUserRole = useCallback(() => {
    return authState.user?.role || null
  }, [authState.user])

  // Auth context value
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

// funcion para ser llamdo dentro de otros componetes
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
