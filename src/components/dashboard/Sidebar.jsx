
import { Link, useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export function Sidebar({ items, userInfo }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signOut } = useAuth()

  const handleSignOut = () => {
    // aqui logica de logout
    signOut()
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    })
    navigate("/login")
  }

  return (
    <Card className="flex h-full flex-col justify-between rounded-xl border p-4">
      <div>
        <div className="mb-6">
          <p className="font-bold capitalize">{userInfo.name}</p>
          <hr className="my-2" />
          <p className="text-primary font-semibold">{userInfo.businessName}</p>
        </div>

        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                location.pathname === item.href
                  ? "bg-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <Button variant="ghost" className="mt-auto justify-start text-muted-foreground" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </Card>
  )
}
