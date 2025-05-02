"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Search, ShoppingCart, X } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import { useToast } from "./ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCart } from "../contexts/cart-context"

// Update the RestaurantList component to use the API service
// 1. Import the API functions at the top of the file:
import { getLists, createList, updateList } from "../services/api"
import { getCatalogs } from "../services/api"

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

// Sample data for provider catalogs
// const sampleCatalogs = {
//   "list-1": {
//     id: "list-1",
//     name: "List 1",
//     category: 2,
//     items: [
//       { name: "Manzana", quality: "Premium", unit: "kg", price: 5.99 },
//       { name: "Plátano", quality: "Estándar", unit: "kg", price: 3.99 },
//       { name: "Naranja", quality: "Premium", unit: "kg", price: 4.5 },
//     ],
//     published: true,
//   },
//   "list-2": {
//     id: "list-2",
//     name: "List 2",
//     category: 3,
//     items: [
//       { name: "Zanahoria", quality: "Orgánica", unit: "kg", price: 2.99 },
//       { name: "Tomate", quality: "Premium", unit: "kg", price: 6.5 },
//       { name: "Lechuga", quality: "Fresca", unit: "kg", price: 3.25 },
//     ],
//     published: true,
//   },
// }

export function RestaurantList() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { addItem } = useCart()

  // Use state instead of localStorage
  const [lists, setLists] = useState({})
  const [activeListId, setActiveListId] = useState(null)
  const [newListOpen, setNewListOpen] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [newListCategory, setNewListCategory] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const [availableProducts, setAvailableProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  // Initialize with sample data instead of loading from localStorage
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch shopping lists
        const listsData = await getLists()
        const listsObject = {}
        listsData.forEach((list) => {
          listsObject[list.id] = list
        })
        setLists(listsObject)

        // Set active list to the first one if available
        if (listsData.length > 0 && !activeListId) {
          setActiveListId(listsData[0].id)
        }

        // Fetch catalogs for products
        const catalogsData = await getCatalogs()
        const products = []

        catalogsData.forEach((catalog) => {
          if (catalog.published) {
            catalog.items.forEach((item) => {
              products.push({
                ...item,
                catalogId: catalog.id,
                catalogName: catalog.name,
              })
            })
          }
        })

        setAvailableProducts(products)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }

    fetchData()
  }, [activeListId])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([])
      return
    }

    const filtered = availableProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredProducts(filtered.slice(0, 5))
  }, [searchTerm, availableProducts])

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista es requerido",
        variant: "destructive",
      })
      return
    }

    try {
      const newList = await createList({
        name: newListName,
        category: newListCategory,
        items: [],
      })

      setLists((prev) => ({
        ...prev,
        [newList.id]: newList,
      }))

      setActiveListId(newList.id)
      setNewListName("")
      setNewListCategory(1)
      setNewListOpen(false)

      toast({
        title: "Lista creada",
        description: `La lista "${newListName}" ha sido creada exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la lista. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddProduct = (product) => {
    if (!activeListId) return

    const newItem = {
      name: product.name,
      quality: product.quality || "",
      quantity: 1,
      unit: product.unit || "kg",
      price: Number.parseFloat(product.price) || 0,
    }

    setLists((prev) => {
      const list = prev[activeListId]
      return {
        ...prev,
        [activeListId]: {
          ...list,
          items: [...list.items, newItem],
        },
      }
    })

    setSearchTerm("")
    setFilteredProducts([])

    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado a la lista`,
    })
  }

  const handleItemChange = async (index, field, value) => {
    if (!activeListId) return

    const updatedLists = { ...lists }
    const list = updatedLists[activeListId]
    const updatedItems = [...list.items]
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "quantity" || field === "price" ? Number.parseFloat(value) : value,
    }

    updatedLists[activeListId] = {
      ...list,
      items: updatedItems,
    }

    setLists(updatedLists)

    try {
      await updateList(activeListId, updatedLists[activeListId])
    } catch (error) {
      console.error("Failed to update list:", error)
    }
  }

  const handleAddToCart = () => {
    if (!activeListId || !lists[activeListId]?.items.length) {
      toast({
        title: "Error",
        description: "No hay productos en la lista para agregar al carrito",
        variant: "destructive",
      })
      return
    }

    // Add all items to cart
    lists[activeListId].items.forEach((item) => {
      addItem({
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        ...item,
      })
    })

    toast({
      title: "Lista agregada al carrito",
      description: "Todos los productos han sido agregados al carrito",
    })

    navigate("/cart")
  }

  const activeList = activeListId ? lists[activeListId] : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestionar Listas</h2>
        <Button onClick={handleAddToCart} disabled={!activeList || activeList.items.length === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ir al Carrito
        </Button>
      </div>

      {/* Rest of the component remains the same */}
      {/* List Selection */}
      <div className="flex flex-wrap gap-4">
        {Object.values(lists).map((list) => (
          <Button
            key={list.id}
            variant={activeListId === list.id ? "default" : "outline"}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg p-2"
            onClick={() => setActiveListId(list.id)}
          >
            <span className="text-xl">{categories.find((c) => c.id === list.category)?.icon || "📋"}</span>
            <span className="text-xs">{list.name}</span>
          </Button>
        ))}

        <Dialog open={newListOpen} onOpenChange={setNewListOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg border-dashed p-2"
            >
              <PlusCircle className="h-6 w-6" />
              <span className="text-xs">Nueva</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Lista</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre de la lista</Label>
                <Input
                  id="name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
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
                      variant={newListCategory === cat.id ? "default" : "outline"}
                      className="h-10"
                      onClick={() => setNewListCategory(cat.id)}
                    >
                      <span className="mr-2">{cat.icon}</span>
                      <span className="text-xs">{cat.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewListOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateList}>Crear lista</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active List */}
      {activeList && (
        <Card>
          <CardHeader>
            <CardTitle>{activeList.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 relative">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>

              {filteredProducts.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
                  <div className="py-1">
                    {filteredProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-muted"
                        onClick={() => handleAddProduct(product)}
                      >
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.catalogName} - {product.quality || "Estándar"}
                          </div>
                        </div>
                        <div className="text-sm font-medium">S/. {Number.parseFloat(product.price).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {activeList.items.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No hay productos en esta lista. Busca y agrega productos para comenzar.
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

                {activeList.items.map((item, index) => (
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
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        placeholder="Cantidad"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                        placeholder="Unidad"
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <span className="mr-2">S/.</span>
                        <Input
                          value={item.price}
                          onChange={(e) => handleItemChange(index, "price", e.target.value)}
                          placeholder="Precio"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setLists((prev) => {
                            const list = prev[activeListId]
                            const updatedItems = [...list.items]
                            updatedItems.splice(index, 1)
                            return {
                              ...prev,
                              [activeListId]: {
                                ...list,
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
              <Button onClick={handleAddToCart} disabled={activeList.items.length === 0} className="btn-standard">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar al Carrito
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
