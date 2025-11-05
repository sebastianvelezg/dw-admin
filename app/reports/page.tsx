"use client"

import * as React from "react"
import {
  TrendingUp,
  Users,
  DollarSign,
  Briefcase,
  Download,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const revenueData = [
  { month: "Ene", revenue: 45000, clients: 120 },
  { month: "Feb", revenue: 52000, clients: 135 },
  { month: "Mar", revenue: 48000, clients: 128 },
  { month: "Abr", revenue: 61000, clients: 145 },
  { month: "May", revenue: 55000, clients: 140 },
  { month: "Jun", revenue: 67000, clients: 160 },
]

const projectStatusData = [
  { status: "Completado", value: 45, color: "hsl(var(--chart-1))" },
  { status: "En progreso", value: 30, color: "hsl(var(--chart-2))" },
  { status: "Planeación", value: 15, color: "hsl(var(--chart-3))" },
  { status: "En pausa", value: 10, color: "hsl(var(--chart-4))" },
]

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "hsl(var(--chart-1))",
  },
  clients: {
    label: "Clientes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
          <p className="text-muted-foreground">
            Análisis y métricas de desempeño
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$328,000</div>
            <p className="text-xs text-muted-foreground mt-1">
              Últimos 6 meses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">828</div>
            <p className="text-xs text-muted-foreground mt-1">
              Acumulado del periodo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos Completados</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground mt-1">
              Del total de proyectos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Crecimiento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Comparado con periodo anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Ingresos y Clientes</TabsTrigger>
          <TabsTrigger value="projects">Estado de Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Crecimiento de Ingresos y Clientes</CardTitle>
              <CardDescription>
                Análisis de los últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <AreaChart
                  data={revenueData}
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
                  <ChartLegend content={<ChartLegendContent />} />
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
                    dataKey="clients"
                    type="monotone"
                    fill="var(--color-clients)"
                    fillOpacity={0.4}
                    stroke="var(--color-clients)"
                    stackId="b"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Proyectos</CardTitle>
                <CardDescription>
                  Por estado actual
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="space-y-2">
                  {projectStatusData.map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.status}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
                <CardDescription>
                  Indicadores clave del periodo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Proyectos en Tiempo</p>
                    <p className="text-xs text-muted-foreground">
                      Entregados antes del deadline
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">87%</div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Satisfacción del Cliente</p>
                    <p className="text-xs text-muted-foreground">
                      Rating promedio
                    </p>
                  </div>
                  <div className="text-2xl font-bold">4.8/5</div>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Retención de Clientes</p>
                    <p className="text-xs text-muted-foreground">
                      Clientes recurrentes
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">92%</div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Tiempo Promedio</p>
                    <p className="text-xs text-muted-foreground">
                      Duración de proyectos
                    </p>
                  </div>
                  <div className="text-2xl font-bold">6.2 semanas</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
