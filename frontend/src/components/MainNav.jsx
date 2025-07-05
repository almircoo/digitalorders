
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Search, User } from "lucide-react"

import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"

export function MainNav() {
  const navigate = useNavigate()
  const { user, isAuthenticated, signOut } = useAuth()
  const { itemCount } = useCart()

  const handleSignOut = () => {
    signOut()
  }

  const userDisplayName = user?.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim() 
    : (user?.email || "My Account");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          DigitalOrder
        </Link>

        <div className="flex w-full max-w-sm items-center mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="w-full rounded-full pl-8 pr-4" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full bg-secondary text-secondary-foreground"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline capitalize">{ userDisplayName }</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/${user?.role}-panel`)}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
