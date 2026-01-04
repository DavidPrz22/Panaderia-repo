import { DashBoardCard } from "./DashBoardCard";
import {
  useSalesToday,
  usePendingOrders,
  useStockAlerts,
  useRecentProductions,
} from "../hooks/queries/queries";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "../utils/formatters";
import { CardSkeleton } from "./DashboardSkeleton";
import { DashboardError } from "./DashboardError";

export const DashBoardCards = () => {
  const salesToday = useSalesToday();
  const pendingOrders = usePendingOrders();
  const stockAlerts = useStockAlerts();
  const recentProductions = useRecentProductions();

  const isLoading =
    salesToday.isLoading ||
    pendingOrders.isLoading ||
    stockAlerts.isLoading ||
    recentProductions.isLoading;

  const isError =
    salesToday.isError ||
    pendingOrders.isError ||
    stockAlerts.isError ||
    recentProductions.isError;

  const handleRetry = () => {
    salesToday.refetch();
    pendingOrders.refetch();
    stockAlerts.refetch();
    recentProductions.refetch();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    const firstError =
      (salesToday.error ||
        pendingOrders.error ||
        stockAlerts.error ||
        recentProductions.error) as Error | undefined;

    return (
      <DashboardError
        title="Error al cargar tarjetas del dashboard"
        message={firstError?.message}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Sales Card */}
      {salesToday.data && (
        <DashBoardCard
          type="Ventas"
          value={formatCurrency(salesToday.data.total_sales)}
          smallText={`${salesToday.data.total_transactions} transacciones`}
          boldedText={`${salesToday.data.total_items_sold} items vendidos`}
        />
      )}

      {/* Pending Orders Card */}
      {pendingOrders.data && (
        <DashBoardCard
          type="Pedidos Pendientes"
          value={formatNumber(pendingOrders.data.total_pending)}
          smallText={`${pendingOrders.data.due_today} para hoy`}
          boldedText={`${pendingOrders.data.approaching_deadline} próximos a entregar`}
        />
      )}

      {/* Stock Alerts Card */}
      {stockAlerts.data && (
        <DashBoardCard
          type="Alertas"
          value={formatNumber(stockAlerts.data.total_alerts)}
          smallText={`${stockAlerts.data.under_reorder_point} bajo mínimo, ${stockAlerts.data.expired} vencidos`}
          boldedText={`${stockAlerts.data.critical_count} críticas`}
        />
      )}

      {/* Recent Productions Card */}
      {recentProductions.data && (
        <DashBoardCard
          type="Producción"
          value={formatNumber(recentProductions.data.total_productions)}
          smallText="últimas 24 horas"
          boldedText={
            recentProductions.data.percentage_vs_previous !== undefined &&
            recentProductions.data.percentage_vs_previous !== null
              ? `${formatPercentage(
                  recentProductions.data.percentage_vs_previous,
                )} vs periodo anterior`
              : "Sin comparación"
          }
        />
      )}
    </div>
  );
};
