
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, FileText, Search, Eye, DollarSign } from "lucide-react"

export function RestaurantInvoiceViewer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Mock invoices data - in a real app, this would come from an API
  const [invoices, setInvoices] = useState([
    {
      id: "inv-001",
      orderId: "order-123456",
      provider: "Provider Company",
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
      provider: "Verduras Express",
      invoiceNumber: "F001-00124",
      issueDate: "2023-11-21",
      dueDate: "2023-12-21",
      amount: 425.3,
      status: "pending",
      notes: "Pendiente de pago",
      file: "factura-002.pdf",
    },
    {
      id: "inv-003",
      orderId: "order-345678",
      provider: "Distribuidora Orgánica",
      invoiceNumber: "F001-00125",
      issueDate: "2023-11-25",
      dueDate: "2023-12-25",
      amount: 280.5,
      status: "pending",
      notes: "Pendiente de pago",
      file: "factura-003.pdf",
    },
  ])

  // Filter invoices based on active tab and search term
  const filteredInvoices = invoices.filter((invoice) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.provider.toLowerCase().includes(searchLower) ||
      invoice.orderId.toLowerCase().includes(searchLower)

    if (activeTab === "all") return matchesSearch
    if (activeTab === "paid") return invoice.status === "paid" && matchesSearch
    if (activeTab === "pending") return invoice.status === "pending" && matchesSearch

    return matchesSearch
  })

  const openViewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setViewDialogOpen(true)
  }

  const handlePayInvoice = async (id) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update invoice status
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv)))

    if (selectedInvoice && selectedInvoice.id === id) {
      setSelectedInvoice({ ...selectedInvoice, status: "paid" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Mis Facturas</h2>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar por número de factura, proveedor o pedido..."
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
      </Tabs>

      {/* View Invoice Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de Factura</DialogTitle>
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
                <h4 className="text-sm font-medium text-muted-foreground">Proveedor</h4>
                <p>{selectedInvoice.provider}</p>
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

              <div className="flex justify-end pt-4 border-t">
                {selectedInvoice.status === "pending" && (
                  <Button onClick={() => handlePayInvoice(selectedInvoice.id)}>Marcar como Pagada</Button>
                )}
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
                  <p className="text-sm text-muted-foreground">{invoice.provider}</p>
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
                    {invoice.status === "pending" && (
                      <Button size="sm" onClick={() => handlePayInvoice(invoice.id)}>
                        <DollarSign className="mr-2 h-4 w-4" />
                        Pagar
                      </Button>
                    )}
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
