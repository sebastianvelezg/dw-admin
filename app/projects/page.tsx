"use client"

import * as React from "react"
import Link from "next/link"
import {
  Plus,
  Calendar,
  Users,
  DollarSign,
  MoreHorizontal,
  LayoutList,
  LayoutGrid,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock data
const projects = [
  {
    id: 1,
    title: "E-commerce Platform",
    client: "TechCorp",
    status: "En progreso",
    progress: 75,
    budget: 45000,
    deadline: "2024-12-15",
    team: 4,
    description: "Plataforma completa de e-commerce con integración de pagos",
  },
  {
    id: 2,
    title: "Mobile App Redesign",
    client: "StartupXYZ",
    status: "Planeación",
    progress: 25,
    budget: 30000,
    deadline: "2024-12-30",
    team: 3,
    description: "Rediseño completo de aplicación móvil iOS y Android",
  },
  {
    id: 3,
    title: "Corporate Website",
    client: "BigCo",
    status: "Completado",
    progress: 100,
    budget: 15000,
    deadline: "2024-11-20",
    team: 2,
    description: "Sitio web corporativo con CMS",
  },
  {
    id: 4,
    title: "API Integration",
    client: "DevServices",
    status: "En progreso",
    progress: 60,
    budget: 20000,
    deadline: "2024-12-10",
    team: 5,
    description: "Integración de APIs de terceros",
  },
  {
    id: 5,
    title: "Dashboard Analytics",
    client: "Digital Ventures",
    status: "Planeación",
    progress: 15,
    budget: 35000,
    deadline: "2025-01-15",
    team: 3,
    description: "Dashboard de analytics en tiempo real",
  },
  {
    id: 6,
    title: "CRM System",
    client: "TechCorp",
    status: "En revisión",
    progress: 85,
    budget: 55000,
    deadline: "2024-11-30",
    team: 6,
    description: "Sistema CRM personalizado",
  },
]

const statusColors = {
  Planeación: "outline",
  "En progreso": "secondary",
  "En revisión": "default",
  Completado: "default",
  "En pausa": "outline",
}

const statusGroups = {
  Planeación: projects.filter((p) => p.status === "Planeación"),
  "En progreso": projects.filter((p) => p.status === "En progreso"),
  "En revisión": projects.filter((p) => p.status === "En revisión"),
  Completado: projects.filter((p) => p.status === "Completado"),
}

export default function ProjectsPage() {
  const [view, setView] = React.useState<"kanban" | "list">("kanban")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">
            Gestiona y da seguimiento a todos tus proyectos
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as "kanban" | "list")}>
            <TabsList>
              <TabsTrigger value="kanban">
                <LayoutGrid className="mr-2 h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="list">
                <LayoutList className="mr-2 h-4 w-4" />
                Lista
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                <DialogDescription>
                  Ingresa los detalles del proyecto
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Nombre del Proyecto</Label>
                  <Input id="title" placeholder="E-commerce Platform" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="client">Cliente</Label>
                    <Select>
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="techcorp">TechCorp</SelectItem>
                        <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                        <SelectItem value="bigco">BigCo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select defaultValue="planeacion">
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planeacion">Planeación</SelectItem>
                        <SelectItem value="progreso">En progreso</SelectItem>
                        <SelectItem value="revision">En revisión</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Presupuesto</Label>
                    <Input id="budget" type="number" placeholder="45000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Fecha límite</Label>
                    <Input id="deadline" type="date" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el proyecto..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>
                  Crear Proyecto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Proyectos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "En progreso").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.status === "Completado").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${projects.reduce((acc, p) => acc + p.budget, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban View */}
      {view === "kanban" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(statusGroups).map(([status, statusProjects]) => (
            <Card key={status} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{status}</CardTitle>
                  <Badge variant="secondary">{statusProjects.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-3">
                    {statusProjects.map((project) => (
                      <Card key={project.id} className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                        <Link href={`/projects/${project.id}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-sm font-medium leading-tight hover:text-primary">
                                {project.title}
                              </CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                <DropdownMenuItem>Editar</DropdownMenuItem>
                                <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {project.client}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-4">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progreso</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-1.5" />
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.deadline).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-1 font-medium">
                              <DollarSign className="h-3 w-3" />
                              {(project.budget / 1000).toFixed(0)}k
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {Array.from({ length: project.team }).map((_, i) => (
                                <Avatar
                                  key={i}
                                  className="h-6 w-6 border-2 border-background"
                                >
                                  <AvatarFallback className="text-[10px]">
                                    U{i + 1}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {project.team}
                            </div>
                          </div>
                        </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Todos los Proyectos</CardTitle>
            <CardDescription>Vista completa de proyectos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.map((project) => (
                <Card key={project.id} className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <Link href={`/projects/${project.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-base hover:text-primary">
                              {project.title}
                            </CardTitle>
                          <Badge variant={statusColors[project.status as keyof typeof statusColors]}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className="mt-1">
                          {project.description}
                        </CardDescription>
                      </div>
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
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Cliente</p>
                        <p className="text-sm font-medium">{project.client}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Presupuesto</p>
                        <p className="text-sm font-medium">
                          ${project.budget.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Fecha límite</p>
                        <p className="text-sm font-medium">
                          {new Date(project.deadline).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Equipo</p>
                        <div className="flex -space-x-2">
                          {Array.from({ length: project.team }).map((_, i) => (
                            <Avatar
                              key={i}
                              className="h-6 w-6 border-2 border-background"
                            >
                              <AvatarFallback className="text-[10px]">
                                U{i + 1}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                  </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
