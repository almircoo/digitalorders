// import { toast } from "../components/ui/use-toast"

// // Base URL for API requests - can be set in environment variables
// const API_BASE_URL = "https://digitalorderapi.up.railway.app" //import.meta.env.VITE_API_BASE_URL || ""

// // Check if we're in preview mode (no real API available)
// const isPreviewMode = !API_BASE_URL

// /**
//  * Generic request function for API calls
//  */
// export async function request(path, { data = null, token = null, method = "GET" }) {
//   // If in preview mode, use mock responses
//   if (isPreviewMode) {
//     return handleMockRequest(path, { data, method })
//   }

//   const url = API_BASE_URL + path

//   try {
//     const response = await fetch(url, {
//       method,
//       headers: {
//         Authorization: token ? `Bearer ${token}` : "",
//         "Content-Type": "application/json",
//       },
//       body: method !== "GET" && method !== "DELETE" && data ? JSON.stringify(data) : null,
//     })

//     // If response is successful
//     if (response.ok) {
//       if (method === "DELETE") {
//         // DELETE requests typically don't return data
//         return true
//       }
//       return await response.json()
//     }

//     // Handle error responses
//     try {
//       const errorData = await response.json()

//       // Handle 401 Unauthorized errors
//       if (response.status === 401) {
//         // Remove tokens on authentication failure
//         localStorage.removeItem("accessToken")
//         localStorage.removeItem("refreshToken")
//         localStorage.removeItem("role")

//         // Format error messages
//         const errors = Object.keys(errorData).map((k) => `${errorData[k].join(" ")}`)

//         throw {
//           message: errors.join(" "),
//           status: response.status,
//           errors: errorData,
//         }
//       }

//       throw {
//         message: errorData.message || response.statusText,
//         status: response.status,
//         errors: errorData,
//       }
//     } catch (e) {
//       if (e instanceof SyntaxError) {
//         throw { message: response.statusText, status: response.status }
//       }
//       throw e
//     }
//   } catch (error) {
//     // Show toast notification for errors
//     toast({
//       title: "Error",
//       description: error.message || "An unexpected error occurred",
//       variant: "destructive",
//     })

//     throw error
//   }
// }

// /**
//  * Handle mock requests for preview mode
//  */
// function handleMockRequest(path, { data, method }) {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       // Mock responses based on the path and method
//       if (path === "/auth/login/" && method === "POST") {
//         resolve({
//           accessToken: "mock-access-token",
//           refreshToken: "mock-refresh-token",
//           user: {
//             id: "1",
//             email: data.email,
//             firstName: "John",
//             lastName: "Doe",
//             role: data.role,
//           },
//         })
//       } else if (path === "/auth/profile/" && method === "GET") {
//         resolve({
//           id: "1",
//           email: "user@example.com",
//           firstName: "John",
//           lastName: "Doe",
//           role: "restaurant",
//           phone: "+51 987 654 321",
//           country: "Perú",
//           city: "Lima",
//           address: "Av. Lima 123",
//           zipCode: "15001",
//         })
//       } else if (path === "/auth/profile/" && method === "PUT") {
//         resolve(data)
//       } else if (path === "/auth/password-reset-request/" && method === "POST") {
//         resolve({ success: true })
//       } else if (path === "/auth/change-password/" && method === "POST") {
//         resolve({ success: true })
//       } else {
//         reject({ message: "Not implemented in mock mode" })
//       }
//     }, 1000) // Simulate network delay
//   })
// }
import { toast } from "react-toastify"

const API_BASE_URL = "https://digitalorderapi.up.railway.app" //process.env.REACT_APP_API_BASE_URL;
// funcion para llamar API usando fetch request
function request(path, { data = null, token = null, method = "GET" }) {
  return fetch(path, {
    method,
    headers: {
      Authorization: token ? `Bearer ${token}` : "", // se usa token( en Bearer) si no se usa JWT
      "Content-Type": "application/json",
    },
    body: method !== "GET" && method !== "DELETE" ? JSON.stringify(data) : null,
  })
    .then((response) => {
      // Si la resquesta es correcta
      if (response.ok) {
        if (method === "DELETE") {
          // Si se elimina no devuelve nada
          return true
        }
        return response.json()
      }

      // De lo contrario, si hay errores
      return response
        .json()
        .then((json) => {
          // Maneja errores en JSON, de respuesta del servidor

          if (!response.ok) {
            // response.status === 400
            // Elimina el token si sucede algun error
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")

            const errors = Object.keys(json).map((k) => `${json[k].join(" ")}`)
            throw new Error(errors.join(" "))
          }
          throw new Error(JSON.stringify(json))
        })
        .catch((e) => {
          if (e.name === "SyntaxError") {
            throw new Error(response.statusText)
          }
          throw new Error(e)
        })
    })
    .catch((e) => {
      // Captura todos lso errores
      toast(e.message, { type: "error" })
    })
}
/**
 * Authentication API functions
 */
export async function signIn(email, password, role) {
  return request("/auth/login/", {
    data: { email, password, role },
    method: "POST",
  })
}

export async function registerUser(formData) {
  return request("/auth/register/", {
    data: formData,
    method: "POST",
  })
}

export async function userProfile(token) {
  return request("/auth/profile/", { token })
}

export async function requestPasswordReset(email) {
  return request("/auth/password-reset-request/", {
    data: { email },
    method: "POST",
  })
}

export async function resetPassword(token, password) {
  return request("/auth/password-reset/", {
    data: { token, password },
    method: "POST",
  })
}

export async function updateProfile(token, userData) {
  return request("/auth/profile/", {
    data: userData,
    token,
    method: "PUT",
  })
}

export async function changePassword(token, currentPassword, newPassword) {
  return request("/auth/change-password/", {
    data: { currentPassword, newPassword },
    token,
    method: "POST",
  })
}
