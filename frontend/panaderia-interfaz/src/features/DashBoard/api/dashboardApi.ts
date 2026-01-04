import apiClient from "@/api/client";
import * as schemas from "../types/schemas";
import type * as types from "../types";

const BASE_URL = "/api/dashboard";

const handleDashboardError = (error: unknown, message: string): never => {
  // Centralized logging for dashboard API errors
  // You can later hook this into a toast system or monitoring tool
  console.error(message, error);

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(message);
};

export const dashboardApi = {
  // Card endpoints
  async getSalesToday(): Promise<types.SalesToday> {
    try {
      const response = await apiClient.get(`${BASE_URL}/sales-today/`);
      return schemas.SalesTodaySchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener ventas del día");
    }
  },

  async getPendingOrders(): Promise<types.PendingOrders> {
    try {
      const response = await apiClient.get(`${BASE_URL}/pending-orders/`);
      return schemas.PendingOrdersSchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener pedidos pendientes");
    }
  },

  async getStockAlerts(): Promise<types.StockAlerts> {
    try {
      const response = await apiClient.get(`${BASE_URL}/stock-alerts/`);
      return schemas.StockAlertsSchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener alertas de stock");
    }
  },

  async getRecentProductions(): Promise<types.RecentProductions> {
    try {
      const response = await apiClient.get(`${BASE_URL}/recent-productions/`);
      return schemas.RecentProductionsSchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener producción reciente");
    }
  },

  // Grid section endpoints
  async getSalesTrends(): Promise<types.SalesTrendData> {
    try {
      const response = await apiClient.get(`${BASE_URL}/sales-trends/`);
      return schemas.SalesTrendDataSchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener tendencias de ventas");
    }
  },

  async getTopProducts(): Promise<types.TopProductsData> {
    try {
      const response = await apiClient.get(`${BASE_URL}/top-products/`);
      return schemas.TopProductsDataSchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener productos más vendidos");
    }
  },

  async getRecentPurchases(): Promise<types.RecentPurchases> {
    try {
      const response = await apiClient.get(`${BASE_URL}/recent-purchases/`);
      return schemas.RecentPurchasesSchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener compras recientes");
    }
  },

  async getRecentSales(): Promise<types.RecentSales> {
    try {
      const response = await apiClient.get(`${BASE_URL}/recent-sales/`);
      return schemas.RecentSalesSchema.parse(response.data);
    } catch (error) {
      handleDashboardError(error, "Error al obtener ventas recientes");
    }
  },
};
