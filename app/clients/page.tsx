"use client"

import * as React from "react"
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  Download,
  Filter,
  Users as UsersIcon,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Textarea } from "@/components/ui/textarea"
import { useClientStore, type Client } from "@/lib/stores/client-store"
import { exportToCSV, formatDateForExport } from "@/lib/export-utils"
import { EmptyState } from "@/components/empty-state"
import { TableSkeleton } from "@/components/skeletons/table-skeleton"

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient } = useClientStore()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [editingClient, setEditingClient] = React.useState<Client | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Form state
  const [formData, setFormData] = React.useState({
    name: "",
    contact: "",
    email: "",
    phone: "",
    company: "",
    status: "Lead" as Client["status"],
    location: "",
    notes: "",
    projects: 0,
    revenue: 0,
  })

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || client.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      email: "",
      phone: "",
      company: "",
      status: "Lead",
      location: "",
      notes: "",
      projects: 0,
      revenue: 0,
    })
    setEditingClient(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingClient) {
      updateClient(editingClient.id, formData)
      toast.success("Cliente actualizado", {
        description: `${formData.name} ha sido actualizado exitosamente.`,
      })
    } else {
      addClient(formData)
      toast.success("Cliente creado", {
        description: `${formData.name} ha sido agregado exitosamente.`,
      })
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      contact: client.contact,
      email: client.email,
      phone: client.phone,
      company: client.company,
      status: client.status,
      location: client.location,
      notes: client.notes || "",
      projects: client.projects,
      revenue: client.revenue,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (client: Client) => {
    if (confirm(`¿Estás seguro de eliminar a ${client.name}?`)) {
      deleteClient(client.id)
      toast.success("Cliente eliminado", {
        description: `${client.name} ha sido eliminado.`,
      })
    }
  }

  const handleExport = () => {
    const exportData = filteredClients.map((client) => ({
      ID: client.id,
      Nombre: client.name,
      Contacto: client.contact,
      Email: client.email,
      Teléfono: client.phone,
      Empresa: client.company,
      Estado: client.status,
      Proyectos: client.projects,
      Ingresos: client.revenue,
      Ubicación: client.location,
      "Fecha de Creación": formatDateForExport(client.createdAt),
    }))

    exportToCSV(exportData, `clientes_${new Date().toISOString().split("T")[0]}.csv`)
    toast.success("Datos exportados", {
      description: `${exportData.length} cliente(s) exportados a CSV.`,
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Activo":
        return "default"
      case "Lead":
        return "secondary"
      case "Inactivo":
        return "outline"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="h-9 w-48 bg-muted animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded" />
        </div>
        <TableSkeleton rows={8} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">
            Gestiona tu cartera de clientes y prospectos
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) resetForm()
        }}>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingClient ? "Editar Cliente" : "Agregar Nuevo Cliente"}
                </DialogTitle>
                <DialogDescription>
                  {editingClient
                    ? "Actualiza la información del cliente"
                    : "Ingresa la información del cliente para agregarlo al sistema"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del Cliente</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="TechCorp Solutions"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="TechCorp Inc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contacto Principal</Label>
                    <Input
                      id="contact"
                      required
                      value={formData.contact}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: Client["status"]) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@techcorp.com"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Información adicional sobre el cliente..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingClient ? "Actualizar" : "Guardar Cliente"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.status === "Activo").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter((c) => c.status === "Lead").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${clients.reduce((acc, c) => acc + c.revenue, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      {clients.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No hay clientes"
          description="Comienza agregando tu primer cliente para gestionar tu cartera."
          action={{
            label: "Agregar Cliente",
            onClick: () => setIsAddDialogOpen(true),
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Lista de Clientes</CardTitle>
                <CardDescription>
                  {filteredClients.length} cliente(s) encontrado(s)
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar clientes..."
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
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Activo">Activos</SelectItem>
                    <SelectItem value="Lead">Leads</SelectItem>
                    <SelectItem value="Inactivo">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredClients.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                No se encontraron clientes con los filtros aplicados.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Proyectos</TableHead>
                    <TableHead>Ingresos</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`/avatars/${client.id}.png`} />
                            <AvatarFallback>
                              {client.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Building className="h-3 w-3" />
                              {client.company}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {client.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{client.projects}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          ${client.revenue.toLocaleString()}
                        </div>
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
                            <DropdownMenuItem onClick={() => handleEdit(client)}>
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>Ver proyectos</DropdownMenuItem>
                            <DropdownMenuItem>Enviar email</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(client)}
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
