import apiClient from '@/api/client';
import { isAxiosError } from 'axios';
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
  try {
    const response = await apiClient.get('/api/reportes/inventario/materias-primas/');
    return inventoryReportSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching materia prima report:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar el reporte de materias primas");
    }
    throw error;
  }
};

export const fetchProductosFinalesReport = async (): Promise<InventoryReport> => {
  try {
    const response = await apiClient.get('/api/reportes/inventario/productos-finales/');
    return inventoryReportSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching productos finales report:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar el reporte de productos finales");
    }
    throw error;
  }
};

export const fetchProductosIntermediosReport = async (): Promise<InventoryReport> => {
  try {
    const response = await apiClient.get('/api/reportes/inventario/productos-intermedios/');
    return inventoryReportSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching productos intermedios report:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar el reporte de productos intermedios");
    }
    throw error;
  }
};

export const fetchProductosReventaReport = async (): Promise<InventoryReport> => {
  try {
    const response = await apiClient.get('/api/reportes/inventario/productos-reventa/');
    return inventoryReportSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching productos reventa report:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar el reporte de productos de reventa");
    }
    throw error;
  }
};

export const fetchInventorySummary = async (): Promise<InventorySummary> => {
  try {
    const response = await apiClient.get('/api/reportes/inventario/resumen/');
    return inventorySummarySchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar el resumen de inventario");
    }
    throw error;
  }
};

// Sales Reports
export const fetchSalesSessions = async (params?: {
  start_date?: string;
  end_date?: string;
}): Promise<SalesReport> => {
  try {
    const response = await apiClient.get('/api/reportes/ventas/sesiones/', { params });
    return salesReportSchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching sales sessions:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar las sesiones de ventas");
    }
    throw error;
  }
};

export const fetchSalesSummary = async (): Promise<SalesSummary> => {
  try {
    const response = await apiClient.get('/api/reportes/ventas/resumen/');
    return salesSummarySchema.parse(response.data);
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar el resumen de ventas");
    }
    throw error;
  }
};

export const fetchSessionDetail = async (sessionId: number): Promise<SessionDetail> => {
  try {
    const response = await apiClient.get(`/api/reportes/ventas/${sessionId}/detalle/`);
    return sessionDetailSchema.parse(response.data);
  } catch (error) {
    console.error(`Error fetching session detail for ID ${sessionId}:`, error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar el detalle de la sesión");
    }
    throw error;
  }
};

export const fetchItemsVendidos = async (sessionId: number): Promise<ItemsVendidos> => {
  try {
    const response = await apiClient.get(`/api/reportes/ventas/${sessionId}/items-vendidos/`);
    return itemsVendidosSchema.parse(response.data);
  } catch (error) {
    console.error(`Error fetching items vendidos for ID ${sessionId}:`, error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Error al cargar los artículos vendidos");
    }
    throw error;
  }
};

// PDF Download
export const downloadSalesReportPDF = async (params?: {
  start_date?: string;
  end_date?: string;
}): Promise<Blob> => {
  try {
    const response = await apiClient.get('/api/reportes/ventas/pdf/', {
      params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error("Error downloading sales report PDF:", error);
    if (isAxiosError(error)) {
      throw new Error("Error al descargar el PDF del reporte de ventas");
    }
    throw error;
  }
};

export const downloadInventoryReportPDF = async (type: string): Promise<Blob> => {
  try {
    const response = await apiClient.get('/api/reportes/inventario/pdf/', {
      params: { type },
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading inventory report PDF (${type}):`, error);
    if (isAxiosError(error)) {
      throw new Error(`Error al descargar el PDF del reporte de ${type}`);
    }
    throw error;
  }
};