"use client"

import * as React from "react"
import {
  DollarSign,
  TrendingUp,
  Download,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Mock data
const monthlyData = [
  { month: "Ene", ingresos: 45000, gastos: 20000, ganancia: 25000 },
  { month: "Feb", ingresos: 52000, gastos: 22000, ganancia: 30000 },
  { month: "Mar", ingresos: 48000, gastos: 21000, ganancia: 27000 },
  { month: "Abr", ingresos: 61000, gastos: 25000, ganancia: 36000 },
  { month: "May", ingresos: 55000, gastos: 23000, ganancia: 32000 },
  { month: "Jun", ingresos: 67000, gastos: 26000, ganancia: 41000 },
]

const invoices = [
  {
    id: "INV-001",
    client: "TechCorp Solutions",
    amount: 12500,
    status: "Pagado",
    date: "2024-11-01",
    dueDate: "2024-11-15",
  },
  {
    id: "INV-002",
    client: "StartupXYZ",
    amount: 8750,
    status: "Pendiente",
    date: "2024-11-03",
    dueDate: "2024-11-17",
  },
  {
    id: "INV-003",
    client: "BigCo Enterprise",
    amount: 15000,
    status: "Pagado",
    date: "2024-11-05",
    dueDate: "2024-11-19",
  },
  {
    id: "INV-004",
    client: "DevServices Pro",
    amount: 6200,
    status: "Vencido",
    date: "2024-10-28",
    dueDate: "2024-11-11",
  },
  {
    id: "INV-005",
    client: "Digital Ventures",
    amount: 9500,
    status: "Pendiente",
    date: "2024-11-08",
    dueDate: "2024-11-22",
  },
]

const expenses = [
  { category: "Salarios", amount: 15000 },
  { category: "Infraestructura", amount: 4500 },
  { category: "Software", amount: 2800 },
  { category: "Marketing", amount: 3200 },
  { category: "Otros", amount: 500 },
]

const chartConfig = {
  ingresos: {
    label: "Ingresos",
    color: "hsl(var(--chart-1))",
  },
  gastos: {
    label: "Gastos",
    color: "hsl(var(--chart-2))",
  },
  ganancia: {
    label: "Ganancia",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

const expenseChartConfig = {
  amount: {
    label: "Monto",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export default function FinancePage() {
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = React.useState(false)

  const totalIngresos = monthlyData[monthlyData.length - 1].ingresos
  const totalGastos = monthlyData[monthlyData.length - 1].gastos
  const totalGanancia = monthlyData[monthlyData.length - 1].ganancia
  const pendingAmount = invoices
    .filter((inv) => inv.status === "Pendiente")
    .reduce((acc, inv) => acc + inv.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finanzas</h1>
          <p className="text-muted-foreground">
            Control financiero y gestión de facturación
          </p>
        </div>
        <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Factura
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nueva Factura</DialogTitle>
              <DialogDescription>
                Genera una nueva factura para un cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoice-client">Cliente</Label>
                  <Select>
                    <SelectTrigger id="invoice-client">
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                      <SelectItem value="startupxyz">StartupXYZ</SelectItem>
                      <SelectItem value="bigco">BigCo Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoice-amount">Monto</Label>
                  <Input
                    id="invoice-amount"
                    type="number"
                    placeholder="12500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoice-date">Fecha de emisión</Label>
                  <Input id="invoice-date" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="invoice-due">Fecha de vencimiento</Label>
                  <Input id="invoice-due" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice-description">Descripción</Label>
                <Textarea
                  id="invoice-description"
                  placeholder="Servicios de desarrollo web..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsInvoiceDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsInvoiceDialogOpen(false)}>
                Crear Factura
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIngresos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12.5%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGastos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-red-500" />
              <span className="text-red-500">+5.2%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalGanancia.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+18.2%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices.filter((inv) => inv.status === "Pendiente").length} factura(s)
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
              Flujo de efectivo de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                data={monthlyData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  dataKey="ingresos"
                  type="monotone"
                  stroke="var(--color-ingresos)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="gastos"
                  type="monotone"
                  stroke="var(--color-gastos)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="ganancia"
                  type="monotone"
                  stroke="var(--color-ganancia)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
            <CardDescription>
              Gastos por categoría este mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={expenseChartConfig}>
              <BarChart data={expenses}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Facturas Recientes</CardTitle>
              <CardDescription>
                Gestión de facturación y pagos
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
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
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell className="font-semibold">
                        ${invoice.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.date).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        {new Date(invoice.dueDate).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "Pagado"
                              ? "default"
                              : invoice.status === "Pendiente"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {invoice.status === "Pagado" && (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          )}
                          {invoice.status === "Pendiente" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {invoice.status === "Vencido" && (
                            <AlertCircle className="mr-1 h-3 w-3" />
                          )}
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
                            <DropdownMenuItem>Ver factura</DropdownMenuItem>
                            <DropdownMenuItem>Descargar PDF</DropdownMenuItem>
                            <DropdownMenuItem>Enviar recordatorio</DropdownMenuItem>
                            <DropdownMenuItem>Marcar como pagada</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
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
    </div>
  )
}
