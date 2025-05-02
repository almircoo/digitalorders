/**
  Servicio de API
 
 Este módulo proporciona funciones para comunicarse con el backend a través de una API REST.
 Implementa un modo de previsualización que utiliza datos simulados cuando no hay conexión al backend.
 Maneja errores de red, CORS y otros problemas comunes en las solicitudes HTTP.
 */
// API service for making requests to the backend
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL
console.log('load api url:', API_BASE_URL)

// Datos de ejemplo para el modo de previsualización
// Se utilizan cuando no hay conexión al backend o para endpoints no implementados
const sampleData = {
  catalogs: {
    "catalog-1": {
      id: "catalog-1",
      name: "Catálogo 1",
      category: 2,
      items: [
        { name: "Manzana", quality: "Premium", unit: "kg", price: 5.99 },
        { name: "Plátano", quality: "Estándar", unit: "kg", price: 3.99 },
        { name: "Naranja", quality: "Premium", unit: "kg", price: 4.5 },
      ],
      published: true,
    },
    "catalog-2": {
      id: "catalog-2",
      name: "Catálogo 2",
      category: 3,
      items: [
        { name: "Zanahoria", quality: "Orgánica", unit: "kg", price: 2.99 },
        { name: "Tomate", quality: "Premium", unit: "kg", price: 6.5 },
        { name: "Lechuga", quality: "Fresca", unit: "kg", price: 3.25 },
      ],
      published: true,
    },
  },
  orders: [
    {
      id: "order-123456",
      restaurant: "Restaurante Demo",
      location: "Lima, Perú",
      items: [
        { name: "Manzana", quality: "Premium", quantity: 2, unit: "kg", price: 5.99 },
        { name: "Plátano", quality: "Estándar", quantity: 3, unit: "kg", price: 3.99 },
      ],
      total: "25.95",
      date: "2023-05-01",
      time: "14:30:00",
      status: "Registrado",
    },
  ],
  lists: {
    "list-1": {
      id: "list-1",
      name: "Lista 1",
      category: 2,
      items: [],
    },
  },
}

/**
 * Funciones para realizar solicitudes a la API
 
  {string} endpoint - Ruta del endpoint (sin la URL base)
  {Object} options - Opciones de la solicitud
  {Object} [options.data=null] - Datos a enviar en la solicitud
  {string} [options.token=null] - Token de autenticación
  {string} [options.method="GET"] - Método HTTP (GET, POST, PUT, DELETE)
  {Promise<any>} (objeto) Respuesta de la API o datos simulados
 
*/
export async function request(endpoint, { data = null, token = null, method = "GET" } = {}) {
  // Only use real API for authentication endpoints
  const isAuthEndpoint = endpoint.startsWith("/auth")

  // Determinar si usar la API real o datos simulados
  // Solo se usa la API real para endpoints de autenticación y si la URL base está definida
  if (!isAuthEndpoint || !API_BASE_URL) {
    console.log(`Using mock response for ${method} ${endpoint}`)
    return handleMockRequest(endpoint, { data, method })
  }

  // For auth endpoints with API_BASE_URL defined, make real API calls
  const url = `${API_BASE_URL}${endpoint}`
  console.log(`Making ${method} request to: ${url}`)
  // Configurar la solicitud HTTP con las opciones adecuadas
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      
      body: method !== "GET" && method !== "DELETE" && data ? JSON.stringify(data) : null,
    })

    console.log(`Response status: ${response.status}`)

    // If response is successful
    if (response.ok) {
      if (method === "DELETE") {
        return true
      }
      return await response.json()
    }

    // Handle error responses
    try {
      const errorData = await response.json()
      console.error("API error response:", errorData)

      throw {
        message: errorData.message || response.statusText,
        status: response.status,
        errors: errorData,
      }
    } catch (e) {
      if (e instanceof SyntaxError) {
        console.error("Failed to parse error response as JSON")
        throw { message: response.statusText, status: response.status }
      }
      throw e
    }
  } catch (error) {
    console.error("Request failed:", error)

    // Para los puntos finales de autenticación, si la llamada a la API falla, se recurre a datos simulados.
    // Esto permite que la aplicación funcione incluso si la API no funciona.
    if (isAuthEndpoint) {
      console.warn("Authentication API failed, falling back to mock data")
      return handleMockRequest(endpoint, { data, method })
    }

    throw error
  }
}

/**
Maneja solicitudes simuladas para el modo de previsualización
- endpont - Ruta del endpoint
- opcions - Opciones de la solicitud
Datos simulados según el endpoint

*/
function handleMockRequest(endpoint, { data, method }) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Auth endpoints
      if (endpoint === "/auth/login") {
        resolve({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          user: {
            id: "1",
            email: data?.email || "user@example.com",
            firstName: "John",
            lastName: "Doe",
            role: data?.role || "restaurant",
          },
        })
      }
      // Catalog endpoints
      else if (endpoint === "/catalogs") {
        if (method === "GET") {
          resolve(Object.values(sampleData.catalogs))
        } else if (method === "POST" && data) {
          const newCatalog = {
            id: `catalog-${Date.now()}`,
            ...data,
            published: false,
          }
          sampleData.catalogs[newCatalog.id] = newCatalog
          resolve(newCatalog)
        }
      }
      // Specific catalog endpoint
      else if (endpoint.startsWith("/catalogs/") && method === "GET") {
        const catalogId = endpoint.split("/")[2]
        resolve(sampleData.catalogs[catalogId] || null)
      }
      // Orders endpoints
      else if (endpoint === "/orders") {
        if (method === "GET") {
          resolve(sampleData.orders)
        } else if (method === "POST" && data) {
          const newOrder = {
            id: `order-${Date.now()}`,
            ...data,
          }
          sampleData.orders.push(newOrder)
          resolve(newOrder)
        }
      }
      // Shopping lists endpoints
      else if (endpoint === "/lists") {
        if (method === "GET") {
          resolve(Object.values(sampleData.lists))
        } else if (method === "POST" && data) {
          const newList = {
            id: `list-${Date.now()}`,
            ...data,
            items: [],
          }
          sampleData.lists[newList.id] = newList
          resolve(newList)
        }
      }
      // Default response for unhandled endpoints
      else {
        resolve({ message: "Endpoint not implemented in mock mode" })
      }
    }, 500)
  })
}

// Funciones específicas para endpoints de autenticación
// Auth API functions
export async function login(email, password, role) {
  console.log("API Base URL:", API_BASE_URL || "Not defined (using mock data)")

  try {
    return request("/auth/login", {
      data: { email, password, role },
      method: "POST",
    })
  } catch (error) {
    console.error("Login request failed:", error)
    throw error
  }
}

// Funciones para endpoints de catálogos
export async function getCatalogs() {
  return request("/catalogs")
}

// endponit para crear catalogos
export async function createCatalog(catalogData) {
  return request("/catalogs", {
    data: catalogData,
    method: "POST",
  })
}

// Funciones  para endpoints de pedidos para actualizar catalogo
export async function updateCatalog(catalogId, catalogData) {
  return request(`/catalogs/${catalogId}`, {
    data: catalogData,
    method: "PUT",
  })
}

// Order API functions - these will always use mock data
export async function getOrders() {
  return request("/orders")
}

// request para crear orders
export async function createOrder(orderData) {
  return request("/orders", {
    data: orderData,
    method: "POST",
  })
}
// request para actaulizar orsder status
export async function updateOrderStatus(orderId, status) {
  return request(`/orders/${orderId}/status`, {
    data: { status },
    method: "PUT",
  })
}

// list de datos 
export async function getLists() {
  return request("/lists")
}

export async function createList(listData) {
  return request("/lists", {
    data: listData,
    method: "POST",
  })
}

export async function updateList(listId, listData) {
  return request(`/lists/${listId}`, {
    data: listData,
    method: "PUT",
  })
}
