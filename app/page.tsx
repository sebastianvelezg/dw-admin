"use client"

import {
  DollarSign,
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Chart data
const revenueData = [
  { month: "Ene", revenue: 45000, expenses: 20000 },
  { month: "Feb", revenue: 52000, expenses: 22000 },
  { month: "Mar", revenue: 48000, expenses: 21000 },
  { month: "Abr", revenue: 61000, expenses: 25000 },
  { month: "May", revenue: 55000, expenses: 23000 },
  { month: "Jun", revenue: 67000, expenses: 26000 },
]

const projectsData = [
  { status: "Completado", count: 12 },
  { status: "En progreso", count: 8 },
  { status: "Planeación", count: 5 },
  { status: "En pausa", count: 2 },
]

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Gastos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const projectsChartConfig = {
  count: {
    label: "Proyectos",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const recentProjects = [
  {
    name: "E-commerce Platform",
    client: "TechCorp",
    status: "En progreso",
    progress: 75,
    deadline: "2024-12-15",
    team: 4,
  },
  {
    name: "Mobile App Redesign",
    client: "StartupXYZ",
    status: "Planeación",
    progress: 25,
    deadline: "2024-12-30",
    team: 3,
  },
  {
    name: "Corporate Website",
    client: "BigCo",
    status: "Completado",
    progress: 100,
    deadline: "2024-11-20",
    team: 2,
  },
  {
    name: "API Integration",
    client: "DevServices",
    status: "En progreso",
    progress: 60,
    deadline: "2024-12-10",
    team: 5,
  },
]

const recentPayments = [
  {
    id: "INV-001",
    client: "TechCorp",
    amount: 12500,
    status: "Pagado",
    date: "2024-11-01",
  },
  {
    id: "INV-002",
    client: "StartupXYZ",
    amount: 8750,
    status: "Pendiente",
    date: "2024-11-03",
  },
  {
    id: "INV-003",
    client: "BigCo",
    amount: 15000,
    status: "Pagado",
    date: "2024-11-05",
  },
  {
    id: "INV-004",
    client: "DevServices",
    amount: 6200,
    status: "Vencido",
    date: "2024-10-28",
  },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al panel de administración de DevelopWave
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$328,000</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+20.1%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+180</span> nuevos este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">27</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-red-500">-2</span> desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73.2%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+4.5%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen Financiero</CardTitle>
            <CardDescription>
              Ingresos vs Gastos de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                data={revenueData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-expenses)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-expenses)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="revenue"
                  type="monotone"
                  fill="url(#fillRevenue)"
                  fillOpacity={0.4}
                  stroke="var(--color-revenue)"
                  stackId="a"
                />
                <Area
                  dataKey="expenses"
                  type="monotone"
                  fill="url(#fillExpenses)"
                  fillOpacity={0.4}
                  stroke="var(--color-expenses)"
                  stackId="b"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Estado de Proyectos</CardTitle>
            <CardDescription>
              Distribución de proyectos por estado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={projectsChartConfig}>
              <BarChart data={projectsData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Payments */}
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Proyectos Recientes</TabsTrigger>
          <TabsTrigger value="payments">Pagos Recientes</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Proyectos Activos</CardTitle>
                  <CardDescription>
                    Últimos proyectos en desarrollo
                  </CardDescription>
                </div>
                <Button>Ver todos</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proyecto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Fecha límite</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project) => (
                    <TableRow key={project.name}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            project.status === "Completado"
                              ? "default"
                              : project.status === "En progreso"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-[60px]" />
                          <span className="text-sm text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(project.deadline).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {Array.from({ length: project.team }).map((_, i) => (
                            <Avatar key={i} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback>U{i + 1}</AvatarFallback>
                            </Avatar>
                          ))}
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
                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Asignar equipo</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transacciones Recientes</CardTitle>
                  <CardDescription>
                    Últimos pagos y facturas
                  </CardDescription>
                </div>
                <Button>Nueva Factura</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.client}</TableCell>
                      <TableCell className="font-semibold">
                        ${payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "Pagado"
                              ? "default"
                              : payment.status === "Pendiente"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {payment.status === "Pagado" && (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          )}
                          {payment.status === "Pendiente" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {payment.status === "Vencido" && (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          )}
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.date).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Ver factura</DropdownMenuItem>
                            <DropdownMenuItem>Descargar PDF</DropdownMenuItem>
                            <DropdownMenuItem>Enviar recordatorio</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions & Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Tareas frecuentes de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Agregar nuevo cliente
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Crear proyecto
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Generar factura
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Programar reunión
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimos eventos en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "Juan Pérez",
                  action: "completó el proyecto",
                  target: "E-commerce Platform",
                  time: "Hace 2 horas",
                },
                {
                  user: "María García",
                  action: "creó una factura para",
                  target: "TechCorp",
                  time: "Hace 4 horas",
                },
                {
                  user: "Carlos López",
                  action: "agregó un nuevo cliente",
                  target: "StartupXYZ",
                  time: "Hace 1 día",
                },
                {
                  user: "Ana Martínez",
                  action: "actualizó el estado de",
                  target: "Mobile App Redesign",
                  time: "Hace 2 días",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {activity.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
