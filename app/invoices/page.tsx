"use client"

import * as React from "react"
import {
  Plus,
  MoreHorizontal,
  Download,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInvoiceStore, type Invoice, type InvoiceItem } from "@/lib/stores/invoice-store"
import { useClientStore } from "@/lib/stores/client-store"
import { exportToCSV, formatDateForExport } from "@/lib/export-utils"
import { EmptyState } from "@/components/empty-state"

export default function InvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, markAsPaid } = useInvoiceStore()
  const { clients } = useClientStore()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Form state
  const [formData, setFormData] = React.useState({
    clientId: 0,
    clientName: "",
    projectName: "",
    items: [] as InvoiceItem[],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: "Borrador" as Invoice["status"],
    issueDate: "",
    dueDate: "",
    notes: "",
  })

  const [currentItem, setCurrentItem] = React.useState({
    description: "",
    quantity: 1,
    unitPrice: 0,
    total: 0,
  })

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Pagada":
        return "default"
      case "Enviada":
        return "secondary"
      case "Vencida":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pagada":
        return <CheckCircle2 className="mr-1 h-3 w-3" />
      case "Enviada":
        return <Clock className="mr-1 h-3 w-3" />
      case "Vencida":
        return <AlertCircle className="mr-1 h-3 w-3" />
      default:
        return null
    }
  }

  const handleAddItem = () => {
    if (!currentItem.description || currentItem.unitPrice === 0) {
      toast.error("Completa la descripción y precio")
      return
    }

    const itemTotal = currentItem.quantity * currentItem.unitPrice
    const newItem = { ...currentItem, total: itemTotal }
    const newItems = [...formData.items, newItem]
    const subtotal = newItems.reduce((acc, item) => acc + item.total, 0)
    const tax = subtotal * 0.16 // 16% tax
    const total = subtotal + tax

    setFormData({
      ...formData,
      items: newItems,
      subtotal,
      tax,
      total,
    })

    setCurrentItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    })

    toast.success("Item agregado")
  }

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    const subtotal = newItems.reduce((acc, item) => acc + item.total, 0)
    const tax = subtotal * 0.16
    const total = subtotal + tax

    setFormData({
      ...formData,
      items: newItems,
      subtotal,
      tax,
      total,
    })
  }

  const handleSubmit = () => {
    if (!formData.clientId || formData.items.length === 0 || !formData.issueDate || !formData.dueDate) {
      toast.error("Completa todos los campos requeridos")
      return
    }

    addInvoice(formData)
    toast.success("Factura creada exitosamente")
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      clientId: 0,
      clientName: "",
      projectName: "",
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: "Borrador",
      issueDate: "",
      dueDate: "",
      notes: "",
    })
  }

  const handleExport = () => {
    const exportData = filteredInvoices.map((inv) => ({
      Factura: inv.invoiceNumber,
      Cliente: inv.clientName,
      Proyecto: inv.projectName || "N/A",
      Subtotal: inv.subtotal,
      Impuestos: inv.tax,
      Total: inv.total,
      Estado: inv.status,
      Emisión: formatDateForExport(inv.issueDate),
      Vencimiento: formatDateForExport(inv.dueDate),
    }))

    exportToCSV(exportData, `facturas_${new Date().toISOString().split("T")[0]}.csv`)
    toast.success("Facturas exportadas")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturas</h1>
          <p className="text-muted-foreground">
            Gestiona tus facturas y cobros
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Factura
          </Button>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Factura</DialogTitle>
              <DialogDescription>
                Genera una factura para un cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">Cliente</Label>
                  <Select
                    value={formData.clientId.toString()}
                    onValueChange={(value) => {
                      const client = clients.find((c) => c.id === parseInt(value))
                      setFormData({
                        ...formData,
                        clientId: parseInt(value),
                        clientName: client?.name || "",
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="project">Proyecto (Opcional)</Label>
                  <Input
                    id="project"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    placeholder="Nombre del proyecto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issue-date">Fecha de Emisión</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due-date">Fecha de Vencimiento</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Items de la Factura</h3>

                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5">
                    <Input
                      placeholder="Descripción"
                      value={currentItem.description}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, description: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Cant."
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Precio Unit."
                      value={currentItem.unitPrice}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, unitPrice: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Button type="button" onClick={handleAddItem} className="w-full">
                      Agregar
                    </Button>
                  </div>
                </div>

                {formData.items.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell>${item.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {formData.items.length > 0 && (
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${formData.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Impuestos (16%):</span>
                      <span>${formData.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${formData.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Crear Factura</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Facturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter((i) => i.status === "Pagada").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.filter((i) => i.status === "Enviada").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Facturado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${invoices.reduce((acc, i) => acc + i.total, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      {invoices.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No hay facturas"
          description="Crea tu primera factura para comenzar a facturar"
          action={{
            label: "Nueva Factura",
            onClick: () => setIsDialogOpen(true),
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de Facturas</CardTitle>
                <CardDescription>
                  {filteredInvoices.length} factura(s) encontrada(s)
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar facturas..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="Borrador">Borradores</SelectItem>
                    <SelectItem value="Enviada">Enviadas</SelectItem>
                    <SelectItem value="Pagada">Pagadas</SelectItem>
                    <SelectItem value="Vencida">Vencidas</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="paid">Pagadas</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="overdue">Vencidas</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Factura</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Emisión</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.clientName}</div>
                            {invoice.projectName && (
                              <div className="text-xs text-muted-foreground">
                                {invoice.projectName}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${invoice.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.issueDate).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.dueDate).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(invoice.status)}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem>Descargar PDF</DropdownMenuItem>
                              {invoice.status !== "Pagada" && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    markAsPaid(invoice.id)
                                    toast.success("Factura marcada como pagada")
                                  }}
                                >
                                  Marcar como pagada
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  if (confirm("¿Eliminar esta factura?")) {
                                    deleteInvoice(invoice.id)
                                    toast.success("Factura eliminada")
                                  }
                                }}
                              >
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
