
import { useState, useEffect } from "react"
import { PlusCircle, Search, ShoppingCart, X, Edit, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"

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

// datos de pruebas para productos disponivles
const sampleProducts = [
  { name: "Manzana", quality: "Premium", unit: "kg", price: 5.99, category: 2 },
  { name: "Plátano", quality: "Estándar", unit: "kg", price: 3.99, category: 2 },
  { name: "Naranja", quality: "Premium", unit: "kg", price: 4.5, category: 2 },
  { name: "Zanahoria", quality: "Orgánica", unit: "kg", price: 2.99, category: 3 },
  { name: "Tomate", quality: "Premium", unit: "kg", price: 6.5, category: 3 },
  { name: "Lechuga", quality: "Fresca", unit: "kg", price: 3.25, category: 3 },
  { name: "Leche", quality: "Entera", unit: "L", price: 4.25, category: 4 },
  { name: "Queso", quality: "Fresco", unit: "kg", price: 12.99, category: 4 },
  { name: "Yogurt", quality: "Natural", unit: "L", price: 5.75, category: 4 },
  { name: "Arroz", quality: "Premium", unit: "kg", price: 3.5, category: 5 },
  { name: "Frijoles", quality: "Negros", unit: "kg", price: 4.25, category: 5 },
  { name: "Pollo", quality: "Pechuga", unit: "kg", price: 9.99, category: 1 },
  { name: "Carne", quality: "Molida", unit: "kg", price: 12.5, category: 1 },
  { name: "Helado", quality: "Vainilla", unit: "L", price: 8.99, category: 6 },
  { name: "Atún", quality: "En agua", unit: "lata", price: 3.75, category: 7 },
  { name: "Agua", quality: "Mineral", unit: "L", price: 1.99, category: 8 },
  { name: "Detergente", quality: "Líquido", unit: "L", price: 7.5, category: 9 },
]

export function RestaurantList() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { addItem } = useCart()

  // estados d ela lista
  const [savedLists, setSavedLists] = useState([])
  const [activeListId, setActiveListId] = useState(null)
  const [newListOpen, setNewListOpen] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [newListCategory, setNewListCategory] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [editListId, setEditListId] = useState(null)

  // filtrado de productos
  const [filteredProducts, setFilteredProducts] = useState([])

  // carga los datos guarddos del lcoal storage
  useEffect(() => {
    const storedLists = localStorage.getItem("restaurantLists")
    if (storedLists) {
      const parsedLists = JSON.parse(storedLists) // convierte la lista en objetos
      setSavedLists(parsedLists) // y se guarda

      // verifica Si hay al menos una lista y no se ha seleccionado ninguna lista activa todavía
      if (parsedLists.length > 0 && !activeListId) {
        // Entonces seleccionamos la primera lista como la lista activa
        setActiveListId(parsedLists[0].id)
      }
    }
  }, [])

  // se gurda la lista en localStorage siempre que cambien
  useEffect(() => {
    localStorage.setItem("restaurantLists", JSON.stringify(savedLists))
  }, [savedLists])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([])
      return
    }

    const filtered = sampleProducts.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

    setFilteredProducts(filtered.slice(0, 5))
  }, [searchTerm])
  // Maneja la creacion  e listas
  const handleCreateList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista es requerido",
        variant: "destructive",
      })
      return
    }

    const newList = {
      id: `list-${Date.now()}`,
      name: newListName,
      category: newListCategory,
      items: [],
      createdAt: new Date().toISOString(),
    }

    setSavedLists((prev) => [...prev, newList])
    setActiveListId(newList.id)
    setNewListName("")
    setNewListCategory(1)
    setNewListOpen(false)

    toast({
      title: "Lista creada",
      description: `La lista "${newListName}" ha sido creada exitosamente`,
    })
  }
  // Edit list
  // const handleEditList = (list) => {
  //   setEditMode(true)
  //   setEditListId(list.id)
  //   setNewListName(list.name)
  //   setNewListCategory(list.category)
  //   setNewListOpen(true)
  // }
  // acrualiza la lista
  const handleUpdateList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la lista es requerido",
        variant: "destructive",
      })
      return
    }

    setSavedLists((prev) =>
      prev.map((list) => (list.id === editListId ? { ...list, name: newListName, category: newListCategory } : list)),
    )

    setEditMode(false)
    setEditListId(null)
    setNewListName("")
    setNewListCategory(1)
    setNewListOpen(false)

    toast({
      title: "Lista actualizada",
      description: `La lista ha sido actualizada exitosamente`,
    })
  }

  // const handleDeleteList = (listId) => {
  //   setSavedLists((prev) => prev.filter((list) => list.id !== listId))

  //   if (activeListId === listId) {
  //     const remainingLists = savedLists.filter((list) => list.id !== listId)
  //     setActiveListId(remainingLists.length > 0 ? remainingLists[0].id : null)
  //   }

  //   toast({
  //     title: "Lista eliminada",
  //     description: "La lista ha sido eliminada exitosamente",
  //   })
  // }
  
  const handleAddProduct = (product) => {
    if (!activeListId) return

    const newItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: product.name,
      quality: product.quality || "",
      quantity: 1,
      unit: product.unit || "kg",
      price: Number.parseFloat(product.price) || 0,
    }

    setSavedLists((prev) =>
      prev.map((list) => (list.id === activeListId ? { ...list, items: [...list.items, newItem] } : list)),
    )

    setSearchTerm("")
    setFilteredProducts([])

    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado a la lista`,
    })
  }

  const handleItemChange = (listId, itemId, field, value) => {
    setSavedLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list

        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  [field]: field === "quantity" || field === "price" ? Number.parseFloat(value) || 0 : value,
                }
              : item,
          ),
        }
      }),
    )
  }

  const handleRemoveItem = (listId, itemId) => {
    setSavedLists((prev) =>
      prev.map((list) => {
        if (list.id !== listId) return list

        return {
          ...list,
          items: list.items.filter((item) => item.id !== itemId),
        }
      }),
    )

    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado de la lista",
    })
  }

  const handleAddToCart = () => {
    if (!activeListId) {
      toast({
        title: "Error",
        description: "No hay una lista activa para agregar al carrito",
        variant: "destructive",
      })
      return
    }

    const activeList = savedLists.find((list) => list.id === activeListId)

    if (!activeList || activeList.items.length === 0) {
      toast({
        title: "Error",
        description: "No hay productos en la lista para agregar al carrito",
        variant: "destructive",
      })
      return
    }

    // Add all items to cart
    activeList.items.forEach((item) => {
      addItem({
        id: item.id || Date.now().toString() + Math.random().toString(36).substring(2, 9),
        ...item,
      })
    })

    toast({
      title: "Lista agregada al carrito",
      description: "Todos los productos han sido agregados al carrito",
    })

    navigate("/cart")
  }

  const activeList = savedLists.find((list) => list.id === activeListId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestionar Listas</h2>
        <Button onClick={handleAddToCart} disabled={!activeList || activeList?.items.length === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ir al Carrito
        </Button>
      </div>

      {/* List Selection */}
      <div className="flex flex-wrap gap-4">
        {savedLists.map((list) => (
          <div key={list.id} className="relative">
            <Button
              variant={activeListId === list.id ? "default" : "outline"}
              className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-lg p-2"
              onClick={() => setActiveListId(list.id)}
            >
              <span className="text-xl">{categories.find((c) => c.id === list.category)?.icon || "📋"}</span>
              <span className="text-xs truncate w-full text-center">{list.name}</span>
            </Button>
            {/* <div className="absolute -top-2 -right-2 flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  handleEditList(list)
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 rounded-full bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteList(list.id)
                }}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div> */}
          </div>
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
              <DialogTitle>{editMode ? "Editar Lista" : "Crear Nueva Lista"}</DialogTitle>
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
              <Button
                variant="outline"
                onClick={() => {
                  setNewListOpen(false)
                  setEditMode(false)
                  setEditListId(null)
                  setNewListName("")
                  setNewListCategory(1)
                }}
              >
                Cancelar
              </Button>
              <Button onClick={editMode ? handleUpdateList : handleCreateList}>
                {editMode ? "Actualizar" : "Crear lista"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active List */}
      {activeList && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{activeList.name}</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {activeList.items.length} {activeList.items.length === 1 ? "producto" : "productos"}
              </span>
            </div>
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
                            {categories.find((c) => c.id === product.category)?.name} - {product.quality || "Estándar"}
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

                {activeList.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <Input
                        value={item.name}
                        onChange={(e) => handleItemChange(activeListId, item.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.quality}
                        onChange={(e) => handleItemChange(activeListId, item.id, "quality", e.target.value)}
                        placeholder="Calidad"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(activeListId, item.id, "quantity", e.target.value)}
                        placeholder="Cantidad"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        value={item.unit}
                        onChange={(e) => handleItemChange(activeListId, item.id, "unit", e.target.value)}
                        placeholder="Unidad"
                        disabled
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center">
                        <span className="mr-2">S/.</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(activeListId, item.id, "price", e.target.value)}
                          placeholder="Precio"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(activeListId, item.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={() => {
                  toast({
                    title: "Lista guardada",
                    description: `La lista "${activeList.name}" ha sido guardada exitosamente`,
                  })
                  // The list is already being saved automatically via useEffect,
                  // but we can force an update to localStorage here
                  localStorage.setItem("restaurantLists", JSON.stringify(savedLists))
                }}
                variant="outline"
                disabled={!activeList}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Guardar Lista
              </Button>
              <Button onClick={handleAddToCart} disabled={activeList?.items.length === 0} className="btn-standard">
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


