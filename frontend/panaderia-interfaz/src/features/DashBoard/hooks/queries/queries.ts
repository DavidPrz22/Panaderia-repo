import { useQuery } from "@tanstack/react-query";
import { dashBoardDataOptions, DBNotificationOptions } from "./queryOptions";
import { useDashBoardContext } from "@/context/DashBoardContext";
import { dashboardApi } from "@/features/DashBoard/api/dashboardApi";
import { dashboardKeys } from "./queryKeys";

// Existing dashboard data & notifications hooks
export const useDashBoardData = () => {
  return useQuery(dashBoardDataOptions);
};

export const useDBNotification = () => {
  const { showNotificaciones } = useDashBoardContext();
  return useQuery({ ...DBNotificationOptions, enabled: showNotificaciones });
};

// New dashboard metric hooks
export const useSalesToday = () => {
  return useQuery({
    queryKey: dashboardKeys.salesToday(),
    queryFn: () => dashboardApi.getSalesToday(),
    staleTime: Infinity,
  });
};

export const usePendingOrders = () => {
  return useQuery({
    queryKey: dashboardKeys.pendingOrders(),
    queryFn: () => dashboardApi.getPendingOrders(),
    staleTime: Infinity,
  });
};

export const useStockAlerts = () => {
  return useQuery({
    queryKey: dashboardKeys.stockAlerts(),
    queryFn: () => dashboardApi.getStockAlerts(),
    staleTime: Infinity,
  });
};

export const useRecentProductions = () => {
  return useQuery({
    queryKey: dashboardKeys.recentProductions(),
    queryFn: () => dashboardApi.getRecentProductions(),
    staleTime: Infinity,
  });
};

export const useSalesTrends = () => {
  return useQuery({
    queryKey: dashboardKeys.salesTrends(),
    queryFn: () => dashboardApi.getSalesTrends(),
    staleTime: Infinity,
  });
};

export const useTopProducts = () => {
  return useQuery({
    queryKey: dashboardKeys.topProducts(),
    queryFn: () => dashboardApi.getTopProducts(),
    staleTime: Infinity,
  });
};

export const useRecentPurchases = () => {
  return useQuery({
    queryKey: dashboardKeys.recentPurchases(),
    queryFn: () => dashboardApi.getRecentPurchases(),
    staleTime: Infinity,
  });
};

export const useRecentSales = () => {
  return useQuery({
    queryKey: dashboardKeys.recentSales(),
    queryFn: () => dashboardApi.getRecentSales(),
    staleTime: Infinity,
  });
};
