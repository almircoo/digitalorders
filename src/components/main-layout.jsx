import { MainNav } from "./main-nav"
import { Footer } from "./Footer"

export function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1 py-6">{children}</main>
      <Footer />
    </div>
  )
}
