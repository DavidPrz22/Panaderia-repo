import { useQuery } from "@tanstack/react-query";
import {
  materiaPrimaReportQueryOptions,
  productosFinalesReportQueryOptions,
  productosIntermediosReportQueryOptions,
  productosReventaReportQueryOptions,
  inventorySummaryQueryOptions,
  salesSessionsQueryOptions,
  salesSummaryQueryOptions,
  sessionDetailQueryOptions,
  itemsVendidosQueryOptions,
} from "./ReportesQueryOptions";

// Inventory Report Hooks
export const useMateriaPrimaReportQuery = (enabled = true) => {
  return useQuery({
    ...materiaPrimaReportQueryOptions(),
    enabled,
  });
};

export const useProductosFinalesReportQuery = (enabled = true) => {
  return useQuery({
    ...productosFinalesReportQueryOptions(),
    enabled,
  });
};

export const useProductosIntermediosReportQuery = (enabled = true) => {
  return useQuery({
    ...productosIntermediosReportQueryOptions(),
    enabled,
  });
};

export const useProductosReventaReportQuery = (enabled = true) => {
  return useQuery({
    ...productosReventaReportQueryOptions(),
    enabled,
  });
};

export const useInventorySummaryQuery = () => {
  return useQuery(inventorySummaryQueryOptions());
};

// Sales Report Hooks
export const useSalesSessionsQuery = (params?: {
  start_date?: string;
  end_date?: string;
}, enabled = true) => {
  return useQuery({
    ...salesSessionsQueryOptions(params),
    enabled,
  });
};

export const useSalesSummaryQuery = () => {
  return useQuery(salesSummaryQueryOptions());
};

export const useSessionDetailQuery = (sessionId: number | null) => {
  return useQuery(sessionDetailQueryOptions(sessionId));
};

export const useItemsVendidosQuery = (sessionId: number | null) => {
  return useQuery(itemsVendidosQueryOptions(sessionId));
};
