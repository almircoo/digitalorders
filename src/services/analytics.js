// Analytics utility functions and mock data generators
// https://recharts.org/en-US
// Generate random number between min and max (inclusive)
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

// Generate random data for a time series (daily, weekly, monthly)
export const generateTimeSeriesData = (days, minValue, maxValue, trend = "random") => {
  const data = []
  let lastValue = randomInt(minValue, maxValue)

  for (let i = 0; i < days; i++) {
    // Calculate date for this data point
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))
    const formattedDate = date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })

    // Generate value based on trend
    let change
    switch (trend) {
      case "up":
        change = randomInt(0, Math.floor((maxValue - lastValue) / 5))
        break
      case "down":
        change = -randomInt(0, Math.floor((lastValue - minValue) / 5))
        break
      case "stable":
        change = randomInt(-Math.floor((maxValue - minValue) / 20), Math.floor((maxValue - minValue) / 20))
        break
      default: // random
        change = randomInt(-Math.floor((maxValue - minValue) / 10), Math.floor((maxValue - minValue) / 10))
    }

    lastValue = Math.max(minValue, Math.min(maxValue, lastValue + change))

    data.push({
      date: formattedDate,
      value: lastValue,
    })
  }

  return data
}

// Generate mock data for restaurant analytics
export const generateRestaurantAnalytics = () => {
  // Orders data - last 30 days
  const orderData = generateTimeSeriesData(30, 5, 25, "up")
  const totalOrders = orderData.reduce((sum, item) => sum + item.value, 0)

  // Revenue data - last 30 days
  const revenueData = orderData.map((item) => ({
    date: item.date,
    value: item.value * randomInt(30, 80), // Average order value between 30-80
  }))
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0)

  // Top products
  const topProducts = [
    { name: "Manzanas", quantity: randomInt(50, 200), revenue: randomInt(200, 800) },
    { name: "Plátanos", quantity: randomInt(40, 180), revenue: randomInt(150, 700) },
    { name: "Tomates", quantity: randomInt(30, 160), revenue: randomInt(120, 600) },
    { name: "Lechugas", quantity: randomInt(20, 140), revenue: randomInt(100, 500) },
    { name: "Zanahorias", quantity: randomInt(15, 120), revenue: randomInt(80, 400) },
  ].sort((a, b) => b.revenue - a.revenue)

  // Top providers
  const topProviders = [
    { name: "Proveedor Frutas S.A.", orders: randomInt(10, 50), spending: randomInt(500, 2000) },
    { name: "Verduras Express", orders: randomInt(8, 45), spending: randomInt(400, 1800) },
    { name: "Distribuidora Orgánica", orders: randomInt(6, 40), spending: randomInt(300, 1600) },
    { name: "Alimentos Frescos", orders: randomInt(5, 35), spending: randomInt(250, 1400) },
    { name: "Productos del Campo", orders: randomInt(4, 30), spending: randomInt(200, 1200) },
  ].sort((a, b) => b.spending - a.spending)

  // Order status distribution
  const orderStatusData = [
    { name: "Registrado", value: randomInt(5, 15) },
    { name: "Aprobado", value: randomInt(10, 20) },
    { name: "Preparado", value: randomInt(15, 25) },
    { name: "Llevando", value: randomInt(5, 15) },
    { name: "Entregado", value: randomInt(40, 60) },
  ]

  // Monthly comparison (last 6 months)
  const monthlyComparison = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleDateString("es-ES", { month: "short" })

    monthlyComparison.push({
      month: monthName,
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
    orderData,
    revenueData,
    topProducts,
    topProviders,
    orderStatusData,
    monthlyComparison,
  }
}

// Generate mock data for provider analytics
export const generateProviderAnalytics = () => {
  // Sales data - last 30 days
  const salesData = generateTimeSeriesData(30, 8, 35, "up")
  const totalSales = salesData.reduce((sum, item) => sum + item.value, 0)

  // Revenue data - last 30 days
  const revenueData = salesData.map((item) => ({
    date: item.date,
    value: item.value * randomInt(40, 100), // Average sale value between 40-100
  }))
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.value, 0)

  // Top products
  const topProducts = [
    { name: "Manzanas Premium", quantity: randomInt(100, 400), revenue: randomInt(500, 2000) },
    { name: "Plátanos Orgánicos", quantity: randomInt(80, 350), revenue: randomInt(400, 1800) },
    { name: "Tomates Frescos", quantity: randomInt(70, 300), revenue: randomInt(350, 1600) },
    { name: "Lechugas Hidropónicas", quantity: randomInt(50, 250), revenue: randomInt(300, 1400) },
    { name: "Zanahorias Orgánicas", quantity: randomInt(40, 200), revenue: randomInt(250, 1200) },
  ].sort((a, b) => b.revenue - a.revenue)

  // Top customers (restaurants)
  const topCustomers = [
    { name: "Restaurante El Gourmet", orders: randomInt(15, 60), revenue: randomInt(800, 3000) },
    { name: "Cocina Peruana", orders: randomInt(12, 50), revenue: randomInt(700, 2500) },
    { name: "Sabores del Mar", orders: randomInt(10, 45), revenue: randomInt(600, 2200) },
    { name: "La Buena Mesa", orders: randomInt(8, 40), revenue: randomInt(500, 2000) },
    { name: "Delicias Criollas", orders: randomInt(6, 35), revenue: randomInt(400, 1800) },
  ].sort((a, b) => b.revenue - a.revenue)

  // Product category distribution
  const categoryData = [
    { name: "Frutas", value: randomInt(30, 45) },
    { name: "Verduras", value: randomInt(25, 40) },
    { name: "Lácteos", value: randomInt(10, 20) },
    { name: "Carnes", value: randomInt(5, 15) },
    { name: "Otros", value: randomInt(5, 10) },
  ]

  // Monthly comparison (last 6 months)
  const monthlyComparison = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthName = date.toLocaleDateString("es-ES", { month: "short" })

    monthlyComparison.push({
      month: monthName,
      sales: randomInt(200, 800),
      revenue: randomInt(10000, 40000),
    })
  }

  // Inventory levels
  const inventoryData = [
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
    salesData,
    revenueData,
    topProducts,
    topCustomers,
    categoryData,
    monthlyComparison,
    inventoryData,
  }
}

// Calculate percentage change between two values
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0
  return (((current - previous) / previous) * 100).toFixed(1)
}

// Format currency values
export const formatCurrency = (value) => {
  return `S/. ${Number(value).toFixed(2)}`
}
