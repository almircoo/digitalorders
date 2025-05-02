import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import { AuthProvider } from "./contexts/AuthContext"
// import { ThemeProvider } from "./components/theme-provider"
import App from "./routes/App"
import { CartProvider } from "./contexts/CartContext"
import { OrdersProvider } from "./contexts/OrderContext"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      </ThemeProvider> */}
       <AuthProvider>
          <OrdersProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </OrdersProvider>
        </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
