import { Link } from "react-router-dom"
import { Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Left section */}
          <div>
            <h3 className="text-xl font-bold">DigitalOrder</h3>
            <p className="mt-2 text-muted-foreground">From fresh produce to daily essentials, shop smarter!</p>
            <div className="mt-4 flex space-x-4">{/* Social icons would go here */}</div>
          </div>

          {/* Middle section */}
          <div>
            <h3 className="text-lg font-semibold">Contáctenos</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>contacto@digitalorder.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>+51 987 654 321</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Av. Lima, 2 Cercado. Lima, Perú</span>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div>
            <h3 className="text-lg font-semibold">Acerca de nosotros</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Reglamento
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Copyright &copy; {new Date().getFullYear()} <strong>DigitalOrder</strong>. Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}
