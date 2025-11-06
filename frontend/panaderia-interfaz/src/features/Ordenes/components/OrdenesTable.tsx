import type { Estados, OrdenTable } from "../types/types";
import { OrdenesEstadoBadge } from "./OrdenesEstadoBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useOrdenesContext } from "@/context/OrdenesContext";

interface OrdersTableProps {
  orders: OrdenTable[];
  onEditOrder: (order: OrdenTable) => void;
}
import { useGetOrdenesDetalles } from "../hooks/queries/queries";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner";

export const OrdersTable = ({ orders, onEditOrder }: OrdersTableProps) => {
  const { ordenSeleccionadaId, setOrdenSeleccionadaId } = useOrdenesContext();

  const { isFetching: isFetchingOrdenDetalles } = useGetOrdenesDetalles(
    ordenSeleccionadaId!,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const handleOrdenSeleccionada = (id: number) => {
    setOrdenSeleccionadaId(id);
  };

  return (
    <div className="border rounded-lg bg-card shadow-sm relative">
      {isFetchingOrdenDetalles && (
        <PendingTubeSpinner
          size={20}
          extraClass="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-50 z-50"
        />
      )}
      <Table>
        <TableHeader className="bg-(--table-header-bg)">
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className="font-semibold">Número de Orden</TableHead>
            <TableHead className="font-semibold">Cliente</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Entrega</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Pago</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
            <TableHead className="font-semibold text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow
              key={order.id}
              className={`hover:bg-gray-100 cursor-pointer ${index % 2 !== 0 ? "bg-gray-50" : ""}`}
              onClick={() => handleOrdenSeleccionada(order.id)}
            >
              <TableCell className="font-medium pl-3">{order.id}</TableCell>
              <TableCell>{order.cliente}</TableCell>
              <TableCell>{formatDate(order.fecha_creacion_orden)}</TableCell>
              <TableCell>
                {order.fecha_entrega_solicitada
                  ? formatDate(order.fecha_entrega_solicitada)
                  : order.fecha_entrega_definitiva
                    ? formatDate(order.fecha_entrega_definitiva)
                    : "-"}
              </TableCell>
              <TableCell>
                <OrdenesEstadoBadge
                  estadoOrden={order.estado_orden as Estados}
                />
              </TableCell>
              <TableCell>{order.metodo_pago}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(order.total)}
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1 justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditOrder(order)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
