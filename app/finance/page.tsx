"use client"

import * as React from "react"
import Link from "next/link"
import {
  DollarSign,
  TrendingUp,
  Download,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Receipt,
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
import { useInvoiceStore } from "@/lib/stores/invoice-store"
import { useQuoteStore } from "@/lib/stores/quote-store"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-utils"

// Expense data (could be moved to a store later)
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
  const { invoices, updateInvoice, deleteInvoice } = useInvoiceStore()
  const { quotes } = useQuoteStore()

  // Calculate financial metrics from real data
  const totalIngresos = invoices
    .filter((inv) => inv.status === "Pagada")
    .reduce((acc, inv) => acc + inv.total, 0)

  const totalGastos = expenses.reduce((acc, exp) => acc + exp.amount, 0)
  const totalGanancia = totalIngresos - totalGastos

  const pendingAmount = invoices
    .filter((inv) => inv.status === "Pendiente")
    .reduce((acc, inv) => acc + inv.total, 0)

  const overdueAmount = invoices
    .filter((inv) => inv.status === "Vencida")
    .reduce((acc, inv) => acc + inv.total, 0)

  const quotesValue = quotes
    .filter((q) => q.status === "Enviada" || q.status === "Aceptada")
    .reduce((acc, q) => acc + q.total, 0)

  // Generate monthly data from invoices
  const monthlyData = React.useMemo(() => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const currentMonth = new Date().getMonth()
    const data = []

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12
      const monthName = months[monthIndex]

      // Calculate income for this month from paid invoices
      const monthIncome = invoices
        .filter((inv) => {
          const invDate = new Date(inv.issueDate)
          return invDate.getMonth() === monthIndex && inv.status === "Pagada"
        })
        .reduce((acc, inv) => acc + inv.total, 0)

      data.push({
        month: monthName,
        ingresos: monthIncome || (45000 + Math.random() * 20000), // Fallback to mock data if no real data
        gastos: totalGastos,
        ganancia: (monthIncome || (45000 + Math.random() * 20000)) - totalGastos,
      })
    }

    return data
  }, [invoices, totalGastos])

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
        <div className="flex gap-2">
          <Link href="/invoices">
            <Button variant="outline">
              <Receipt className="mr-2 h-4 w-4" />
              Ver Facturas
            </Button>
          </Link>
          <Link href="/quotes">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Ver Cotizaciones
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIngresos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices.filter((inv) => inv.status === "Pagada").length} factura(s) pagada(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGastos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {expenses.length} categoría(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGanancia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalGanancia.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ingresos - Gastos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Pago</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {invoices.filter((inv) => inv.status === "Pendiente").length} factura(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cotizaciones</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${quotesValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {quotes.filter((q) => q.status === "Enviada" || q.status === "Aceptada").length} activa(s)
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
                Gestión de facturación y pagos ({invoices.length} total)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                const exportData = invoices.map(inv => ({
                  Número: inv.invoiceNumber,
                  Cliente: inv.clientName,
                  Total: `$${inv.total.toFixed(2)}`,
                  Estado: inv.status,
                  Fecha: inv.issueDate,
                  Vencimiento: inv.dueDate
                }))
                exportToCSV(exportData, `finanzas-${new Date().toISOString().split('T')[0]}.csv`)
                toast.success("Datos exportados exitosamente")
              }}>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Link href="/invoices">
                <Button size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todas ({invoices.length})</TabsTrigger>
              <TabsTrigger value="paid">Pagadas ({invoices.filter(i => i.status === "Pagada").length})</TabsTrigger>
              <TabsTrigger value="pending">Pendientes ({invoices.filter(i => i.status === "Pendiente").length})</TabsTrigger>
              <TabsTrigger value="overdue">Vencidas ({invoices.filter(i => i.status === "Vencida").length})</TabsTrigger>
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
                  {invoices.slice(0, 10).map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium font-mono">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell className="font-semibold">
                        ${invoice.total.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {invoice.issueDate}
                      </TableCell>
                      <TableCell>
                        {invoice.dueDate}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.status === "Pagada"
                              ? "default"
                              : invoice.status === "Pendiente"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {invoice.status === "Pagada" && (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          )}
                          {invoice.status === "Pendiente" && (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {invoice.status === "Vencida" && (
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
                            {invoice.status !== "Pagada" && (
                              <DropdownMenuItem onClick={() => {
                                updateInvoice(invoice.id, {
                                  status: "Pagada",
                                  paidDate: new Date().toISOString().split('T')[0]
                                })
                                toast.success("Factura marcada como pagada")
                              }}>
                                Marcar como pagada
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Link href="/invoices">Ver detalles</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                if (confirm("¿Estás seguro de que deseas eliminar esta factura?")) {
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
              {invoices.length > 10 && (
                <div className="mt-4 text-center">
                  <Link href="/invoices">
                    <Button variant="outline">Ver todas las facturas</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
            <TabsContent value="paid" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha de Pago</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.filter(i => i.status === "Pagada").map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium font-mono">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell className="font-semibold">${invoice.total.toLocaleString()}</TableCell>
                      <TableCell>{invoice.paidDate || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.filter(i => i.status === "Pendiente").map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium font-mono">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell className="font-semibold">${invoice.total.toLocaleString()}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => {
                          updateInvoice(invoice.id, {
                            status: "Pagada",
                            paidDate: new Date().toISOString().split('T')[0]
                          })
                          toast.success("Factura marcada como pagada")
                        }}>
                          Marcar como pagada
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="overdue" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Factura</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.filter(i => i.status === "Vencida").map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium font-mono">{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell className="font-semibold text-red-600">${invoice.total.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">{invoice.dueDate}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => {
                          updateInvoice(invoice.id, {
                            status: "Pagada",
                            paidDate: new Date().toISOString().split('T')[0]
                          })
                          toast.success("Factura marcada como pagada")
                        }}>
                          Marcar como pagada
                        </Button>
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
