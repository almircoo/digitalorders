
import { toast } from "react-toastify"

// const API_BASE_URL = "https://digitalorderapi.up.railway.app" //process.env.REACT_APP_API_BASE_URL;
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
