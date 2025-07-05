import { createContext, useState, useContext, useEffect } from "react"
import { getOrders, createOrder, updateOrderStatus as apiUpdateOrderStatus } from "../components/ui/api"

// Contexto para los pedidos — este sirve como contenedor global
const OrdersContext = createContext(undefined)

// Este componente envuelve la aplicación y provee los pedidos
export function OrdersProvider({ children }) {
  const [ordersList, setOrdersList] = useState([])  // Nota: cambié el nombre solo para variar un poco

  useEffect(() => {
    // Esto debería ejecutarse solo una vez al montar
    const initFetch = async () => {
      try {
        const fetchedOrders = await getOrders()
        setOrdersList(fetchedOrders)
      } catch (err) {
        // Probablemente deberíamos notificar al usuario también
        console.error("No se pudieron cargar los pedidos:", err)
      }
    }

    initFetch()
  }, [])

  // Función para agregar un nuevo pedido
  const addOrder = async (orderData) => {
    try {
      const added = await createOrder(orderData)
      // Añado a la lista actual — puede que luego necesitemos reordenar por fecha
      setOrdersList(prevOrders => [...prevOrders, added])
      return added.id
    } catch (e) {
      console.error("Error al intentar crear un nuevo pedido:", e)
      return null  // no hay mucho más que hacer en este caso
    }
  }

  // Devuelve el pedido con el ID indicado, si existe
  const getOrderById = (orderId) => {
    // Notar que esto no es muy eficiente si hay muchos pedidos
    return ordersList.find(o => o.id === orderId)
  }

  // Cambia el estado del pedido — usualmente cuando avanza en el proceso
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiUpdateOrderStatus(orderId, newStatus)
      // Actualizamos localmente también para reflejar el cambio
      setOrdersList(current => 
        current.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      )
    } catch (err) {
      console.error("No se pudo actualizar el estado del pedido:", err)
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders: ordersList,
        addOrder,
        getOrder: getOrderById, // Nombrado un poco más explícitamente
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

// Hook para consumir el contexto — más limpio que usar useContext directamente
export function useOrders() {
  const ctx = useContext(OrdersContext)

  if (!ctx) {
    // Esto puede pasar si alguien intenta usar el hook fuera del provider
    throw new Error("useOrders debe ser usado dentro de un OrdersProvider — verifícalo en el árbol de componentes")
  }

  return ctx
}



/**
Contexto de Orders
Este usecontext maneja todo lo relacionado con las pedidos:
- Lista de órdenes
 - Crear nuevas órdenes
- Buscar órdenes específicas
- Actualizar el estado de las órdenes
 */
