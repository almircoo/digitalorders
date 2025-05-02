"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { useToast } from "../components/ui/use-toast"
import { MainLayout } from "../components/main-layout"
import { requestPasswordReset } from "../lib/api"

export default function PasswordResetRequest() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call the API to request a password reset
      await requestPasswordReset(email)

      toast({
        title: "Solicitud enviada",
        description: "Se ha enviado un enlace para restablecer su contraseña a su email.",
      })

      // Redirect to login page after a delay
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      // Error toast is handled by the API function
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="container flex items-center justify-center py-10">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recuperar Contraseña</CardTitle>
            <CardDescription>
              Ingrese su correo electrónico para recibir un enlace de restablecimiento de contraseña.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Correo Electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Ingrese el email asociado a su cuenta para cambiar su contraseña.
                </p>
              </div>

              <Button type="submit" className="w-full btn-standard" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  "Restablecer Contraseña"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
