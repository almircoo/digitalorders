"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { getOrders, createOrder, updateOrderStatus as apiUpdateOrderStatus } from "../services/api"

const OrdersContext = createContext(undefined)

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState([])

  // Load orders from API on mount
  useEffect(() => {
    async function fetchOrders() {
      try {
        const ordersData = await getOrders()
        setOrders(ordersData)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      }
    }

    fetchOrders()
  }, [])

  // Remove localStorage loading effect

  // Remove localStorage saving effect

  // Add a new order
  const addOrder = async (order) => {
    try {
      const newOrder = await createOrder(order)
      setOrders((prev) => [...prev, newOrder])
      return newOrder.id
    } catch (error) {
      console.error("Failed to create order:", error)
      return null
    }
  }

  // Get an order by ID
  const getOrder = (id) => {
    return orders.find((order) => order.id === id)
  }

  // Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      await apiUpdateOrderStatus(id, status)
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
    } catch (error) {
      console.error("Failed to update order status:", error)
    }
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        getOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

// Hook
export function useOrders() {
  const context = useContext(OrdersContext)
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider")
  }
  return context
}
