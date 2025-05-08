/**
  Componente principal de la aplicación
  Este componente configura todas las rutas de la aplicación utilizando React Router.
  Define las rutas públicas (Home, Login, Register) y las rutas protegidas que requieren autenticación
  (RestaurantPanel, ProviderPanel, etc.).
**/
import { Routes, Route } from "react-router-dom"
import { Toaster } from "../components/ui/toaster"

// Pages
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Cart from "../pages/Cart"
import RestaurantPanel from "../pages/RestaurantPanel"
import ProviderPanel from "../pages/ProviderPanel"
import OrderDetails from "../pages/OrderDetails"
import Settings from "../pages/Settings"
import PasswordResetRequest from "../pages/PasswordResetRequest"
import Checkout from "../pages/Checkout"
// Auth components
import { PrivateRoute } from "./PrivateRoute"
import { RoleRoute } from "./RoleRoute"

function App() {
  return (
    <>
      <Routes>
        {/* rutas publicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />

        {/* Protected routes - require authentication */}
        <Route  path="/cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />
        <Route path="/orders/:id" element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
        <Route path="/settings" element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Restaurnat routes */}
        <Route  path="/restaurant-panel/*" element={
            <RoleRoute allowedRoles={["restaurant"]}>
              <RestaurantPanel />
            </RoleRoute>
          }
        />
        <Route  path="/provider-panel/*" element={
            <RoleRoute allowedRoles={["provider"]}>
              <ProviderPanel />
            </RoleRoute>
          }
        />
      </Routes>
      {/* componente Toaster para mostrar notificaciones en toda la aplicación. */}
      <Toaster />
    </>
  )
}

export default App
