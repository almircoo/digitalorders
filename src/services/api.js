/*
En lugar de hacer peticiones a un servidor real,
este servicio simula respuestas usando datos de ejemplo.
En una aplicación real, estas funciones harían peticiones HTTP
a un servidor backend.
 */

// Datos de ejemplo para la aplicación
const mockData = {
  // Catálogos de productos
  catalogs: [
    {
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
    {
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
    {
      id: "catalog-3",
      name: "Catálogo 3",
      category: 4,
      items: [
        { name: "Leche", quality: "Entera", unit: "L", price: 4.25 },
        { name: "Queso", quality: "Fresco", unit: "kg", price: 12.99 },
        { name: "Yogurt", quality: "Natural", unit: "L", price: 5.75 },
      ],
      published: true,
    },
  ],

  // Pedidos
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
    {
      id: "order-789012",
      restaurant: "Restaurante Demo",
      location: "Lima, Perú",
      items: [
        { name: "Zanahoria", quality: "Orgánica", quantity: 1, unit: "kg", price: 2.99 },
        { name: "Tomate", quality: "Premium", quantity: 2, unit: "kg", price: 6.5 },
      ],
      total: "15.99",
      date: "2023-05-02",
      time: "10:15:00",
      status: "En Proceso",
    },
  ],

  // Listas de compras
  lists: [
    {
      id: "list-1",
      name: "Lista 1",
      category: 2,
      items: [],
    },
  ],

  // Usuarios
  users: [
    {
      id: "1",
      email: "restaurant@email.com",
      firstName: "John",
      lastName: "Doe",
      role: "restaurant",
    },
    {
      id: "2",
      email: "provider@email.com",
      firstName: "Jane",
      lastName: "Smith",
      role: "provider",
    },
  ],
}

// Función principal para simular peticiones a la API

export async function request(endpoint, { data = null, method = "GET" } = {}) {
  console.log(`API Simulada: ${method} ${endpoint}`)


  // AUTENTICACIÓN
  if (endpoint === "/auth/login") {
    const { email, role } = data || {}

    // Buscar usuario con el email y rol indicados
    const user = mockData.users.find((u) => u.email === email && u.role === role)

    if (user) {
      // Simular inicio de sesión exitoso
      return {
        accessToken: "token-de-ejemplo",
        refreshToken: "refresh-token-de-ejemplo",
        user,
      }
    } else {
      // Simular error de autenticación
      throw new Error("Credenciales inválidas")
    }
  }

  // === CATÁLOGOS ===
  if (endpoint === "/catalogs") {
    if (method === "GET") {
      // Devolver todos los catálogos
      return [...mockData.catalogs]
    } else if (method === "POST" && data) {
      // Crear un nuevo catálogo
      const newCatalog = {
        id: `catalog-${Date.now()}`, // ID único basado en la fecha
        ...data,
      }
      mockData.catalogs.push(newCatalog)
      return newCatalog
    }
  }

  // Obtener un catálogo específico por ID
  if (endpoint.startsWith("/catalogs/") && method === "GET") {
    const catalogId = endpoint.split("/")[2]
    const catalog = mockData.catalogs.find((c) => c.id === catalogId)
    return catalog || null
  }

  // Actualizar un catálogo
  if (endpoint.startsWith("/catalogs/") && method === "PUT") {
    const catalogId = endpoint.split("/")[2]
    const catalogIndex = mockData.catalogs.findIndex((c) => c.id === catalogId)

    if (catalogIndex !== -1) {
      // Actualizar el catálogo existente
      mockData.catalogs[catalogIndex] = {
        ...mockData.catalogs[catalogIndex],
        ...data,
      }
      return mockData.catalogs[catalogIndex]
    }

    throw new Error("Catálogo no encontrado")
  }

  // === ÓRDENES ===
  if (endpoint === "/orders") {
    if (method === "GET") {
      // Devolver todas las órdenes
      return [...mockData.orders]
    } else if (method === "POST" && data) {
      // Crear una nueva orden
      const newOrder = {
        id: `order-${Date.now()}`, // ID único basado en la fecha
        ...data,
        status: "Registrado", // Estado inicial de toda orden
      }
      mockData.orders.push(newOrder)
      return newOrder
    }
  }

  // Actualizar el estado de una orden
  if (endpoint.startsWith("/orders/") && endpoint.endsWith("/status") && method === "PUT") {
    const orderId = endpoint.split("/")[2]
    const orderIndex = mockData.orders.findIndex((o) => o.id === orderId)

    if (orderIndex !== -1) {
      // Actualizar el estado de la orden
      mockData.orders[orderIndex].status = data.status
      return mockData.orders[orderIndex]
    }

    throw new Error("Orden no encontrada")
  }

  // === LISTAS DE COMPRAS ===
  if (endpoint === "/lists") {
    if (method === "GET") {
      // Devolver todas las listas
      return [...mockData.lists]
    } else if (method === "POST" && data) {
      // Crear una nueva lista
      const newList = {
        id: `list-${Date.now()}`, // ID único basado en la fecha
        ...data,
      }
      mockData.lists.push(newList)
      return newList
    }
  }

  // Actualizar una lista
  if (endpoint.startsWith("/lists/") && method === "PUT") {
    const listId = endpoint.split("/")[2]
    const listIndex = mockData.lists.findIndex((l) => l.id === listId)

    if (listIndex !== -1) {
      // Actualizar la lista existente
      mockData.lists[listIndex] = {
        ...mockData.lists[listIndex],
        ...data,
      }
      return mockData.lists[listIndex]
    }

    throw new Error("Lista no encontrada")
  }

  // Si llegamos aquí, el endpoint no está implementado
  return { message: "Endpoint no implementado en modo simulado" }
}

// Iniciar sesión
export async function login(email, password, role) {
  try {
    return request("/auth/login", {
      data: { email, password, role },
      method: "POST",
    })
  } catch (error) {
    console.error("Error en solicitud de login:", error)
    throw error
  }
}

//  Obtener todos los catálogos
export async function getCatalogs() {
  return request("/catalogs")
}

// Crear un nuevo catálogo
export async function createCatalog(catalogData) {
  return request("/catalogs", {
    data: catalogData,
    method: "POST",
  })
}

//  Actualizar un catálogo existente
export async function updateCatalog(catalogId, catalogData) {
  return request(`/catalogs/${catalogId}`, {
    data: catalogData,
    method: "PUT",
  })
}
// Obtener todas las órdenes
export async function getOrders() {
  return request("/orders")
}
// Crear una nueva orden
export async function createOrder(orderData) {
  return request("/orders", {
    data: orderData,
    method: "POST",
  })
}

// Actualizar el estado de una orden
export async function updateOrderStatus(orderId, status) {
  return request(`/orders/${orderId}/status`, {
    data: { status },
    method: "PUT",
  })
}

// Obtiene todas las listas
export async function getLists() {
  return request("/lists")
}

// Crear una nueva lista
export async function createList(listData) {
  return request("/lists", {
    data: listData,
    method: "POST",
  })
}

// Actualizar una lista existente
export async function updateList(listId, listData) {
  return request(`/lists/${listId}`, {
    data: listData,
    method: "PUT",
  })
}
