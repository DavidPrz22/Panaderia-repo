export const dashboardKeys = {
  all: ["dashboard"] as const,
  salesToday: () => [...dashboardKeys.all, "sales-today"] as const,
  pendingOrders: () => [...dashboardKeys.all, "pending-orders"] as const,
  stockAlerts: () => [...dashboardKeys.all, "stock-alerts"] as const,
  recentProductions: () => [...dashboardKeys.all, "recent-productions"] as const,
  salesTrends: () => [...dashboardKeys.all, "sales-trends"] as const,
  topProducts: () => [...dashboardKeys.all, "top-products"] as const,
  recentPurchases: () => [...dashboardKeys.all, "recent-purchases"] as const,
  recentSales: () => [...dashboardKeys.all, "recent-sales"] as const,
} as const;
