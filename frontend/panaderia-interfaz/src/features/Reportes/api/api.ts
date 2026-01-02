import apiClient from '@/api/client';
import {
  inventoryReportSchema,
  salesReportSchema,
  sessionDetailSchema,
  itemsVendidosSchema,
  type InventoryReport,
  type SalesReport,
  type SessionDetail,
  type ItemsVendidos,
  type InventorySummary,
  type SalesSummary,
  inventorySummarySchema,
  salesSummarySchema,
} from '../schemas/schemas';

// Inventory Reports
export const fetchMateriaPrimaReport = async (): Promise<InventoryReport> => {
  const response = await apiClient.get('/api/reportes/inventario/materias-primas/');
  return inventoryReportSchema.parse(response.data);
};

export const fetchProductosFinalesReport = async (): Promise<InventoryReport> => {
  const response = await apiClient.get('/api/reportes/inventario/productos-finales/');
  return inventoryReportSchema.parse(response.data);
};

export const fetchProductosIntermediosReport = async (): Promise<InventoryReport> => {
  const response = await apiClient.get('/api/reportes/inventario/productos-intermedios/');
  return inventoryReportSchema.parse(response.data);
};

export const fetchProductosReventaReport = async (): Promise<InventoryReport> => {
  const response = await apiClient.get('/api/reportes/inventario/productos-reventa/');
  return inventoryReportSchema.parse(response.data);
};

export const fetchInventorySummary = async (): Promise<InventorySummary> => {
  const response = await apiClient.get('/api/reportes/inventario/resumen/');
  return inventorySummarySchema.parse(response.data);
};

// Sales Reports
export const fetchSalesSessions = async (params?: {
  start_date?: string;
  end_date?: string;
}): Promise<SalesReport> => {
  const response = await apiClient.get('/api/reportes/ventas/sesiones/', { params });
  return salesReportSchema.parse(response.data);
};

export const fetchSalesSummary = async (): Promise<SalesSummary> => {
  const response = await apiClient.get('/api/reportes/ventas/resumen/');
  return salesSummarySchema.parse(response.data);
};

export const fetchSessionDetail = async (sessionId: number): Promise<SessionDetail> => {
  const response = await apiClient.get(`/api/reportes/ventas/${sessionId}/detalle/`);
  return sessionDetailSchema.parse(response.data);
};

export const fetchItemsVendidos = async (sessionId: number): Promise<ItemsVendidos> => {
  const response = await apiClient.get(`/api/reportes/ventas/${sessionId}/items-vendidos/`);
  return itemsVendidosSchema.parse(response.data);
};

// PDF Download
export const downloadSalesReportPDF = async (params?: {
  start_date?: string;
  end_date?: string;
}): Promise<Blob> => {
  const response = await apiClient.get('/api/reportes/ventas/pdf/', {
    params,
    responseType: 'blob',
  });
  return response.data;
};