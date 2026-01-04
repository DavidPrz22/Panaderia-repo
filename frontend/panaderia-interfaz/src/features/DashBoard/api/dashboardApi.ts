import apiClient from "@/api/client";
import * as schemas from "../types/schemas";
import type * as types from "../types";

const BASE_URL = "/api/dashboard";

export const getSalesToday = async (): Promise<types.SalesToday | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/sales-today/`);
    return schemas.SalesTodaySchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener ventas del día", error);
    throw error;
  }
};

export const getPendingOrders = async (): Promise<types.PendingOrders | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/pending-orders/`);
    return schemas.PendingOrdersSchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener pedidos pendientes", error);
    throw error;
  }
};

export const getStockAlerts = async (): Promise<types.StockAlerts | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/stock-alerts/`);
    return schemas.StockAlertsSchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener alertas de stock", error);
    throw error;
  }
};

export const getRecentProductions = async (): Promise<types.RecentProductions | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/recent-productions/`);
    return schemas.RecentProductionsSchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener producción reciente", error);
    throw error;
  }
};

export const getSalesTrends = async (): Promise<types.SalesTrendData | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/sales-trends/`);
    return schemas.SalesTrendDataSchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener tendencias de ventas", error);
    throw error;
  }
};

export const getTopProducts = async (): Promise<types.TopProductsData | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/top-products/`);
    return schemas.TopProductsDataSchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener productos más vendidos", error);
    throw error;
  }
};

export const getRecentPurchases = async (): Promise<types.RecentPurchases | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/recent-purchases/`);
    return schemas.RecentPurchasesSchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener compras recientes", error);
    throw error;
  }
};

export const getRecentSales = async (): Promise<types.RecentSales | undefined> => {
  try {
    const response = await apiClient.get(`${BASE_URL}/recent-sales/`);
    return schemas.RecentSalesSchema.parse(response.data);
  } catch (error) {
    console.error("Error al obtener ventas recientes", error);
    throw error;
  }
};
