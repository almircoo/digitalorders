"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Plus, Trash2, Edit, Tag, Calendar, Percent } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Promotions() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState(null)

  // Mock promotions data
  const [promotions, setPromotions] = useState([
    {
      id: "promo-1",
      name: "Descuento de Verano",
      description: "15% de descuento en todas las frutas de temporada",
      discountType: "percentage",
      discountValue: 15,
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      minOrderValue: 100,
      maxDiscount: 50,
      active: true,
      products: ["Manzanas", "Plátanos", "Naranjas"],
      code: "VERANO15",
    },
    {
      id: "promo-2",
      name: "Oferta de Lanzamiento",
      description: "S/. 20 de descuento en tu primer pedido",
      discountType: "fixed",
      discountValue: 20,
      startDate: "2023-11-15",
      endDate: "2024-01-15",
      minOrderValue: 150,
      maxDiscount: null,
      active: true,
      products: ["Todos los productos"],
      code: "BIENVENIDO20",
    },
    {
      id: "promo-3",
      name: "Descuento por Volumen",
      description: "10% de descuento en pedidos mayores a S/. 500",
      discountType: "percentage",
      discountValue: 10,
      startDate: "2023-11-01",
      endDate: "2024-02-28",
      minOrderValue: 500,
      maxDiscount: 100,
      active: false,
      products: ["Todos los productos"],
      code: "VOLUMEN10",
    },
  ])

  // New/edit promotion form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    minOrderValue: "",
    maxDiscount: "",
    active: true,
    products: [],
    code: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const openNewPromotionDialog = () => {
    setEditingPromotion(null)
    setFormData({
      name: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      startDate: "",
      endDate: "",
      minOrderValue: "",
      maxDiscount: "",
      active: true,
      products: [],
      code: "",
    })
    setDialogOpen(true)
  }

  const openEditPromotionDialog = (promotion) => {
    setEditingPromotion(promotion.id)
    setFormData({
      name: promotion.name,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: promotion.discountValue,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      minOrderValue: promotion.minOrderValue,
      maxDiscount: promotion.maxDiscount || "",
      active: promotion.active,
      products: promotion.products,
      code: promotion.code,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!formData.name || !formData.discountValue || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (editingPromotion) {
      // Update existing promotion
      setPromotions((prev) =>
        prev.map((promo) => (promo.id === editingPromotion ? { ...formData, id: editingPromotion } : promo)),
      )

      toast({
        title: "Promoción actualizada",
        description: "La promoción ha sido actualizada exitosamente.",
      })
    } else {
      // Add new promotion
      const newPromotion = {
        ...formData,
        id: `promo-${Date.now()}`,
      }

      setPromotions((prev) => [...prev, newPromotion])

      toast({
        title: "Promoción creada",
        description: "La nueva promoción ha sido creada exitosamente.",
      })
    }

    setIsLoading(false)
    setDialogOpen(false)
  }

  const handleDeletePromotion = async (id) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setPromotions((prev) => prev.filter((promo) => promo.id !== id))

    toast({
      title: "Promoción eliminada",
      description: "La promoción ha sido eliminada exitosamente.",
    })
  }

  const handleToggleActive = async (id, currentStatus) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setPromotions((prev) => prev.map((promo) => (promo.id === id ? { ...promo, active: !currentStatus } : promo)))

    toast({
      title: currentStatus ? "Promoción desactivada" : "Promoción activada",
      description: `La promoción ha sido ${currentStatus ? "desactivada" : "activada"} exitosamente.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Promociones</h2>
        <Button onClick={openNewPromotionDialog} className="btn-standard">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Promoción
        </Button>
      </div>

      {promotions.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No hay promociones disponibles</p>
            <Button onClick={openNewPromotionDialog} className="mt-4">
              Crear tu primera promoción
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <Card key={promotion.id} className={promotion.active ? "" : "opacity-70"}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{promotion.name}</CardTitle>
                  <Badge variant={promotion.active ? "default" : "outline"}>
                    {promotion.active ? "Activa" : "Inactiva"}
                  </Badge>
                </div>
                <CardDescription>{promotion.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Percent className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {promotion.discountType === "percentage"
                        ? `${promotion.discountValue}% de descuento`
                        : `S/. ${promotion.discountValue} de descuento`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                      {new Date(promotion.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Código: {promotion.code}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Button variant="outline" size="sm" onClick={() => handleToggleActive(promotion.id, promotion.active)}>
                  {promotion.active ? "Desactivar" : "Activar"}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => openEditPromotionDialog(promotion)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDeletePromotion(promotion.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingPromotion ? "Editar Promoción" : "Nueva Promoción"}</DialogTitle>
            <DialogDescription>
              {editingPromotion
                ? "Actualiza los detalles de la promoción existente."
                : "Crea una nueva promoción para tus clientes."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Promoción</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Descuento de Verano"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe los detalles de la promoción"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Tipo de Descuento</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) => handleSelectChange("discountType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                      <SelectItem value="fixed">Monto Fijo (S/.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountValue">Valor del Descuento</Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={formData.discountType === "percentage" ? "Ej: 15" : "Ej: 20"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderValue">Valor Mínimo de Pedido (S/.)</Label>
                  <Input
                    id="minOrderValue"
                    name="minOrderValue"
                    type="number"
                    value={formData.minOrderValue}
                    onChange={handleChange}
                    placeholder="Ej: 100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">Descuento Máximo (S/.)</Label>
                  <Input
                    id="maxDiscount"
                    name="maxDiscount"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={handleChange}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código de Promoción</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleChange} placeholder="Ej: VERANO15" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleSwitchChange("active", checked)}
                />
                <Label htmlFor="active">Promoción Activa</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-standard" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : editingPromotion ? (
                  "Actualizar Promoción"
                ) : (
                  "Crear Promoción"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
