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
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteOrdenDialog } from "./DeleteOrdenDialog";
import { useDeleteOrdenMutation } from "../hooks/mutations/mutations";
import { toast } from "sonner";
import { useOrdenesContext } from "@/context/OrdenesContext";

import { useAuth } from "@/context/AuthContext";
import { userHasPermission } from "@/features/Authentication/lib/utils";

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

  const { user } = useAuth();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ordenToDelete, setOrdenToDelete] = useState<number | null>(null);

  const { mutateAsync: deleteOrdenMutation, isPending: isDeletingOrden } =
    useDeleteOrdenMutation();

  const handleDeleteClick = (ordenId: number) => {
    setOrdenToDelete(ordenId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (ordenToDelete === null) return;

    try {
      await deleteOrdenMutation(ordenToDelete);

      toast.success("Orden eliminada exitosamente");
      setDeleteDialogOpen(false);
      setOrdenToDelete(null);
      if (ordenSeleccionadaId === ordenToDelete) {
        setOrdenSeleccionadaId(null);
      }
    } catch (error) {
      toast.error(
        `Error al eliminar la orden: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

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

  orders.sort((a, b) => b.id - a.id);

  const canAccessActions = userHasPermission(user!, 'edit', 'ordenes_venta') && userHasPermission(user!, 'delete', 'ordenes_venta')

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
            <TableHead className="font-semibold text-right pr-4">Total</TableHead>
            {canAccessActions && (
              <TableHead className="font-semibold text-center"></TableHead>
            )}
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
              <TableCell className="text-right font-medium pr-4">
                {formatCurrency(order.total)}
              </TableCell>
              { canAccessActions && (
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
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(order.id)}
                      className="hover:bg-red-100 text-red-600 hover:text-red-700"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteOrdenDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        ordenId={ordenToDelete ?? 0}
        isLoading={isDeletingOrden}
      />
    </div>
  );
};
