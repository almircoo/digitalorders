// Funciones de utilidad para analytics y generación de datos de prueba ===
// Recharts docs: https://recharts.org/en-US

// Devuelve un número aleatorio entre min y max (incluidos)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// Generador de datos con tendencia (opcional): "up", "down", "stable", o random por defecto
export const generateTimeSeriesData = (days, minValue, maxValue, trend = "random") => {
  const data = []
  let last = randomInt(minValue, maxValue)

  for (let i = 0; i < days; i++) {
    const now = new Date()
    now.setDate(now.getDate() - (days - i - 1))
    const label = now.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })

    let variation
    switch (trend) {
      case "up":
        variation = randomInt(0, Math.floor((maxValue - last) / 5))
        break
      case "down":
        variation = -randomInt(0, Math.floor((last - minValue) / 5))
        break
      case "stable":
        variation = randomInt(-Math.floor((maxValue - minValue) / 20), Math.floor((maxValue - minValue) / 20))
        break
      default:
        variation = randomInt(-Math.floor((maxValue - minValue) / 10), Math.floor((maxValue - minValue) / 10))
    }

    last = Math.min(maxValue, Math.max(minValue, last + variation))

    data.push({
      date: label,
      value: last,
    })
  }

  return data
}

// Genera datos mock para dashboards de restaurante
export const generateRestaurantAnalytics = () => {
  const orderSeries = generateTimeSeriesData(30, 5, 25, "up")
  const totalOrders = orderSeries.reduce((sum, d) => sum + d.value, 0)

  const revenueSeries = orderSeries.map((d) => ({
    date: d.date,
    value: d.value * randomInt(30, 80),
  }))
  const totalRevenue = revenueSeries.reduce((sum, d) => sum + d.value, 0)

  const topProducts = [
    { name: "Manzanas", quantity: randomInt(50, 200), revenue: randomInt(200, 800) },
    { name: "Plátanos", quantity: randomInt(40, 180), revenue: randomInt(150, 700) },
    { name: "Tomates", quantity: randomInt(30, 160), revenue: randomInt(120, 600) },
    { name: "Lechugas", quantity: randomInt(20, 140), revenue: randomInt(100, 500) },
    { name: "Zanahorias", quantity: randomInt(15, 120), revenue: randomInt(80, 400) },
  ].sort((a, b) => b.revenue - a.revenue)

  const topSuppliers = [
    { name: "Proveedor Frutas S.A.", orders: randomInt(10, 50), spending: randomInt(500, 2000) },
    { name: "Verduras Express", orders: randomInt(8, 45), spending: randomInt(400, 1800) },
    { name: "Distribuidora Orgánica", orders: randomInt(6, 40), spending: randomInt(300, 1600) },
    { name: "Alimentos Frescos", orders: randomInt(5, 35), spending: randomInt(250, 1400) },
    { name: "Productos del Campo", orders: randomInt(4, 30), spending: randomInt(200, 1200) },
  ].sort((a, b) => b.spending - a.spending)

  const orderStages = [
    { name: "Registrado", value: randomInt(5, 15) },
    { name: "Aprobado", value: randomInt(10, 20) },
    { name: "Preparado", value: randomInt(15, 25) },
    { name: "Llevando", value: randomInt(5, 15) },
    { name: "Entregado", value: randomInt(40, 60) },
  ]

  const monthlyComparison = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const month = d.toLocaleDateString("es-ES", { month: "short" })

    monthlyComparison.push({
      month,
      orders: randomInt(100, 500),
      revenue: randomInt(5000, 20000),
    })
  }

  return {
    summary: {
      totalOrders,
      totalRevenue: totalRevenue.toFixed(2),
      averageOrderValue: (totalRevenue / totalOrders).toFixed(2),
      activeProviders: randomInt(5, 15),
    },
    orderData: orderSeries,
    revenueData: revenueSeries,
    topProducts,
    topProviders: topSuppliers,
    orderStatusData: orderStages,
    monthlyComparison,
  }
}

// Generador para el panel de proveedor
export const generateProviderAnalytics = () => {
  const sales = generateTimeSeriesData(30, 8, 35, "up")
  const totalSales = sales.reduce((acc, s) => acc + s.value, 0)

  const revenue = sales.map((s) => ({
    date: s.date,
    value: s.value * randomInt(40, 100),
  }))
  const totalRevenue = revenue.reduce((sum, s) => sum + s.value, 0)

  const topProducts = [
    { name: "Manzanas Premium", quantity: randomInt(100, 400), revenue: randomInt(500, 2000) },
    { name: "Plátanos Orgánicos", quantity: randomInt(80, 350), revenue: randomInt(400, 1800) },
    { name: "Tomates Frescos", quantity: randomInt(70, 300), revenue: randomInt(350, 1600) },
    { name: "Lechugas Hidropónicas", quantity: randomInt(50, 250), revenue: randomInt(300, 1400) },
    { name: "Zanahorias Orgánicas", quantity: randomInt(40, 200), revenue: randomInt(250, 1200) },
  ].sort((a, b) => b.revenue - a.revenue)

  const topBuyers = [
    { name: "Restaurante El Gourmet", orders: randomInt(15, 60), revenue: randomInt(800, 3000) },
    { name: "Cocina Peruana", orders: randomInt(12, 50), revenue: randomInt(700, 2500) },
    { name: "Sabores del Mar", orders: randomInt(10, 45), revenue: randomInt(600, 2200) },
    { name: "La Buena Mesa", orders: randomInt(8, 40), revenue: randomInt(500, 2000) },
    { name: "Delicias Criollas", orders: randomInt(6, 35), revenue: randomInt(400, 1800) },
  ].sort((a, b) => b.revenue - a.revenue)

  const categoryBreakdown = [
    { name: "Frutas", value: randomInt(30, 45) },
    { name: "Verduras", value: randomInt(25, 40) },
    { name: "Lácteos", value: randomInt(10, 20) },
    { name: "Carnes", value: randomInt(5, 15) },
    { name: "Otros", value: randomInt(5, 10) },
  ]

  const monthlyStats = []
  for (let i = 5; i >= 0; i--) {
    const dt = new Date()
    dt.setMonth(dt.getMonth() - i)
    const month = dt.toLocaleDateString("es-ES", { month: "short" })

    monthlyStats.push({
      month,
      sales: randomInt(200, 800),
      revenue: randomInt(10000, 40000),
    })
  }

  const inventoryLevels = [
    { name: "Frutas", stock: randomInt(70, 95) },
    { name: "Verduras", stock: randomInt(60, 90) },
    { name: "Lácteos", stock: randomInt(50, 85) },
    { name: "Carnes", stock: randomInt(40, 80) },
    { name: "Granos", stock: randomInt(60, 90) },
  ]

  return {
    summary: {
      totalSales,
      totalRevenue: totalRevenue.toFixed(2),
      averageSaleValue: (totalRevenue / totalSales).toFixed(2),
      activeCustomers: randomInt(8, 25),
    },
    salesData: sales,
    revenueData: revenue,
    topProducts,
    topCustomers: topBuyers,
    categoryData: categoryBreakdown,
    monthlyComparison: monthlyStats,
    inventoryData: inventoryLevels,
  }
}

// Calcula el % de cambio (evita división por cero)
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return
  // Había un bug menor aquí — se sobrescribía el retorno
  return (((current - previous) / previous) * 100).toFixed(1)
}

// Formateo de moneda
export const formatCurrency = (value) => `S/. ${Number(value).toFixed(2)}`
