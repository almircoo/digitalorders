
import { createContext, useState, useContext } from "react"

const CartContext = createContext(undefined)

// Inicializar con un array vacio 
export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  // Add item to cart
  const addItem = (item) => {
    // verifica si hay items
    const existingIndex = items.findIndex((i) => i.id === item.id)

    if (existingIndex >= 0) {
      // actualiza las cantidad si hay items de productos
      updateQuantity(existingIndex, items[existingIndex].quantity + item.quantity)
    } else {
      // agrega nuevos items al ya existente 
      setItems((prev) => [...prev, item]) //conserva los datos 
    }
  }

  // Remove items del cart
  const removeItem = (index) => {
    setItems((prev) => {
      const updated = [...prev]
      updated.splice(index, 1)
      return updated
    })
  }

  // actauliza la cantidad de items en el cart
  const updateQuantity = (index, quantity) => {
    setItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], quantity }
      return updated
    })
  }

  // limpia el carrito
  const clearCart = () => {
    setItems([])
  }

  // Calculate cuantos itemes hay en el cart
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Calcula el precio total de los proctos en el cart
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Hook - funcion pra ser usado en otro componente
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
