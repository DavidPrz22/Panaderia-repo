import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRecentSales } from "../hooks/queries/queries";
import { TableSkeleton } from "./DashboardSkeleton";
import { DashboardError } from "./DashboardError";
import { formatCurrency, formatDateTime } from "../utils/formatters";

export const GridItemVentas = () => {
  const { data, isLoading, isError, error, refetch } = useRecentSales();

  if (isLoading) {
    return (
      <div className="lg:col-start-6 lg:col-end-11 h-full min-h-[300px]">
        <TableSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="bg-white lg:col-start-6 lg:col-end-11 h-full min-h-[300px] shadow-sm border-gray-200">
        <DashboardError
          title="Error al cargar ventas recientes"
          message={error instanceof Error ? error.message : undefined}
          onRetry={refetch}
        />
      </Card>
    );
  }

  const rows = data.data;

  const getPaymentBadge = (method: string) => {
    let label = "Mixto";
    let styles = "bg-gray-100 text-gray-700";

    switch (method) {
      case "efectivo":
        label = "Efectivo";
        styles = "bg-emerald-100 text-emerald-700 border border-emerald-200";
        break;
      case "tarjeta":
        label = "Tarjeta";
        styles = "bg-violet-100 text-violet-700 border border-violet-200";
        break;
      case "transferencia":
        label = "Transferencia";
        styles = "bg-indigo-100 text-indigo-700 border border-indigo-200";
        break;
      case "pago_movil":
        label = "Pago móvil";
        styles = "bg-blue-100 text-blue-700 border border-blue-200";
        break;
      default:
        label = "Mixto";
        styles = "bg-amber-100 text-amber-700 border border-amber-200";
        break;
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles}`}>
        {label}
      </span>
    );
  };

  return (
    <Card className="bg-white lg:col-start-6 lg:col-end-11 h-full shadow-sm border-gray-200 flex flex-col overflow-hidden">
      <div className="p-6 pb-2">
        <h2 className="text-lg font-bold text-slate-800">
          Ventas Recientes
        </h2>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar px-2 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider pl-4">Venta #</TableHead>
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Cliente</TableHead>
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Fecha</TableHead>
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Método</TableHead>
              <TableHead className="text-right font-semibold text-slate-500 text-xs uppercase tracking-wider pr-4">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <TableCell className="font-medium text-slate-700 pl-4">{row.sale_number}</TableCell>
                <TableCell className="text-slate-600 truncate max-w-[120px]" title={row.customer_name ?? ""}>
                  {row.customer_name ?? <span className="text-slate-400 italic">Anónimo</span>}
                </TableCell>
                <TableCell className="text-slate-500 text-sm whitespace-nowrap">{formatDateTime(row.sale_datetime)}</TableCell>
                <TableCell>{getPaymentBadge(row.payment_method)}</TableCell>
                <TableCell className="text-right font-medium text-slate-800 pr-4">
                  {formatCurrency(row.total_amount)}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                  No hay ventas recientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
