import { useQuery } from "@tanstack/react-query";
import {
  fetchMateriaPrimaReport,
  fetchProductosFinalesReport,
  fetchProductosIntermediosReport,
  fetchProductosReventaReport,
  fetchSalesSessions,
  fetchSessionDetail,
  fetchItemsVendidos,
  fetchInventorySummary,
  fetchSalesSummary,
} from "../../api/api";

// Inventory Report Hooks
export const useMateriaPrimaReportQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'materias-primas'],
    queryFn: fetchMateriaPrimaReport,
    enabled,
  });
};

export const useProductosFinalesReportQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'productos-finales'],
    queryFn: fetchProductosFinalesReport,
    enabled,
  });
};

export const useProductosIntermediosReportQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'productos-intermedios'],
    queryFn: fetchProductosIntermediosReport,
    enabled,
  });
};

export const useProductosReventaReportQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'productos-reventa'],
    queryFn: fetchProductosReventaReport,
    enabled,
  });
};

export const useInventorySummaryQuery = () => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'resumen'],
    queryFn: fetchInventorySummary,
  });
};

// Sales Report Hooks
export const useSalesSessionsQuery = (params?: {
  start_date?: string;
  end_date?: string;
}, enabled = true) => {
  return useQuery({
    queryKey: ['reportes', 'ventas', 'sesiones', params],
    queryFn: () => fetchSalesSessions(params),
    enabled,
  });
};

export const useSalesSummaryQuery = () => {
  return useQuery({
    queryKey: ['reportes', 'ventas', 'resumen'],
    queryFn: fetchSalesSummary,
  });
};

export const useSessionDetailQuery = (sessionId: number | null) => {
  return useQuery({
    queryKey: ['reportes', 'ventas', 'detalle', sessionId],
    queryFn: () => fetchSessionDetail(sessionId!),
    enabled: sessionId !== null,
  });
};

export const useItemsVendidosQuery = (sessionId: number | null) => {
  return useQuery({
    queryKey: ['reportes', 'ventas', 'items-vendidos', sessionId],
    queryFn: () => fetchItemsVendidos(sessionId!),
    enabled: sessionId !== null,
  });
};
