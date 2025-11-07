"use client"

import * as React from "react"
import { Plus, Search, Download, FileText, CheckCircle, XCircle, Clock, Eye, Mail, Printer, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuoteStore, Quote, QuoteStatus } from "@/lib/stores/quote-store"
import { useClientStore } from "@/lib/stores/client-store"
import { useProjectStore } from "@/lib/stores/project-store"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-utils"
import { EmptyState } from "@/components/empty-state"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"
import { QuoteTemplate } from "@/components/quote-template"

export default function QuotesPage() {
  const { quotes, addQuote, updateQuote, deleteQuote, fetchQuotes, loading, initialized } = useQuoteStore()
  const { clients, fetchClients, initialized: clientsInitialized } = useClientStore()
  const { projects, fetchProjects, initialized: projectsInitialized } = useProjectStore()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<QuoteStatus | "all">("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [editingQuote, setEditingQuote] = React.useState<Quote | null>(null)

  // Preview and Email states
  const [previewQuote, setPreviewQuote] = React.useState<Quote | null>(null)
  const [emailQuote, setEmailQuote] = React.useState<Quote | null>(null)
  const [emailForm, setEmailForm] = React.useState({
    to: "",
    cc: "",
    subject: "",
    message: ""
  })
  const quoteTemplateRef = React.useRef<HTMLDivElement>(null)

  // Form states
  const [clientId, setClientId] = React.useState<number>(0)
  const [projectId, setProjectId] = React.useState<number | undefined>(undefined)
  const [title, setTitle] = React.useState("")
  const [items, setItems] = React.useState<Array<{ description: string; quantity: number; unitPrice: number }>>([
    { description: "", quantity: 1, unitPrice: 0 }
  ])
  const [validUntil, setValidUntil] = React.useState("")
  const [notes, setNotes] = React.useState("")
  const [terms, setTerms] = React.useState("")

  // Fetch data on mount
  React.useEffect(() => {
    if (!initialized) {
      fetchQuotes()
    }
  }, [initialized, fetchQuotes])

  React.useEffect(() => {
    if (!clientsInitialized) {
      fetchClients()
    }
  }, [clientsInitialized, fetchClients])

  React.useEffect(() => {
    if (!projectsInitialized) {
      fetchProjects()
    }
  }, [projectsInitialized, fetchProjects])

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.items.some(item => item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const calculateItemTotal = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + calculateItemTotal(item.quantity, item.unitPrice), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.16 // 16% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const resetForm = () => {
    setClientId(0)
    setProjectId(undefined)
    setTitle("")
    setItems([{ description: "", quantity: 1, unitPrice: 0 }])
    setValidUntil("")
    setNotes("")
    setTerms("")
  }

  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleAdd = async () => {
    if (clientId === 0) {
      toast.error("Por favor selecciona un cliente")
      return
    }

    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error("Por favor completa todos los artículos")
      return
    }

    if (!validUntil) {
      toast.error("Por favor selecciona una fecha de validez")
      return
    }

    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const newQuote: Omit<Quote, "id" | "quoteNumber" | "createdAt"> = {
      clientId,
      clientName: client.name,
      projectId,
      title,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: calculateItemTotal(item.quantity, item.unitPrice)
      })),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      status: "Borrador",
      issueDate: new Date().toISOString().split('T')[0],
      validUntil,
      notes,
      terms
    }

    try {
      await addQuote(newQuote)
      toast.success("Cotización creada exitosamente")
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      toast.error("Error al crear la cotización")
    }
  }

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote)
    setClientId(quote.clientId)
    setProjectId(quote.projectId)
    setTitle(quote.title || "")
    setItems(quote.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    })))
    setValidUntil(quote.validUntil)
    setNotes(quote.notes || "")
    setTerms(quote.terms || "")
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingQuote) return

    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error("Por favor completa todos los artículos")
      return
    }

    const client = clients.find(c => c.id === clientId)
    if (!client) return

    const updatedQuote: Partial<Quote> = {
      clientId,
      clientName: client.name,
      projectId,
      title,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: calculateItemTotal(item.quantity, item.unitPrice)
      })),
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      validUntil,
      notes,
      terms
    }

    try {
      await updateQuote(editingQuote.id, updatedQuote)
      toast.success("Cotización actualizada exitosamente")
      setIsEditDialogOpen(false)
      setEditingQuote(null)
      resetForm()
    } catch (error) {
      toast.error("Error al actualizar la cotización")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta cotización?")) {
      try {
        await deleteQuote(id)
        toast.success("Cotización eliminada exitosamente")
      } catch (error) {
        toast.error("Error al eliminar la cotización")
      }
    }
  }

  const handleStatusChange = (id: number, status: QuoteStatus) => {
    const quote = quotes.find(q => q.id === id)
    if (!quote) return

    const updates: Partial<Quote> = { status }

    if (status === "Aceptada") {
      updates.acceptedDate = new Date().toISOString().split('T')[0]
    } else if (status === "Rechazada") {
      updates.rejectedDate = new Date().toISOString().split('T')[0]
    }

    updateQuote(id, updates)
    toast.success(`Cotización marcada como ${status.toLowerCase()}`)
  }

  const handleExportCSV = () => {
    const exportData = filteredQuotes.map(quote => ({
      Número: quote.quoteNumber,
      Cliente: quote.clientName,
      Subtotal: `$${quote.subtotal.toFixed(2)}`,
      IVA: `$${quote.tax.toFixed(2)}`,
      Total: `$${quote.total.toFixed(2)}`,
      Estado: quote.status,
      Fecha: quote.issueDate,
      "Válido hasta": quote.validUntil
    }))
    exportToCSV(exportData, `cotizaciones-${new Date().toISOString().split('T')[0]}.csv`)
    toast.success("Cotizaciones exportadas exitosamente")
  }

  const handlePreview = (quote: Quote) => {
    setPreviewQuote(quote)
  }

  const handleDownload = (quote: Quote) => {
    setPreviewQuote(quote)
    setTimeout(() => {
      if (quoteTemplateRef.current) {
        const htmlContent = quoteTemplateRef.current.innerHTML
        const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización ${quote.quoteNumber}</title>
</head>
<body style="margin: 0; padding: 0;">
  ${htmlContent}
</body>
</html>`
        const blob = new Blob([fullHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Cotizacion-${quote.quoteNumber}.html`
        a.click()
        URL.revokeObjectURL(url)
        setPreviewQuote(null)
        toast.success("Cotización descargada exitosamente")
      }
    }, 100)
  }

  const handlePrint = (quote: Quote) => {
    setPreviewQuote(quote)
    setTimeout(() => {
      window.print()
      setPreviewQuote(null)
    }, 100)
  }

  const handleOpenEmail = (quote: Quote) => {
    const client = clients.find(c => c.id === quote.clientId)
    setEmailForm({
      to: client?.email || "",
      cc: "",
      subject: `Cotización ${quote.quoteNumber} - ${quote.clientName}`,
      message: `Estimado/a ${quote.clientName},\n\nAdjunto encontrará la cotización ${quote.quoteNumber} para su revisión.\n\nLa cotización es válida hasta el ${quote.validUntil}.\n\nQuedamos atentos a cualquier consulta.\n\nSaludos cordiales,\nDW Admin`
    })
    setEmailQuote(quote)
  }

  const handleSendEmail = () => {
    // Placeholder for backend integration
    toast.success("Email enviado exitosamente (pendiente integración backend)")
    setEmailQuote(null)
    setEmailForm({ to: "", cc: "", subject: "", message: "" })
  }

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case "Borrador": return "bg-gray-500"
      case "Enviada": return "bg-blue-500"
      case "Aceptada": return "bg-green-500"
      case "Rechazada": return "bg-red-500"
      case "Expirada": return "bg-orange-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: QuoteStatus) => {
    switch (status) {
      case "Aceptada": return <CheckCircle className="h-4 w-4" />
      case "Rechazada": return <XCircle className="h-4 w-4" />
      case "Enviada": return <Clock className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getQuotesByStatus = (status: QuoteStatus) => {
    return quotes.filter(q => q.status === status).length
  }

  if (isLoading) {
    return <TableSkeleton rows={8} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
          <p className="text-muted-foreground">
            Gestiona las cotizaciones de tus proyectos
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cotización
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Cotizaciones</CardDescription>
            <CardTitle className="text-3xl">{quotes.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Borradores</CardDescription>
            <CardTitle className="text-3xl">{getQuotesByStatus("Borrador")}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Enviadas</CardDescription>
            <CardTitle className="text-3xl">{getQuotesByStatus("Enviado")}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Aceptadas</CardDescription>
            <CardTitle className="text-3xl">{getQuotesByStatus("Aceptado")}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rechazadas</CardDescription>
            <CardTitle className="text-3xl">{getQuotesByStatus("Rechazado")}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Cotizaciones</CardTitle>
              <CardDescription>
                {filteredQuotes.length} cotización(es) encontrada(s)
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cotizaciones..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setStatusFilter(v as QuoteStatus | "all")}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="Borrador">Borradores</TabsTrigger>
              <TabsTrigger value="Enviada">Enviadas</TabsTrigger>
              <TabsTrigger value="Aceptada">Aceptadas</TabsTrigger>
              <TabsTrigger value="Rechazada">Rechazadas</TabsTrigger>
            </TabsList>
            <TabsContent value={statusFilter} className="mt-4">
              {filteredQuotes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No hay cotizaciones"
                  description="Comienza creando una nueva cotización para tus clientes"
                  action={{
                    label: "Nueva Cotización",
                    onClick: () => setIsAddDialogOpen(true)
                  }}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Artículos</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>IVA</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Válido hasta</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell className="font-mono font-semibold">
                          {quote.quoteNumber}
                        </TableCell>
                        <TableCell>{quote.clientName}</TableCell>
                        <TableCell>{quote.items.length} artículo(s)</TableCell>
                        <TableCell>${quote.subtotal.toFixed(2)}</TableCell>
                        <TableCell>${quote.tax.toFixed(2)}</TableCell>
                        <TableCell className="font-semibold">
                          ${quote.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(quote.status)}>
                            {getStatusIcon(quote.status)}
                            <span className="ml-1">{quote.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{quote.issueDate}</TableCell>
                        <TableCell>{quote.validUntil}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handlePreview(quote)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Cotización
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(quote)}>
                                <Download className="mr-2 h-4 w-4" />
                                Descargar HTML
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handlePrint(quote)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Imprimir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleOpenEmail(quote)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar por Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(quote)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              {quote.status === "Borrador" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "Enviada")}>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Marcar como Enviada
                                </DropdownMenuItem>
                              )}
                              {quote.status === "Enviada" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "Aceptada")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Marcar como Aceptada
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(quote.id, "Rechazada")}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Marcar como Rechazada
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(quote.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Quote Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Cotización</DialogTitle>
            <DialogDescription>
              Crea una nueva cotización para un cliente
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select value={clientId.toString()} onValueChange={(v) => setClientId(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
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
              <div className="space-y-2">
                <Label htmlFor="project">Proyecto (opcional)</Label>
                <Select value={projectId?.toString() || ""} onValueChange={(v) => setProjectId(v ? parseInt(v) : undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin proyecto</SelectItem>
                    {projects.filter(p => p.clientId === clientId).map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título del Proyecto (opcional)</Label>
              <Input
                id="title"
                placeholder="Ej: Desarrollo de Sitio Web Corporativo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validUntil">Válido hasta *</Label>
              <Input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Artículos *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar Artículo
                </Button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label htmlFor={`description-${index}`} className="text-xs">Descripción</Label>
                    <Input
                      id={`description-${index}`}
                      placeholder="Descripción del artículo"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`quantity-${index}`} className="text-xs">Cantidad</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`unitPrice-${index}`} className="text-xs">Precio Unit.</Label>
                    <Input
                      id={`unitPrice-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Total</Label>
                    <div className="h-10 flex items-center text-sm font-semibold">
                      ${calculateItemTotal(item.quantity, item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span className="font-semibold">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                placeholder="Notas adicionales sobre la cotización"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Términos y Condiciones (opcional)</Label>
              <Textarea
                id="terms"
                placeholder="Ingrese los términos y condiciones personalizados (opcional). Si no se especifica, se usarán los términos predeterminados."
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false)
              resetForm()
            }}>
              Cancelar
            </Button>
            <Button onClick={handleAdd}>Crear Cotización</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quote Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Cotización</DialogTitle>
            <DialogDescription>
              Modifica los detalles de la cotización
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-client">Cliente *</Label>
                <Select value={clientId.toString()} onValueChange={(v) => setClientId(parseInt(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
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
              <div className="space-y-2">
                <Label htmlFor="edit-project">Proyecto (opcional)</Label>
                <Select value={projectId?.toString() || ""} onValueChange={(v) => setProjectId(v ? parseInt(v) : undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Sin proyecto</SelectItem>
                    {projects.filter(p => p.clientId === clientId).map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title">Título del Proyecto (opcional)</Label>
              <Input
                id="edit-title"
                placeholder="Ej: Desarrollo de Sitio Web Corporativo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-validUntil">Válido hasta *</Label>
              <Input
                id="edit-validUntil"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Artículos *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar Artículo
                </Button>
              </div>
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label htmlFor={`edit-description-${index}`} className="text-xs">Descripción</Label>
                    <Input
                      id={`edit-description-${index}`}
                      placeholder="Descripción del artículo"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`edit-quantity-${index}`} className="text-xs">Cantidad</Label>
                    <Input
                      id={`edit-quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`edit-unitPrice-${index}`} className="text-xs">Precio Unit.</Label>
                    <Input
                      id={`edit-unitPrice-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Total</Label>
                    <div className="h-10 flex items-center text-sm font-semibold">
                      ${calculateItemTotal(item.quantity, item.unitPrice).toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span className="font-semibold">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notas (opcional)</Label>
              <Input
                id="edit-notes"
                placeholder="Notas adicionales sobre la cotización"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-terms">Términos y Condiciones (opcional)</Label>
              <Textarea
                id="edit-terms"
                placeholder="Ingrese los términos y condiciones personalizados (opcional). Si no se especifica, se usarán los términos predeterminados."
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false)
              setEditingQuote(null)
              resetForm()
            }}>
              Cancelar
            </Button>
            <Button onClick={handleUpdate}>Actualizar Cotización</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewQuote !== null} onOpenChange={(open) => !open && setPreviewQuote(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vista Previa - {previewQuote?.quoteNumber}</DialogTitle>
            <DialogDescription>
              Cotización para {previewQuote?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {previewQuote && (
              <QuoteTemplate quote={previewQuote} ref={quoteTemplateRef} />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewQuote(null)}>
              Cerrar
            </Button>
            <Button onClick={() => previewQuote && handleDownload(previewQuote)}>
              <Download className="mr-2 h-4 w-4" />
              Descargar HTML
            </Button>
            <Button onClick={() => previewQuote && handlePrint(previewQuote)}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailQuote !== null} onOpenChange={(open) => !open && setEmailQuote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enviar Cotización por Email</DialogTitle>
            <DialogDescription>
              Cotización {emailQuote?.quoteNumber} - {emailQuote?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-to">Para *</Label>
              <Input
                id="email-to"
                type="email"
                placeholder="cliente@example.com"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-cc">CC (opcional)</Label>
              <Input
                id="email-cc"
                type="email"
                placeholder="copia@example.com"
                value={emailForm.cc}
                onChange={(e) => setEmailForm({ ...emailForm, cc: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Asunto *</Label>
              <Input
                id="email-subject"
                placeholder="Asunto del email"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-message">Mensaje *</Label>
              <Textarea
                id="email-message"
                placeholder="Mensaje del email"
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailQuote(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSendEmail}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden template for download */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        {previewQuote && (
          <QuoteTemplate quote={previewQuote} ref={quoteTemplateRef} />
        )}
      </div>
    </div>
  )
}
