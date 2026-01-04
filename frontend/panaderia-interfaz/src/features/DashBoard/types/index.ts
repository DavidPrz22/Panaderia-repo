import { z } from "zod";
import * as schemas from "./schemas";

// Infer types from schemas
export type SalesToday = z.infer<typeof schemas.SalesTodaySchema>;
export type PendingOrders = z.infer<typeof schemas.PendingOrdersSchema>;
export type StockAlerts = z.infer<typeof schemas.StockAlertsSchema>;
export type RecentProductions = z.infer<typeof schemas.RecentProductionsSchema>;
export type SalesTrendData = z.infer<typeof schemas.SalesTrendDataSchema>;
export type TopProductsData = z.infer<typeof schemas.TopProductsDataSchema>;
export type RecentPurchases = z.infer<typeof schemas.RecentPurchasesSchema>;
export type RecentSales = z.infer<typeof schemas.RecentSalesSchema>;

// Chart data types for Nivo
export type SalesTrendChartData = {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
};

export type TopProductsChartData = {
  product: string;
  quantity: number;
  type: "resale" | "final";
};

// Re-export existing notification-related types for convenience
export * from "./types";
