

// import { useState } from "react"
// import { Button } from "../ui/button"
// import { Input } from "../ui/input"
// import { useToast } from "../ui/use-toast"
// import { Loader2 } from "lucide-react"
// import { useAuth } from "../../contexts/AuthContext"

// export function ProfileForm({ user }) {
//   const { toast } = useToast()
//   const [isLoading, setIsLoading] = useState(false)
//   const { accessToken } = useAuth()
//   const [formData, setFormData] = useState({
//     firstName: user?.first_name || "",
//     lastName: user?.last_name || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//     country: user?.country || "",
//     city: user?.city || "",
//     address: user?.address || "",
//     zipCode: user?.zip_code || "",
//   })

//   // Maneja los cambios
//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   async function handleSubmit(e) {
//     e.preventDefault()
//     setIsLoading(true)

//     try {
//       if (!accessToken) {
//         throw new Error("No estás autenticado")
//       }

//       toast({
//         title: "Perfil actualizado",
//         description: "Tu información de perfil ha sido actualizada exitosamente.",
//       })
//     } catch (error) {
//       // Error toast is handled by the API function
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-4">
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <label htmlFor="firstName" className="text-sm font-medium">
//               Nombre
//             </label>
//             <Input
//               id="firstName"
//               name="firstName"
//               placeholder="Ingrese su nombre"
//               value={formData.firstName}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="lastName" className="text-sm font-medium">
//               Apellido
//             </label>
//             <Input
//               id="lastName"
//               name="lastName"
//               placeholder="Ingrese su apellido"
//               value={formData.lastName}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="email" className="text-sm font-medium">
//             Correo Electrónico
//           </label>
//           <Input
//             id="email"
//             name="email"
//             placeholder="correo@ejemplo.com"
//             value={formData.email}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="space-y-2">
//           <label htmlFor="phone" className="text-sm font-medium">
//             Número de Teléfono
//           </label>
//           <Input id="phone" name="phone" placeholder="+51 987 654 321" value={formData.phone} onChange={handleChange} />
//         </div>

//         <h3 className="mt-6 text-lg font-medium">Dirección Personal</h3>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <label htmlFor="country" className="text-sm font-medium">
//               País
//             </label>
//             <Input id="country" name="country" placeholder="Perú" value={formData.country} onChange={handleChange} />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="city" className="text-sm font-medium">
//               Ciudad
//             </label>
//             <Input id="city" name="city" placeholder="Lima" value={formData.city} onChange={handleChange} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div className="space-y-2">
//             <label htmlFor="address" className="text-sm font-medium">
//               Dirección
//             </label>
//             <Input
//               id="address"
//               name="address"
//               placeholder="Av. Lima 123"
//               value={formData.address}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="zipCode" className="text-sm font-medium">
//               Código Postal
//             </label>
//             <Input id="zipCode" name="zipCode" placeholder="15001" value={formData.zipCode} onChange={handleChange} />
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <Button type="submit" className="btn-standard" disabled={isLoading}>
//           {isLoading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Guardando...
//             </>
//           ) : (
//             "Guardar Cambios"
//           )}
//         </Button>
//       </div>
//     </form>
//   )
// }

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useToast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
// Asegúrate de importar tu función de actualización de perfil
import { updateUserProfile } from "../../apis" // Asumo que tienes esta función

export function ProfileForm() { // Eliminamos `user` de los props, lo obtenemos del contexto
  const { toast } = useToast()
  const { accessToken, profile, loadUserProfile } = useAuth() // Obtenemos el perfil y la función para recargarlo
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
  })
  const [initialFormData, setInitialFormData] = useState(null); // Para comparar si hay cambios

  // Efecto para inicializar el formulario cuando el perfil esté disponible
  useEffect(() => {
    if (profile) {
      const currentData = {
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        country: profile.country || "",
        city: profile.city || "",
        address: profile.address || "",
        zipCode: profile.zip_code || "",
      };
      setFormData(currentData);
      setInitialFormData(currentData); // Guardamos una copia para la comparación
    }
  }, [profile]); // Se ejecuta cada vez que el objeto profile cambia

  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Comprueba si el formulario ha cambiado
  const hasFormChanged = () => {
    if (!initialFormData) return false; // Todavía no se ha cargado la data inicial

    // Compara cada campo para ver si ha habido algún cambio
    for (const key in formData) {
      if (formData[key] !== initialFormData[key]) {
        return true;
      }
    }
    return false;
  };

  // Maneja el envío del formulario
  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!accessToken) {
        throw new Error("No estás autenticado. Por favor, inicia sesión de nuevo.")
      }

      // Prepara los datos para enviar a la API
      const dataToUpdate = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        zip_code: formData.zipCode,
      };

      // Llama a tu función de API para actualizar el perfil
      await updateUserProfile(accessToken, dataToUpdate);

      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil ha sido actualizada exitosamente.",
      });

      // Vuelve a cargar el perfil después de una actualización exitosa para mantener la coherencia
      await loadUserProfile(accessToken);
      // Actualiza el estado inicial para la comparación de cambios
      setInitialFormData(formData);

    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast({
        title: "Error al actualizar perfil",
        description: error.message || "Hubo un problema al guardar tu información. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Si el perfil aún no se ha cargado, puedes mostrar un indicador de carga
  if (!profile && !isLoading) { // isLoading para evitar mostrar el mensaje durante el guardado
    return <div className="text-center py-10">Cargando datos del perfil...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Ingrese su nombre"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading} // Deshabilitar campos mientras se guarda
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Apellido
            </label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Ingrese su apellido"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Correo Electrónico
          </label>
          <Input
            id="email"
            name="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Número de Teléfono
          </label>
          <Input
            id="phone"
            name="phone"
            placeholder="+51 987 654 321"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <h3 className="mt-6 text-lg font-medium">Dirección Personal</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              País
            </label>
            <Input
              id="country"
              name="country"
              placeholder="Perú"
              value={formData.country}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">
              Ciudad
            </label>
            <Input
              id="city"
              name="city"
              placeholder="Lima"
              value={formData.city}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="address" className="text-sm font-medium">
              Dirección
            </label>
            <Input
              id="address"
              name="address"
              placeholder="Av. Lima 123"
              value={formData.address}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="zipCode" className="text-sm font-medium">
              Código Postal
            </label>
            <Input
              id="zipCode"
              name="zipCode"
              placeholder="15001"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="btn-standard" disabled={isLoading || !hasFormChanged()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Cambios"
          )}
        </Button>
      </div>
    </form>
  );
}