

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, FileText, Upload, Search, Eye, Calendar, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function InvoiceManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Mock orders data
  const [orders, setOrders] = useState([
    {
      id: "order-123456",
      restaurant: "Restaurante El Gourmet",
      date: "2023-11-15",
      total: 350.75,
      status: "Entregado",
      hasInvoice: true,
    },
    {
      id: "order-234567",
      restaurant: "Cocina Peruana",
      date: "2023-11-20",
      total: 425.3,
      status: "Entregado",
      hasInvoice: true,
    },
    {
      id: "order-345678",
      restaurant: "Sabores del Mar",
      date: "2023-11-25",
      total: 280.5,
      status: "Entregado",
      hasInvoice: false,
    },
    {
      id: "order-456789",
      restaurant: "La Buena Mesa",
      date: "2023-11-30",
      total: 520.0,
      status: "Entregado",
      hasInvoice: false,
    },
  ])

  // Mock invoices data
  const [invoices, setInvoices] = useState([
    {
      id: "inv-001",
      orderId: "order-123456",
      restaurant: "Restaurante El Gourmet",
      invoiceNumber: "F001-00123",
      issueDate: "2023-11-16",
      dueDate: "2023-12-16",
      amount: 350.75,
      status: "paid",
      notes: "Pago realizado mediante transferencia bancaria",
      file: "factura-001.pdf",
    },
    {
      id: "inv-002",
      orderId: "order-234567",
      restaurant: "Cocina Peruana",
      invoiceNumber: "F001-00124",
      issueDate: "2023-11-21",
      dueDate: "2023-12-21",
      amount: 425.3,
      status: "pending",
      notes: "Pendiente de pago",
      file: "factura-002.pdf",
    },
  ])

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    orderId: "",
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    amount: "",
    status: "pending",
    notes: "",
    file: null,
  })

  // Filtra los pedidos basados en una busqueda -> penediente implemntar
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchTerm.toLowerCase()
    return order.id.toLowerCase().includes(searchLower) || order.restaurant.toLowerCase().includes(searchLower)
  })

  // Filtra las facturas 
  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.restaurant.toLowerCase().includes(searchLower) ||
      invoice.orderId.toLowerCase().includes(searchLower)

    if (activeTab === "all") return matchesSearch
    if (activeTab === "paid") return invoice.status === "paid" && matchesSearch
    if (activeTab === "pending") return invoice.status === "pending" && matchesSearch

    return matchesSearch
  })

  const handleUploadFormChange = (e) => {
    const { name, value } = e.target
    setUploadForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadForm((prev) => ({
        ...prev,
        file: file,
      }))
    }
  }

  const handleSelectChange = (name, value) => {
    setUploadForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const openUploadDialog = (orderId) => {
    const order = orders.find((o) => o.id === orderId)

    setUploadForm({
      orderId: order.id,
      invoiceNumber: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: order.total.toString(),
      status: "pending",
      notes: "",
      file: null,
    })

    setUploadDialogOpen(true)
  }

  const openViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setViewDialogOpen(true)
  }

  const handleUploadInvoice = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (!uploadForm.invoiceNumber || !uploadForm.issueDate || !uploadForm.amount || !uploadForm.file) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos y adjunta un archivo.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Create new invoice
    const newInvoice = {
      id: `inv-${Date.now()}`,
      orderId: uploadForm.orderId,
      restaurant: orders.find((o) => o.id === uploadForm.orderId).restaurant,
      invoiceNumber: uploadForm.invoiceNumber,
      issueDate: uploadForm.issueDate,
      dueDate: uploadForm.dueDate,
      amount: Number.parseFloat(uploadForm.amount),
      status: uploadForm.status,
      notes: uploadForm.notes,
      file: uploadForm.file.name,
    }

    // Add invoice to list
    setInvoices((prev) => [...prev, newInvoice])

    // Update order to mark it as having an invoice
    setOrders((prev) => prev.map((order) => (order.id === uploadForm.orderId ? { ...order, hasInvoice: true } : order)))

    toast({
      title: "Factura subida",
      description: "La factura ha sido subida exitosamente.",
    })

    setIsLoading(false)
    setUploadDialogOpen(false)
  }

  const handleDeleteInvoice = async (id) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const invoiceToDelete = invoices.find((inv) => inv.id === id)

    // Remove invoice
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))

    // Update order to mark it as not having an invoice
    setOrders((prev) =>
      prev.map((order) => (order.id === invoiceToDelete.orderId ? { ...order, hasInvoice: false } : order)),
    )

    toast({
      title: "Factura eliminada",
      description: "La factura ha sido eliminada exitosamente.",
    })
  }

  const handleUpdateInvoiceStatus = async (id, newStatus) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update invoice status
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv)))

    toast({
      title: "Estado actualizado",
      description: `La factura ha sido marcada como ${newStatus === "paid" ? "pagada" : "pendiente"}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Facturas</h2>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por número de factura, pedido o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="paid">Pagadas</TabsTrigger>
          <TabsTrigger value="orders">Pedidos sin Factura</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Todas las Facturas</h3>
          {renderInvoicesList(filteredInvoices)}
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Facturas Pendientes</h3>
          {renderInvoicesList(filteredInvoices)}
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Facturas Pagadas</h3>
          {renderInvoicesList(filteredInvoices)}
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <h3 className="text-lg font-medium mb-4">Pedidos sin Factura</h3>
          {filteredOrders.filter((order) => !order.hasInvoice).length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No hay pedidos sin factura</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders
                .filter((order) => !order.hasInvoice)
                .map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{order.restaurant}</h4>
                          <p className="text-sm text-muted-foreground">Pedido: {order.id}</p>
                          <div className="flex items-center mt-1">
                            <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{new Date(order.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">S/. {order.total.toFixed(2)}</span>
                          </div>
                        </div>
                        <Button onClick={() => openUploadDialog(order.id)} className="btn-standard">
                          <Upload className="mr-2 h-4 w-4" />
                          Subir Factura
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Upload Invoice Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Subir Factura</DialogTitle>
            <DialogDescription>Sube una factura para el pedido seleccionado.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadInvoice}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Pedido</Label>
                <Input id="orderId" value={uploadForm.orderId} disabled />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Número de Factura</Label>
                  <Input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={uploadForm.invoiceNumber}
                    onChange={handleUploadFormChange}
                    placeholder="Ej: F001-00125"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select value={uploadForm.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="paid">Pagada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Fecha de Emisión</Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={uploadForm.issueDate}
                    onChange={handleUploadFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={uploadForm.dueDate}
                    onChange={handleUploadFormChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monto (S/.)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={uploadForm.amount}
                  onChange={handleUploadFormChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={uploadForm.notes}
                  onChange={handleUploadFormChange}
                  placeholder="Información adicional sobre la factura"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Archivo de Factura</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>
                {uploadForm.file && (
                  <p className="text-sm text-muted-foreground">Archivo seleccionado: {uploadForm.file.name}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="btn-standard" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subiendo...
                  </>
                ) : (
                  "Subir Factura"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de Factura</DialogTitle>
            <DialogDescription>Información detallada de la factura.</DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Número de Factura</h4>
                  <p>{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Estado</h4>
                  <Badge variant={selectedInvoice.status === "paid" ? "default" : "outline"}>
                    {selectedInvoice.status === "paid" ? "Pagada" : "Pendiente"}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                <p>{selectedInvoice.restaurant}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Fecha de Emisión</h4>
                  <p>{new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Fecha de Vencimiento</h4>
                  <p>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Monto</h4>
                <p className="text-lg font-bold">S/. {selectedInvoice.amount.toFixed(2)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Pedido Relacionado</h4>
                <p>{selectedInvoice.orderId}</p>
              </div>

              {selectedInvoice.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Notas</h4>
                  <p>{selectedInvoice.notes}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Archivo</h4>
                <div className="flex items-center mt-1">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{selectedInvoice.file}</span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                {selectedInvoice.status === "pending" ? (
                  <Button
                    onClick={() => {
                      handleUpdateInvoiceStatus(selectedInvoice.id, "paid")
                      setSelectedInvoice({ ...selectedInvoice, status: "paid" })
                    }}
                  >
                    Marcar como Pagada
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleUpdateInvoiceStatus(selectedInvoice.id, "pending")
                      setSelectedInvoice({ ...selectedInvoice, status: "pending" })
                    }}
                  >
                    Marcar como Pendiente
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteInvoice(selectedInvoice.id)
                    setViewDialogOpen(false)
                  }}
                >
                  Eliminar Factura
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )

  function renderInvoicesList(invoices) {
    if (invoices.length === 0) {
      return (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No hay facturas disponibles</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{invoice.invoiceNumber}</h4>
                    <Badge variant={invoice.status === "paid" ? "default" : "outline"}>
                      {invoice.status === "paid" ? "Pagada" : "Pendiente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.restaurant}</p>
                  <p className="text-sm text-muted-foreground">Pedido: {invoice.orderId}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Emitida: {new Date(invoice.issueDate).toLocaleDateString()} | Vence:{" "}
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-bold">S/. {invoice.amount.toFixed(2)}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => openViewInvoice(invoice)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}
