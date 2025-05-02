"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateRestaurantAnalytics, formatCurrency, calculatePercentageChange } from "../../services/analytics"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function RestaurantAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)

  // Generate analytics data on component mount
  useEffect(() => {
    setIsLoading(true)
    // Simulate API call delay
    setTimeout(() => {
      const data = generateRestaurantAnalytics()
      setAnalytics(data)
      setIsLoading(false)
    }, 800)
  }, [timeRange])

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Calculate previous period metrics for comparison
  const previousOrders = analytics.orderData.slice(0, 15).reduce((sum, item) => sum + item.value, 0)
  const currentOrders = analytics.orderData.slice(15).reduce((sum, item) => sum + item.value, 0)
  const orderChange = calculatePercentageChange(currentOrders, previousOrders)

  const previousRevenue = analytics.revenueData.slice(0, 15).reduce((sum, item) => sum + item.value, 0)
  const currentRevenue = analytics.revenueData.slice(15).reduce((sum, item) => sum + item.value, 0)
  const revenueChange = calculatePercentageChange(currentRevenue, previousRevenue)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Análisis de Restaurante</h2>
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="7d">7 días</TabsTrigger>
            <TabsTrigger value="30d">30 días</TabsTrigger>
            <TabsTrigger value="90d">90 días</TabsTrigger>
            <TabsTrigger value="12m">12 meses</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
                <p className="text-2xl font-bold">{analytics.summary.totalOrders}</p>
              </div>
              <div className={`flex items-center rounded-full p-2 ${orderChange >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                <ShoppingCart className={`h-5 w-5 ${orderChange >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {orderChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-600" />
              )}
              <span className={orderChange >= 0 ? "text-green-600" : "text-red-600"}>{Math.abs(orderChange)}%</span>
              <span className="ml-1 text-muted-foreground">vs. periodo anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.summary.totalRevenue)}</p>
              </div>
              <div
                className={`flex items-center rounded-full p-2 ${revenueChange >= 0 ? "bg-green-100" : "bg-red-100"}`}
              >
                <DollarSign className={`h-5 w-5 ${revenueChange >= 0 ? "text-green-600" : "text-red-600"}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {revenueChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-600" />
              )}
              <span className={revenueChange >= 0 ? "text-green-600" : "text-red-600"}>{Math.abs(revenueChange)}%</span>
              <span className="ml-1 text-muted-foreground">vs. periodo anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Promedio</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.summary.averageOrderValue)}</p>
              </div>
              <div className="flex items-center rounded-full bg-blue-100 p-2">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              Por pedido en el periodo seleccionado
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Proveedores Activos</p>
                <p className="text-2xl font-bold">{analytics.summary.activeProviders}</p>
              </div>
              <div className="flex items-center rounded-full bg-purple-100 p-2">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">Proveedores con pedidos activos</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Pedidos</CardTitle>
            <CardDescription>Número de pedidos diarios en los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.orderData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} pedidos`, "Cantidad"]} />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Pedidos" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos</CardTitle>
            <CardDescription>Ingresos diarios en los últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(value), "Ingresos"]} />
                  <Legend />
                  <Bar dataKey="value" name="Ingresos" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Pedidos</CardTitle>
            <CardDescription>Top 5 productos por cantidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={analytics.topProducts}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip formatter={(value, name) => [value, name === "quantity" ? "Cantidad" : "Ingresos"]} />
                  <Legend />
                  <Bar dataKey="quantity" name="Cantidad" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Pedidos</CardTitle>
            <CardDescription>Distribución de pedidos por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {analytics.orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} pedidos`, "Cantidad"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Principales Proveedores</CardTitle>
            <CardDescription>Por volumen de compras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Proveedor</th>
                    <th className="pb-2 text-right font-medium">Pedidos</th>
                    <th className="pb-2 text-right font-medium">Gasto</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.topProviders.map((provider, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3">{provider.name}</td>
                      <td className="py-3 text-right">{provider.orders}</td>
                      <td className="py-3 text-right">{formatCurrency(provider.spending)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comparativa Mensual</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Mes</th>
                    <th className="pb-2 text-right font-medium">Pedidos</th>
                    <th className="pb-2 text-right font-medium">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.monthlyComparison.map((month, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-3">{month.month}</td>
                      <td className="py-3 text-right">{month.orders}</td>
                      <td className="py-3 text-right">{formatCurrency(month.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
