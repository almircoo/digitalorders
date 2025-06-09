

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateProviderAnalytics, formatCurrency, calculatePercentageChange } from "../../services/analytics"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { ArrowUpIcon, ArrowDownIcon, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function ProviderAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [timeRange, setTimeRange] = useState("30d")
  const [isLoading, setIsLoading] = useState(true)

  // Generate analytics data on component mount
  useEffect(() => {
    setIsLoading(true)
    // Simul llamada a api
    setTimeout(() => {
      const data = generateProviderAnalytics()
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

  // Calcular metricas del periods antiguos para comparación
  const previousSales = analytics.salesData.slice(0, 15).reduce((sum, item) => sum + item.value, 0)
  const currentSales = analytics.salesData.slice(15).reduce((sum, item) => sum + item.value, 0)
  const salesChange = calculatePercentageChange(currentSales, previousSales)

  const previousRevenue = analytics.revenueData.slice(0, 15).reduce((sum, item) => sum + item.value, 0)
  const currentRevenue = analytics.revenueData.slice(15).reduce((sum, item) => sum + item.value, 0)
  const revenueChange = calculatePercentageChange(currentRevenue, previousRevenue)

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Análisis de Proveedor</h2>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Ventas</p>
                  <p className="text-2xl font-bold">{analytics.summary.totalSales}</p>
                </div>
                <div className={`flex items-center rounded-full p-2 ${salesChange >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                  <ShoppingCart className={`h-5 w-5 ${salesChange >= 0 ? "text-green-600" : "text-red-600"}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {salesChange >= 0 ? (
                  <ArrowUpIcon className="mr-1 h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-4 w-4 text-red-600" />
                )}
                <span className={salesChange >= 0 ? "text-green-600" : "text-red-600"}>{Math.abs(salesChange)}%</span>
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
                  <p className="text-2xl font-bold">{formatCurrency(analytics.summary.averageSaleValue)}</p>
                </div>
                <div className="flex items-center rounded-full bg-blue-100 p-2">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                Por venta en el periodo seleccionado
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clientes Activos</p>
                  <p className="text-2xl font-bold">{analytics.summary.activeCustomers}</p>
                </div>
                <div className="flex items-center rounded-full bg-purple-100 p-2">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">Restaurantes con compras activas</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas</CardTitle>
              <CardDescription>Número de ventas diarias en los últimos 30 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} ventas`, "Cantidad"]} />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Ventas" stroke="#8884d8" activeDot={{ r: 8 }} />
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
              <CardTitle>Productos Más Vendidos</CardTitle>
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
                    <YAxis dataKey="name" type="category" width={120} />
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
              <CardTitle>Distribución por Categoría</CardTitle>
              <CardDescription>Ventas por categoría de producto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Niveles de Inventario</CardTitle>
              <CardDescription>Porcentaje de stock disponible por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={analytics.inventoryData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Stock" dataKey="stock" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => [`${value}%`, "Stock"]} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativa Mensual</CardTitle>
              <CardDescription>Ventas e ingresos de los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.monthlyComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "sales" ? `${value} ventas` : formatCurrency(value),
                        name === "sales" ? "Ventas" : "Ingresos",
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Ventas" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="revenue" name="Ingresos" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Principales Clientes</CardTitle>
              <CardDescription>Por volumen de compras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium">Cliente</th>
                      <th className="pb-2 text-right font-medium">Pedidos</th>
                      <th className="pb-2 text-right font-medium">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topCustomers.map((customer, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">{customer.name}</td>
                        <td className="py-3 text-right">{customer.orders}</td>
                        <td className="py-3 text-right">{formatCurrency(customer.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Productos Más Rentables</CardTitle>
              <CardDescription>Por ingresos generados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 text-left font-medium">Producto</th>
                      <th className="pb-2 text-right font-medium">Cantidad</th>
                      <th className="pb-2 text-right font-medium">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.topProducts.map((product, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="py-3">{product.name}</td>
                        <td className="py-3 text-right">{product.quantity}</td>
                        <td className="py-3 text-right">{formatCurrency(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
export default ProviderAnalytics;