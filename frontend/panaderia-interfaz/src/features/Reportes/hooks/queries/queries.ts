import { useQuery } from "@tanstack/react-query";
import {
  fetchMateriaPrimaReport,
  fetchProductosFinalesReport,
  fetchProductosIntermediosReport,
  fetchProductosReventaReport,
  fetchSalesSessions,
  fetchSessionDetail,
  fetchItemsVendidos,
} from "../../api/api";

// Inventory Report Hooks
export const useMateriaPrimaReportQuery = () => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'materias-primas'],
    queryFn: fetchMateriaPrimaReport,
  });
};

export const useProductosFinalesReportQuery = () => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'productos-finales'],
    queryFn: fetchProductosFinalesReport,
  });
};

export const useProductosIntermediosReportQuery = () => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'productos-intermedios'],
    queryFn: fetchProductosIntermediosReport,
  });
};

export const useProductosReventaReportQuery = () => {
  return useQuery({
    queryKey: ['reportes', 'inventario', 'productos-reventa'],
    queryFn: fetchProductosReventaReport,
  });
};

// Sales Report Hooks
export const useSalesSessionsQuery = (params?: {
  start_date?: string;
  end_date?: string;
}) => {
  return useQuery({
    queryKey: ['reportes', 'ventas', 'sesiones', params],
    queryFn: () => fetchSalesSessions(params),
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
