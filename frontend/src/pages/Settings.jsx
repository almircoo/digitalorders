

import { useState } from "react"
import { MainLayout } from "../layouts/MainLayout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent } from "../components/ui/card"
//mport { AccountSettings } from "../components/settings/AccountSettings"
import { ProfileForm } from "../components/settings/ProfileForm"
import { PasswordForm } from "../components/settings/PasswordForm"
import { useAuth } from "../contexts/AuthContext"

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile")
  const { user} = useAuth()

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="mb-6 text-2xl font-bold">Configuración de Cuenta</h1>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Perfil Administrador</TabsTrigger>
                <TabsTrigger value="password">Contraseña</TabsTrigger>
                <TabsTrigger value="preferences">Preferencias</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                {user && <ProfileForm user={user} />}
              </TabsContent>

              <TabsContent value="password">
                <PasswordForm />
              </TabsContent>

              <TabsContent value="preferences">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Preferencias</h2>
                  <p className="text-muted-foreground">
                    Las opciones de preferencias estarán disponibles próximamente.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
