import { createContext, useState, useContext } from "react"

// Creamos el contexto del carrito de compras
const CartContext = createContext(undefined)

// Este componente se encarga de envolver nuestra app con el contexto del carrito
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]) // empezamos con un carrito vacío

  // Añadir producto al carrito
  const addItem = (newItem) => {
    const foundIndex = cartItems.findIndex(product => product.id === newItem.id)

    if (foundIndex !== -1) {
      // Si ya existe el producto, actualizamos su cantidad
      const newQty = cartItems[foundIndex].quantity + newItem.quantity
      updateQuantity(foundIndex, newQty)
    } else {
      // Si es nuevo, simplemente lo añadimos al final del array
      setCartItems(prev => [...prev, newItem])
    }
  }

  // Eliminar producto por índice — esto podría mejorarse usando el id pero dejémoslo así por ahora
  const removeItem = (itemIndex) => {
    setCartItems(prev => {
      const cloned = [...prev]  // No mutamos directamente el estado original
      cloned.splice(itemIndex, 1)  // quitamos ese elemento
      return cloned
    })
  }

  // Modificar la cantidad de un producto específico
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      // En caso de que la cantidad sea 0 o menos, lo quitamos directamente
      removeItem(index)
      return
    }

    setCartItems(prevCart => {
      const cartCopy = [...prevCart]
      cartCopy[index] = {
        ...cartCopy[index],
        quantity: newQuantity,
      }
      return cartCopy
    })
  }

  // Vaciamos todo el carrito
  const clearCart = () => {
    setCartItems([])  // más simple no se puede
  }

  // Total de artículos (no productos únicos, sino sumatoria de cantidades)
  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  // Total de precio a pagar
  const total = cartItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity)
  }, 0)

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
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

// typo Hook para acceder al carrito desde cualquier componente
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error("useCart debe estar dentro de un CartProvider — verifica el árbol de componentes")
  }
  return ctx
}
