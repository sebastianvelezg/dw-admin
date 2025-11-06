"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { useProjectStore } from "@/lib/stores/project-store"
import { useClientStore } from "@/lib/stores/client-store"
import { useTaskStore, type Task } from "@/lib/stores/task-store"
import { useMeetingStore, type Meeting } from "@/lib/stores/meeting-store"
import { useLinkStore, type ProjectLink } from "@/lib/stores/link-store"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const unwrappedParams = React.use(params)
  const projectId = parseInt(unwrappedParams.id)

  const { getProjectById } = useProjectStore()
  const { clients } = useClientStore()
  const { tasks, addTask, deleteTask, toggleTaskStatus } = useTaskStore()
  const { meetings, addMeeting, deleteMeeting } = useMeetingStore()
  const { links, addLink, deleteLink } = useLinkStore()

  const project = getProjectById(projectId)
  const projectTasks = tasks.filter(t => t.projectId === projectId)
  const projectMeetings = meetings.filter(m => m.projectId === projectId)
  const projectLinks = links.filter(l => l.projectId === projectId)

  const client = clients.find(c => c.name === project?.client)

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "text-red-500"
      case "Media": return "text-yellow-500"
      case "Baja": return "text-green-500"
      default: return ""
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completado": return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "En progreso": return <Clock className="h-4 w-4 text-blue-500" />
      default: return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/projects")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        <Badge>{project.status}</Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{project.client}</div>
            {client && (
              <p className="text-xs text-muted-foreground mt-1">{client.email}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Presupuesto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="text-lg font-bold">${project.budget.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fecha Límite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-lg font-bold">
                {new Date(project.deadline).toLocaleDateString("es-ES")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Equipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-lg font-bold">{project.team} miembros</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso del Proyecto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tareas Completadas</span>
              <span className="text-sm font-medium">{taskCompletionRate}%</span>
            </div>
            <Progress value={taskCompletionRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completedTasks} de {projectTasks.length} tareas completadas
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">
            Tareas ({projectTasks.length})
          </TabsTrigger>
          <TabsTrigger value="meetings">
            Reuniones ({projectMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="links">
            Enlaces ({projectLinks.length})
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tareas del Proyecto</CardTitle>
                  <CardDescription>
                    Gestiona las tareas y su progreso
                  </CardDescription>
                </div>
                <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
                  <Button onClick={() => setTaskDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Tarea
                  </Button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Nueva Tarea</DialogTitle>
                      <DialogDescription>
                        Crea una nueva tarea para este proyecto
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="task-title">Título</Label>
                        <Input
                          id="task-title"
                          value={taskForm.title}
                          onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                          placeholder="Nombre de la tarea"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="task-desc">Descripción</Label>
                        <Textarea
                          id="task-desc"
                          value={taskForm.description}
                          onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                          placeholder="Describe la tarea..."
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="task-priority">Prioridad</Label>
                          <Select
                            value={taskForm.priority}
                            onValueChange={(value: Task['priority']) =>
                              setTaskForm({...taskForm, priority: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Baja">Baja</SelectItem>
                              <SelectItem value="Media">Media</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="task-date">Fecha Límite</Label>
                          <Input
                            id="task-date"
                            type="date"
                            value={taskForm.dueDate}
                            onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                          />
                        </div>
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
              </div>
            </CardHeader>
            <CardContent>
              {projectTasks.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No hay tareas aún. Crea la primera tarea.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Tarea</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Límite</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
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
                            <div className={`font-medium ${task.status === "Completado" ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {task.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(task.status)}
                            <span className="text-sm">{task.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(task.dueDate).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleTaskStatus(task.id)}>
                                {task.status === "Completado" ? "Marcar pendiente" : "Marcar completada"}
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
                    Programa y gestiona reuniones del proyecto
                  </CardDescription>
                </div>
                <Dialog open={meetingDialogOpen} onOpenChange={setMeetingDialogOpen}>
                  <Button onClick={() => setMeetingDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Reunión
                  </Button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Programar Reunión</DialogTitle>
                      <DialogDescription>
                        Agenda una nueva reunión para el proyecto
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="meeting-title">Título</Label>
                        <Input
                          id="meeting-title"
                          value={meetingForm.title}
                          onChange={(e) => setMeetingForm({...meetingForm, title: e.target.value})}
                          placeholder="Nombre de la reunión"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="meeting-desc">Descripción</Label>
                        <Textarea
                          id="meeting-desc"
                          value={meetingForm.description}
                          onChange={(e) => setMeetingForm({...meetingForm, description: e.target.value})}
                          placeholder="Agenda de la reunión..."
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="meeting-date">Fecha</Label>
                          <Input
                            id="meeting-date"
                            type="date"
                            value={meetingForm.date}
                            onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="meeting-time">Hora</Label>
                          <Input
                            id="meeting-time"
                            type="time"
                            value={meetingForm.time}
                            onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="meeting-duration">Duración</Label>
                          <Select
                            value={meetingForm.duration}
                            onValueChange={(value) =>
                              setMeetingForm({...meetingForm, duration: value})
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30min">30 minutos</SelectItem>
                              <SelectItem value="1h">1 hora</SelectItem>
                              <SelectItem value="1.5h">1.5 horas</SelectItem>
                              <SelectItem value="2h">2 horas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="meeting-location">Ubicación</Label>
                          <Input
                            id="meeting-location"
                            value={meetingForm.location}
                            onChange={(e) => setMeetingForm({...meetingForm, location: e.target.value})}
                            placeholder="Zoom, Google Meet, etc."
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setMeetingDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddMeeting}>Programar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {projectMeetings.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No hay reuniones programadas. Agenda la primera reunión.
                </div>
              ) : (
                <div className="space-y-3">
                  {projectMeetings.map((meeting) => (
                    <Card key={meeting.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <Video className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{meeting.title}</CardTitle>
                              <CardDescription className="text-xs">
                                {meeting.description}
                              </CardDescription>
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
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {meeting.time} - {meeting.duration}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <ExternalLink className="h-4 w-4" />
                          {meeting.location}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Enlaces del Proyecto</CardTitle>
                  <CardDescription>
                    Repositorios, documentación, demos y más
                  </CardDescription>
                </div>
                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <Button onClick={() => setLinkDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Enlace
                  </Button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Enlace</DialogTitle>
                      <DialogDescription>
                        Agrega un enlace útil para el proyecto
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="link-title">Título</Label>
                        <Input
                          id="link-title"
                          value={linkForm.title}
                          onChange={(e) => setLinkForm({...linkForm, title: e.target.value})}
                          placeholder="GitHub Repository"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                          id="link-url"
                          type="url"
                          value={linkForm.url}
                          onChange={(e) => setLinkForm({...linkForm, url: e.target.value})}
                          placeholder="https://github.com/..."
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="link-type">Tipo</Label>
                        <Select
                          value={linkForm.type}
                          onValueChange={(value: ProjectLink['type']) =>
                            setLinkForm({...linkForm, type: value})
                          }
                        >
                          <SelectTrigger>
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
                      <div className="grid gap-2">
                        <Label htmlFor="link-desc">Descripción</Label>
                        <Textarea
                          id="link-desc"
                          value={linkForm.description}
                          onChange={(e) => setLinkForm({...linkForm, description: e.target.value})}
                          placeholder="Descripción del enlace..."
                          rows={2}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleAddLink}>Agregar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {projectLinks.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  No hay enlaces aún. Agrega el primer enlace.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {projectLinks.map((link) => (
                    <Card key={link.id} className="border-2">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                              <LinkIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-sm">{link.title}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {link.type}
                              </Badge>
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
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-muted-foreground mb-2">
                          {link.description}
                        </p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {link.url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
