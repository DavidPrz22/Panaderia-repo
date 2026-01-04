import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRecentPurchases } from "../hooks/queries/queries";
import { TableSkeleton } from "./DashboardSkeleton";
import { DashboardError } from "./DashboardError";
import { formatCurrency, formatDate } from "../utils/formatters";

export const GridItemCompras = () => {
  const { data, isLoading, isError, error, refetch } = useRecentPurchases();

  if (isLoading) {
    return (
      <div className="lg:col-start-1 lg:col-end-6 h-full min-h-[300px]">
        <TableSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="bg-white lg:col-start-1 lg:col-end-6 h-full min-h-[300px] shadow-sm border-gray-200">
        <DashboardError
          title="Error al cargar compras recientes"
          message={error instanceof Error ? error.message : undefined}
          onRetry={refetch}
        />
      </Card>
    );
  }

  const rows = data.data;

  const getStatusBadge = (status: string) => {
    let styles = "bg-gray-100 text-gray-700 border border-gray-200";
    const s = status.toLowerCase();

    // Check for roots to handle gender differences (recibido/recibida, enviado/enviada)
    if (s.includes("recibid") || s.includes("completad") || s.includes("entregad")) {
      styles = "bg-emerald-100 text-emerald-700 border border-emerald-200";
    } else if (s.includes("pendiente")) {
      styles = "bg-amber-100 text-amber-700 border border-amber-200";
    } else if (s.includes("cancelad") || s.includes("rechazad")) {
      styles = "bg-rose-100 text-rose-700 border border-rose-200";
    } else if (s.includes("proceso") || s.includes("curso")) {
      styles = "bg-blue-100 text-blue-700 border border-blue-200";
    } else if (s.includes("enviad") || s.includes("transito")) {
      styles = "bg-indigo-100 text-indigo-700 border border-indigo-200";
    } else if (s.includes("pagad")) {
      styles = "bg-green-100 text-green-700 border border-green-200";
    } else if (s.includes("verificacion") || s.includes("revision")) {
      styles = "bg-purple-100 text-purple-700 border border-purple-200";
    }

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <Card className="bg-white lg:col-start-1 lg:col-end-6 h-full shadow-sm border-gray-200 flex flex-col overflow-hidden">
      <div className="p-6 pb-2">
        <h2 className="text-lg font-bold text-slate-800">
          Compras Recientes
        </h2>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar px-2 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider pl-4">Orden #</TableHead>
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Proveedor</TableHead>
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Fecha</TableHead>
              <TableHead className="font-semibold text-slate-500 text-xs uppercase tracking-wider">Estado</TableHead>
              <TableHead className="text-right font-semibold text-slate-500 text-xs uppercase tracking-wider pr-4">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-0">
                <TableCell className="font-medium text-slate-700 pl-4">{row.order_number}</TableCell>
                <TableCell className="text-slate-600">{row.supplier_name}</TableCell>
                <TableCell className="text-slate-500 text-sm whitespace-nowrap">{formatDate(row.order_date)}</TableCell>
                <TableCell>{getStatusBadge(row.status)}</TableCell>
                <TableCell className="text-right font-medium text-slate-800 pr-4">
                  {formatCurrency(row.total_amount)}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                  No hay compras recientes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
