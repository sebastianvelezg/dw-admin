"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Clock,
  Link as LinkIcon,
  ExternalLink,
  Video,
  TrendingUp,
  AlertCircle,
  Receipt,
  FileText,
  Target,
  Activity,
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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useProjectStore } from "@/lib/stores/project-store"
import { useClientStore } from "@/lib/stores/client-store"
import { useTaskStore, type Task } from "@/lib/stores/task-store"
import { useMeetingStore, type Meeting } from "@/lib/stores/meeting-store"
import { useLinkStore, type ProjectLink } from "@/lib/stores/link-store"
import { useInvoiceStore } from "@/lib/stores/invoice-store"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const unwrappedParams = React.use(params)
  const projectId = parseInt(unwrappedParams.id)

  const { getProjectById, markMilestoneAsPaid, fetchProjects, initialized, loading } = useProjectStore()
  const { clients, fetchClients, initialized: clientsInitialized } = useClientStore()
  const { tasks, addTask, deleteTask, toggleTaskStatus } = useTaskStore()
  const { meetings, addMeeting, deleteMeeting } = useMeetingStore()
  const { links, addLink, deleteLink } = useLinkStore()
  const { invoices } = useInvoiceStore()

  const project = getProjectById(projectId)
  const projectTasks = tasks.filter(t => t.projectId === projectId)
  const projectMeetings = meetings.filter(m => m.projectId === projectId)
  const projectLinks = links.filter(l => l.projectId === projectId)
  const projectInvoices = invoices.filter(i => i.projectId === projectId)

  const client = clients.find(c => c.id === project?.clientId)

  // Dialog states
  const [taskDialogOpen, setTaskDialogOpen] = React.useState(false)
  const [meetingDialogOpen, setMeetingDialogOpen] = React.useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = React.useState(false)

  // Form states
  const [taskForm, setTaskForm] = React.useState<Partial<Task>>({
    title: "",
    description: "",
    status: "Todo",
    priority: "Media",
    dueDate: "",
  })

  const [meetingForm, setMeetingForm] = React.useState<Partial<Meeting>>({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "1h",
    location: "",
    attendees: [],
  })

  const [linkForm, setLinkForm] = React.useState<Partial<ProjectLink>>({
    title: "",
    url: "",
    type: "Repositorio",
    description: "",
  })

  // Fetch projects and clients on mount
  React.useEffect(() => {
    if (!initialized) {
      fetchProjects()
    }
  }, [initialized, fetchProjects])

  React.useEffect(() => {
    if (!clientsInitialized) {
      fetchClients()
    }
  }, [clientsInitialized, fetchClients])

  if (loading && !initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Cargando proyecto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Proyecto no encontrado</h2>
          <Button className="mt-4" onClick={() => router.push("/projects")}>
            Volver a Proyectos
          </Button>
        </div>
      </div>
    )
  }

  const completedTasks = projectTasks.filter(t => t.status === "Completado").length
  const taskCompletionRate = projectTasks.length > 0
    ? Math.round((completedTasks / projectTasks.length) * 100)
    : 0

  const upcomingMeetings = projectMeetings.filter(m => new Date(m.date) >= new Date())
  const pastMeetings = projectMeetings.filter(m => new Date(m.date) < new Date())

  const daysUntilDeadline = Math.ceil(
    (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  const budgetUsagePercentage = project.budget > 0
    ? Math.round((project.spent / project.budget) * 100)
    : 0

  const paymentCompletionPercentage = project.budget > 0
    ? Math.round((project.totalPaid / project.budget) * 100)
    : 0

  const handleAddTask = () => {
    if (!taskForm.title || !taskForm.dueDate) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    addTask({
      ...taskForm,
      projectId,
    } as Omit<Task, 'id' | 'createdAt'>)

    toast.success("Tarea creada exitosamente")
    setTaskDialogOpen(false)
    setTaskForm({
      title: "",
      description: "",
      status: "Todo",
      priority: "Media",
      dueDate: "",
    })
  }

  const handleAddMeeting = () => {
    if (!meetingForm.title || !meetingForm.date || !meetingForm.time) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    addMeeting({
      ...meetingForm,
      projectId,
      attendees: meetingForm.attendees || [],
    } as Omit<Meeting, 'id' | 'createdAt'>)

    toast.success("Reunión creada exitosamente")
    setMeetingDialogOpen(false)
    setMeetingForm({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "1h",
      location: "",
      attendees: [],
    })
  }

  const handleAddLink = () => {
    if (!linkForm.title || !linkForm.url) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    addLink({
      ...linkForm,
      projectId,
    } as Omit<ProjectLink, 'id' | 'createdAt'>)

    toast.success("Enlace agregado exitosamente")
    setLinkDialogOpen(false)
    setLinkForm({
      title: "",
      url: "",
      type: "Repositorio",
      description: "",
    })
  }

  const handleMarkMilestoneAsPaid = async (milestoneId: number) => {
    try {
      await markMilestoneAsPaid(projectId, milestoneId, new Date().toISOString().split('T')[0])
      toast.success("Hito marcado como pagado")
    } catch (error) {
      toast.error("Error al marcar hito como pagado")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planeación": return "bg-gray-500"
      case "En progreso": return "bg-blue-500"
      case "En revisión": return "bg-yellow-500"
      case "Completado": return "bg-green-500"
      case "En pausa": return "bg-orange-500"
      default: return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "destructive"
      case "Media": return "default"
      case "Baja": return "secondary"
      default: return "default"
    }
  }

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case "Pagada": return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "Pendiente": return <Clock className="h-4 w-4 text-yellow-500" />
      case "Vencida": return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/projects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Progreso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.progress}%</div>
            <Progress value={project.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Presupuesto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${project.budget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Gastado: ${project.spent.toLocaleString()} ({budgetUsagePercentage}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Pagos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${project.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paymentCompletionPercentage}% del presupuesto
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Tiempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysUntilDeadline > 0 ? `${daysUntilDeadline}d` : 'Vencido'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Deadline: {project.deadline}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tareas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}/{projectTasks.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {taskCompletionRate}% completadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client & Project Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client ? (
              <>
                <div>
                  <Label className="text-muted-foreground">Nombre</Label>
                  <p className="font-semibold">{client.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Empresa</Label>
                  <p className="font-semibold">{client.company}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contacto</Label>
                  <p>{client.email}</p>
                  <p>{client.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ubicación</Label>
                  <p>{client.location}</p>
                </div>
                <Link href="/clients">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver perfil del cliente
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground">Cliente no encontrado</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalles del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Categoría</Label>
                <p className="font-semibold">{project.category || "Sin categoría"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Prioridad</Label>
                <Badge variant={getPriorityColor(project.priority || "Media")}>
                  {project.priority || "Media"}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground">Fecha Inicio</Label>
                <p>{project.startDate}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fecha Límite</Label>
                <p>{project.deadline}</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">Equipo</Label>
              <p className="font-semibold">{project.team} miembros</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Creado</Label>
              <p>{new Date(project.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="financials">Finanzas</TabsTrigger>
          <TabsTrigger value="tasks">Tareas ({projectTasks.length})</TabsTrigger>
          <TabsTrigger value="meetings">Reuniones ({projectMeetings.length})</TabsTrigger>
          <TabsTrigger value="team">Equipo ({project.teamMembers.length})</TabsTrigger>
          <TabsTrigger value="resources">Recursos ({projectLinks.length})</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado General del Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Progreso del Proyecto</Label>
                  <span className="text-sm font-semibold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Uso del Presupuesto</Label>
                  <span className="text-sm font-semibold">
                    ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                  </span>
                </div>
                <Progress value={budgetUsagePercentage} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Completitud de Pagos</Label>
                  <span className="text-sm font-semibold">
                    ${project.totalPaid.toLocaleString()} / ${project.budget.toLocaleString()}
                  </span>
                </div>
                <Progress value={paymentCompletionPercentage} />
              </div>

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{projectTasks.length}</p>
                  <p className="text-xs text-muted-foreground">Tareas Totales</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Completadas</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
                  <p className="text-xs text-muted-foreground">Reuniones Próximas</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{projectInvoices.length}</p>
                  <p className="text-xs text-muted-foreground">Facturas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => setTaskDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Tarea
                </Button>
                <Button variant="outline" onClick={() => setMeetingDialogOpen(true)}>
                  <Video className="mr-2 h-4 w-4" />
                  Nueva Reunión
                </Button>
                <Button variant="outline" onClick={() => setLinkDialogOpen(true)}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Agregar Enlace
                </Button>
                <Link href="/invoices">
                  <Button variant="outline" className="w-full">
                    <Receipt className="mr-2 h-4 w-4" />
                    Ver Facturas
                  </Button>
                </Link>
                <Link href="/clients">
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Ver Cliente
                  </Button>
                </Link>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generar Reporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Presupuesto Total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${project.budget.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Pagado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${project.totalPaid.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">{paymentCompletionPercentage}% del total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pendiente de Pago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  ${(project.budget - project.totalPaid).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {100 - paymentCompletionPercentage}% pendiente
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Gastado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${project.spent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{budgetUsagePercentage}% del presupuesto</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Estructura de Pagos</CardTitle>
              <CardDescription>
                Hitos de pago configurados para este proyecto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.paymentMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {getMilestoneStatusIcon(milestone.status)}
                        <h4 className="font-semibold">{milestone.name}</h4>
                        <Badge variant="outline">{milestone.percentage}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        {milestone.dueDate && (
                          <span>Vencimiento: {milestone.dueDate}</span>
                        )}
                        {milestone.paidDate && (
                          <span className="text-green-600">Pagado: {milestone.paidDate}</span>
                        )}
                        {milestone.invoiceId && (
                          <span>Factura: INV-{milestone.invoiceId}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold">${milestone.amount.toLocaleString()}</p>
                      <Badge
                        variant={
                          milestone.status === "Pagada"
                            ? "default"
                            : milestone.status === "Vencida"
                            ? "destructive"
                            : "secondary"
                        }
                        className="mt-2"
                      >
                        {milestone.status}
                      </Badge>
                      {milestone.status === "Pendiente" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                          onClick={() => handleMarkMilestoneAsPaid(milestone.id)}
                        >
                          Marcar como Pagado
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Configurado</p>
                  <p className="text-2xl font-bold">${project.budget.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {project.paymentMilestones.filter(m => m.status === "Pagada").length} de{" "}
                    {project.paymentMilestones.length} pagados
                  </p>
                  <Progress
                    value={paymentCompletionPercentage}
                    className="w-32 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Invoices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Facturas del Proyecto</CardTitle>
                  <CardDescription>
                    Facturas asociadas a este proyecto
                  </CardDescription>
                </div>
                <Link href="/invoices">
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {projectInvoices.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono font-semibold">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>{invoice.issueDate}</TableCell>
                        <TableCell className="font-semibold">
                          ${invoice.total.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              invoice.status === "Pagada"
                                ? "default"
                                : invoice.status === "Vencida"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay facturas asociadas a este proyecto</p>
                  <Link href="/invoices">
                    <Button variant="outline" size="sm" className="mt-4">
                      Crear Factura
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tareas del Proyecto</CardTitle>
                  <CardDescription>
                    {completedTasks} de {projectTasks.length} completadas ({taskCompletionRate}%)
                  </CardDescription>
                </div>
                <Button onClick={() => setTaskDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Tarea
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Progress value={taskCompletionRate} />
              </div>

              {projectTasks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Tarea</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Asignado</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <Checkbox
                            checked={task.status === "Completado"}
                            onCheckedChange={() => toggleTaskStatus(task.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={task.status === "Completado" ? "line-through" : ""}>
                              {task.title}
                            </p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.assignedTo || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{task.status}</Badge>
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => toggleTaskStatus(task.id)}
                              >
                                {task.status === "Completado"
                                  ? "Marcar como pendiente"
                                  : "Marcar como completada"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  deleteTask(task.id)
                                  toast.success("Tarea eliminada")
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
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay tareas creadas</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setTaskDialogOpen(true)}
                  >
                    Crear Primera Tarea
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meetings Tab */}
        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reuniones</CardTitle>
                  <CardDescription>
                    {upcomingMeetings.length} próximas, {pastMeetings.length} pasadas
                  </CardDescription>
                </div>
                <Button onClick={() => setMeetingDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Reunión
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projectMeetings.length > 0 ? (
                <div className="space-y-6">
                  {upcomingMeetings.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                        PRÓXIMAS REUNIONES
                      </h3>
                      <div className="space-y-3">
                        {upcomingMeetings.map((meeting) => (
                          <div
                            key={meeting.id}
                            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex-shrink-0 w-16 text-center">
                              <div className="text-2xl font-bold">
                                {new Date(meeting.date).getDate()}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase">
                                {new Date(meeting.date).toLocaleDateString('es-ES', { month: 'short' })}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{meeting.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {meeting.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {meeting.time} ({meeting.duration})
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Video className="h-3 w-3" />
                                      {meeting.location}
                                    </span>
                                  </div>
                                  {meeting.attendees.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-muted-foreground">
                                        Asistentes: {meeting.attendees.join(", ")}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Editar</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      className="text-destructive"
                                      onClick={() => {
                                        deleteMeeting(meeting.id)
                                        toast.success("Reunión eliminada")
                                      }}
                                    >
                                      Eliminar
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pastMeetings.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                        REUNIONES PASADAS
                      </h3>
                      <div className="space-y-3 opacity-60">
                        {pastMeetings.map((meeting) => (
                          <div
                            key={meeting.id}
                            className="flex items-start gap-4 p-4 border rounded-lg"
                          >
                            <div className="flex-shrink-0 w-16 text-center">
                              <div className="text-2xl font-bold">
                                {new Date(meeting.date).getDate()}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase">
                                {new Date(meeting.date).toLocaleDateString('es-ES', { month: 'short' })}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{meeting.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {meeting.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>{meeting.time} ({meeting.duration})</span>
                                <span>{meeting.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay reuniones programadas</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setMeetingDialogOpen(true)}
                  >
                    Programar Reunión
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipo del Proyecto</CardTitle>
              <CardDescription>
                {project.teamMembers.length} miembros trabajando en este proyecto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {project.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Avatar>
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </div>
                ))}
              </div>

              {project.teamMembers.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay miembros asignados</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Workload */}
          <Card>
            <CardHeader>
              <CardTitle>Carga de Trabajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.teamMembers.map((member) => {
                  const memberTasks = projectTasks.filter(
                    t => t.assignedTo === member.name
                  )
                  const completedMemberTasks = memberTasks.filter(
                    t => t.status === "Completado"
                  ).length

                  return (
                    <div key={member.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{member.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {completedMemberTasks}/{memberTasks.length} tareas
                        </span>
                      </div>
                      <Progress
                        value={
                          memberTasks.length > 0
                            ? (completedMemberTasks / memberTasks.length) * 100
                            : 0
                        }
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Enlaces y Recursos</CardTitle>
                  <CardDescription>
                    Repositorios, documentación y recursos del proyecto
                  </CardDescription>
                </div>
                <Button onClick={() => setLinkDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Enlace
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {projectLinks.length > 0 ? (
                <div className="grid gap-3">
                  {projectLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{link.title}</h4>
                            <Badge variant="outline">{link.type}</Badge>
                          </div>
                          {link.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {link.description}
                            </p>
                          )}
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                          >
                            {link.url}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => window.open(link.url, '_blank')}
                          >
                            Abrir enlace
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              deleteLink(link.id)
                              toast.success("Enlace eliminado")
                            }}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <LinkIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No hay enlaces agregados</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setLinkDialogOpen(true)}
                  >
                    Agregar Primer Enlace
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Tarea</DialogTitle>
            <DialogDescription>
              Crea una nueva tarea para este proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Título *</Label>
              <Input
                id="task-title"
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, title: e.target.value })
                }
                placeholder="Nombre de la tarea"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-description">Descripción</Label>
              <Textarea
                id="task-description"
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, description: e.target.value })
                }
                placeholder="Descripción de la tarea"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-priority">Prioridad</Label>
                <Select
                  value={taskForm.priority}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, priority: value as any })
                  }
                >
                  <SelectTrigger id="task-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baja">Baja</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-status">Estado</Label>
                <Select
                  value={taskForm.status}
                  onValueChange={(value) =>
                    setTaskForm({ ...taskForm, status: value as any })
                  }
                >
                  <SelectTrigger id="task-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo">Por Hacer</SelectItem>
                    <SelectItem value="En progreso">En Progreso</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-assignedTo">Asignado a</Label>
              <Select
                value={taskForm.assignedTo}
                onValueChange={(value) =>
                  setTaskForm({ ...taskForm, assignedTo: value })
                }
              >
                <SelectTrigger id="task-assignedTo">
                  <SelectValue placeholder="Seleccionar miembro" />
                </SelectTrigger>
                <SelectContent>
                  {project.teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name}>
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-dueDate">Fecha Límite *</Label>
              <Input
                id="task-dueDate"
                type="date"
                value={taskForm.dueDate}
                onChange={(e) =>
                  setTaskForm({ ...taskForm, dueDate: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTask}>Crear Tarea</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Dialog */}
      <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Reunión</DialogTitle>
            <DialogDescription>
              Programa una nueva reunión para este proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meeting-title">Título *</Label>
              <Input
                id="meeting-title"
                value={meetingForm.title}
                onChange={(e) =>
                  setMeetingForm({ ...meetingForm, title: e.target.value })
                }
                placeholder="Título de la reunión"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-description">Descripción</Label>
              <Textarea
                id="meeting-description"
                value={meetingForm.description}
                onChange={(e) =>
                  setMeetingForm({ ...meetingForm, description: e.target.value })
                }
                placeholder="Descripción de la reunión"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-date">Fecha *</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingForm.date}
                  onChange={(e) =>
                    setMeetingForm({ ...meetingForm, date: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-time">Hora *</Label>
                <Input
                  id="meeting-time"
                  type="time"
                  value={meetingForm.time}
                  onChange={(e) =>
                    setMeetingForm({ ...meetingForm, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meeting-duration">Duración</Label>
                <Select
                  value={meetingForm.duration}
                  onValueChange={(value) =>
                    setMeetingForm({ ...meetingForm, duration: value })
                  }
                >
                  <SelectTrigger id="meeting-duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">30 minutos</SelectItem>
                    <SelectItem value="1h">1 hora</SelectItem>
                    <SelectItem value="1.5h">1.5 horas</SelectItem>
                    <SelectItem value="2h">2 horas</SelectItem>
                    <SelectItem value="3h">3 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-location">Ubicación</Label>
                <Input
                  id="meeting-location"
                  value={meetingForm.location}
                  onChange={(e) =>
                    setMeetingForm({ ...meetingForm, location: e.target.value })
                  }
                  placeholder="Zoom, Google Meet, etc."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-attendees">Asistentes</Label>
              <Input
                id="meeting-attendees"
                value={meetingForm.attendees?.join(", ")}
                onChange={(e) =>
                  setMeetingForm({
                    ...meetingForm,
                    attendees: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                placeholder="Nombres separados por comas"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMeetingDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddMeeting}>Crear Reunión</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Enlace</DialogTitle>
            <DialogDescription>
              Agrega un enlace o recurso para este proyecto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="link-title">Título *</Label>
              <Input
                id="link-title"
                value={linkForm.title}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, title: e.target.value })
                }
                placeholder="Nombre del recurso"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-url">URL *</Label>
              <Input
                id="link-url"
                type="url"
                value={linkForm.url}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-type">Tipo</Label>
              <Select
                value={linkForm.type}
                onValueChange={(value) =>
                  setLinkForm({ ...linkForm, type: value as any })
                }
              >
                <SelectTrigger id="link-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Repositorio">Repositorio</SelectItem>
                  <SelectItem value="Documentación">Documentación</SelectItem>
                  <SelectItem value="Demo">Demo</SelectItem>
                  <SelectItem value="Diseño">Diseño</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link-description">Descripción</Label>
              <Textarea
                id="link-description"
                value={linkForm.description}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, description: e.target.value })
                }
                placeholder="Descripción del recurso"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddLink}>Agregar Enlace</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
