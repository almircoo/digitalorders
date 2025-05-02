"use client"

import { Badge } from "../ui/badge"

import { useState, useEffect } from "react"
import { PlusCircle, X } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useToast } from "../ui/use-toast"
import { getCatalogs, createCatalog, updateCatalog } from "../../services/api"

const categories = [
  { id: 1, icon: "🥩", name: "Carnes" },
  { id: 2, icon: "🍎", name: "Frutas" },
  { id: 3, icon: "🥦", name: "Verduras" },
  { id: 4, icon: "🥛", name: "Lácteos" },
  { id: 5, icon: "🌾", name: "Granos" },
  { id: 6, icon: "❄️", name: "Congelados" },
  { id: 7, icon: "🥫", name: "Enlatados" },
  { id: 8, icon: "🥤", name: "Bebidas" },
  { id: 9, icon: "🧹", name: "Limpieza" },
]

// Sample initial catalogs
const initialCatalogs = {
  "catalog-1": {
    id: "catalog-1",
    name: "Catálogo de Frutas",
    category: 2,
    items: [
      { name: "Manzana", quality: "Premium", quantity: "1", unit: "kg", price: "5.99" },
      { name: "Plátano", quality: "Estándar", quantity: "1", unit: "kg", price: "3.99" },
      { name: "Naranja", quality: "Premium", quantity: "1", unit: "kg", price: "4.50" },
    ],
    published: true,
  },
  "catalog-2": {
    id: "catalog-2",
    name: "Catálogo de Verduras",
    category: 3,
    items: [
      { name: "Zanahoria", quality: "Orgánica", quantity: "1", unit: "kg", price: "2.99" },
      { name: "Tomate", quality: "Premium", quantity: "1", unit: "kg", price: "6.50" },
      { name: "Lechuga", quality: "Fresca", quantity: "1", unit: "kg", price: "3.25" },
    ],
    published: false,
  },
}

export function ProviderCatalog() {
  const { toast } = useToast()
  const [catalogs, setCatalogs] = useState(initialCatalogs)
  const [activeCatalogId, setActiveCatalogId] = useState("catalog-1")
  const [newCatalogOpen, setNewCatalogOpen] = useState(false)
  const [newCatalogName, setNewCatalogName] = useState("")
  const [newCatalogCategory, setNewCatalogCategory] = useState(1)
  const [newItemName, setNewItemName] = useState("")

  // Load catalogs from API on mount
  useEffect(() => {
    async function fetchCatalogs() {
      try {
        const catalogsData = await getCatalogs()
        const catalogsObject = {}
        catalogsData.forEach((catalog) => {
          catalogsObject[catalog.id] = catalog
        })
        setCatalogs(catalogsObject)

        // Set active catalog to the first one if available
        if (catalogsData.length > 0 && !activeCatalogId) {
          setActiveCatalogId(catalogsData[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch catalogs:", error)
      }
    }

    fetchCatalogs()
  }, [activeCatalogId])

  // Remove localStorage loading effect

  // Remove localStorage saving effect

  const handleCreateCatalog = async () => {
    if (!newCatalogName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del catálogo es requerido",
        variant: "destructive",
      })
      return
    }

    try {
      const newCatalog = await createCatalog({
        name: newCatalogName,
        category: newCatalogCategory,
        items: [],
        published: false,
      })

      setCatalogs((prev) => ({
        ...prev,
        [newCatalog.id]: newCatalog,
      }))

      setActiveCatalogId(newCatalog.id)
      setNewCatalogName("")
      setNewCatalogCategory(1)
      setNewCatalogOpen(false)

      toast({
        title: "Catálogo creado",
        description: `El catálogo "${newCatalogName}" ha sido creado exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el catálogo. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddItem = () => {
    if (!activeCatalogId) return
    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es requerido",
        variant: "destructive",
      })
      return
    }

    setCatalogs((prev) => {
      const catalog = prev[activeCatalogId]
      return {
        ...prev,
        [activeCatalogId]: {
          ...catalog,
          items: [
            ...catalog.items,
            {
              name: newItemName,
              quality: "",
              quantity: "1",
              unit: "kg",
              price: "0",
            },
          ],
        },
      }
    })

    setNewItemName("")
  }

  const handleItemChange = (index, field, value) => {
    if (!activeCatalogId) return

    setCatalogs((prev) => {
      const catalog = prev[activeCatalogId]
      const updatedItems = [...catalog.items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }

      return {
        ...prev,
        [activeCatalogId]: {
          ...catalog,
          items: updatedItems,
        },
      }
    })
  }

  const handlePublishCatalog = async () => {
    if (!activeCatalogId) return

    try {
      const updatedCatalog = {
        ...catalogs[activeCatalogId],
        published: true,
      }

      await updateCatalog(activeCatalogId, updatedCatalog)

      setCatalogs((prev) => ({
        ...prev,
        [activeCatalogId]: updatedCatalog,
      }))

      toast({
        title: "Catálogo publicado",
        description: "El catálogo ha sido publicado exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar el catálogo. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  const activeCatalog = activeCatalogId ? catalogs[activeCatalogId] : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestionar Catálogos</h2>
      </div>

      {/* Catalog Selection */}
      <div className="flex flex-wrap gap-4">
        {Object.values(catalogs).map((catalog) => (
          <Button
            key={catalog.id}
            variant={activeCatalogId === catalog.id ? "default" : "outline"}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg p-2"
            onClick={() => setActiveCatalogId(catalog.id)}
          >
            <span className="text-xl">{categories.find((c) => c.id === catalog.category)?.icon || "📋"}</span>
            <span className="text-xs">{catalog.name}</span>
          </Button>
        ))}

        <Dialog open={newCatalogOpen} onOpenChange={setNewCatalogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-dashed p-2"
            >
              <PlusCircle className="h-6 w-6" />
              <span className="text-xs">Nuevo</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nuevo Catálogo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del catálogo</Label>
                <Input
                  id="name"
                  value={newCatalogName}
                  onChange={(e) => setNewCatalogName(e.target.value)}
                  placeholder="Ingrese nombre"
                />
              </div>
              <div className="grid gap-2">
                <Label>Categoría</Label>
                <div className="grid grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      type="button"
                      variant={newCatalogCategory === cat.id ? "default" : "outline"}
                      className="h-10"
                      onClick={() => setNewCatalogCategory(cat.id)}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCatalogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCatalog}>Crear catálogo</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Catalog */}
      {activeCatalog && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{activeCatalog.name}</CardTitle>
            <Badge variant={activeCatalog.published ? "default" : "outline"}>
              {activeCatalog.published ? "Publicado" : "Borrador"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-center gap-2">
              <Input
                placeholder="Agregar nuevo producto"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddItem())}
              />
              <Button onClick={handleAddItem}>Agregar</Button>
            </div>

            {activeCatalog.items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay productos en este catálogo. Agrega algunos productos para comenzar.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-2 font-medium">
                  <div className="col-span-3">Producto</div>
                  <div className="col-span-2">Calidad</div>
                  <div className="col-span-2">Cantidad</div>
                  <div className="col-span-2">Unidad</div>
                  <div className="col-span-2">Precio</div>
                  <div className="col-span-1"></div>
                </div>

                {activeCatalog.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <Input value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.quality}
                        onChange={(e) => handleItemChange(index, "quality", e.target.value)}
                        placeholder="Calidad"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        placeholder="Cantidad"
                      />
                    </div>
                    <div className="col-span-2">
                      <Select value={item.unit} onValueChange={(value) => handleItemChange(index, "unit", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Unidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilogramo (kg)</SelectItem>
                          <SelectItem value="g">Gramo (g)</SelectItem>
                          <SelectItem value="l">Litro (l)</SelectItem>
                          <SelectItem value="ml">Mililitro (ml)</SelectItem>
                          <SelectItem value="u">Unidad (u)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <span className="mr-2">S/.</span>
                        <Input
                          value={item.price}
                          onChange={(e) => handleItemChange(index, "price", e.target.value)}
                          placeholder="Precio"
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCatalogs((prev) => {
                            const catalog = prev[activeCatalogId]
                            const updatedItems = [...catalog.items]
                            updatedItems.splice(index, 1)
                            return {
                              ...prev,
                              [activeCatalogId]: {
                                ...catalog,
                                items: updatedItems,
                              },
                            }
                          })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center">
              <Button
                onClick={handlePublishCatalog}
                disabled={activeCatalog.items.length === 0 || activeCatalog.published}
                className="btn-standard"
              >
                {activeCatalog.published ? "Catálogo Publicado" : "Publicar Catálogo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
