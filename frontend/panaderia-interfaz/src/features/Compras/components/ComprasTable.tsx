import type { EstadosOC, OrdenCompraTable } from "../types/types";
import { ComprasEstadoBadge } from "./ComprasEstadoBadge";
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
import { DeleteOrdenCompraDialog } from "./DeleteOrdenCompraDialog";
import { useDeleteOrdenCompraMutation } from "../hooks/mutations/mutations";
import { toast } from "sonner";

interface ComprasTableProps {
  ordenesCompra: OrdenCompraTable[];
  onEditOrder: (order: OrdenCompraTable) => void;
}

import { PendingTubeSpinner } from "@/components/PendingTubeSpinner";
import { useComprasContext } from "@/context/ComprasContext";
import { useGetOrdenesCompraDetalles } from "../hooks/queries/queries";

export const ComprasTable = ({
  ordenesCompra,
  onEditOrder,
}: ComprasTableProps) => {
  const { compraSeleccionadaId, setCompraSeleccionadaId } = useComprasContext();

  const { isFetching: isFetchingOrdenDetalles } = useGetOrdenesCompraDetalles(
    compraSeleccionadaId!,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ordenToDelete, setOrdenToDelete] = useState<number | null>(null);

  const {
    mutateAsync: deleteOrdenCompraMutation,
    isPending: isDeletingOrdenCompra,
  } = useDeleteOrdenCompraMutation();

  const handleDeleteClick = (ordenId: number) => {
    setOrdenToDelete(ordenId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (ordenToDelete === null) return;

    try {
      await deleteOrdenCompraMutation(ordenToDelete);
      toast.success("Orden de compra eliminada exitosamente");
      setDeleteDialogOpen(false);
      setOrdenToDelete(null);
      if (compraSeleccionadaId === ordenToDelete) {
        setCompraSeleccionadaId(null);
      }
    } catch (error) {
      toast.error(
        `Error al eliminar la orden de compra: ${error instanceof Error ? error.message : "Unknown error"}`,
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
    setCompraSeleccionadaId(id);
  };

  const sortedOrdenesCompra = ordenesCompra.sort((a, b) => {
    return b.id - a.id;
  });

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
            <TableHead className="font-semibold">Proveedor</TableHead>
            <TableHead className="font-semibold">Fecha Emision</TableHead>
            <TableHead className="font-semibold">Fecha Entrega</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold">Pago</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
            <TableHead className="font-semibold text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrdenesCompra.length > 0 ? (
            sortedOrdenesCompra.map((ordenCompra, index) => (
              <TableRow
                key={ordenCompra.id}
                className={`hover:bg-gray-100 cursor-pointer ${index % 2 !== 0 ? "bg-gray-50" : ""}`}
                onClick={() => handleOrdenSeleccionada(ordenCompra.id)}
              >
                <TableCell className="font-medium pl-3">
                  {ordenCompra.id}
                </TableCell>
                <TableCell>{ordenCompra.proveedor}</TableCell>
                <TableCell>
                  {formatDate(ordenCompra.fecha_emision_oc)}
                </TableCell>
                <TableCell>
                  {ordenCompra.fecha_entrega_real
                    ? formatDate(ordenCompra.fecha_entrega_real)
                    : ordenCompra.fecha_entrega_esperada
                      ? formatDate(ordenCompra.fecha_entrega_esperada)
                      : "-"}
                </TableCell>
                <TableCell>
                  <ComprasEstadoBadge
                    estadoCompras={ordenCompra.estado_oc as EstadosOC}
                  />
                </TableCell>
                <TableCell>{ordenCompra.metodo_pago}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(ordenCompra.monto_total_oc_usd)}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-1 justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditOrder(ordenCompra)}
                      className="hover:bg-gray-400 "
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(ordenCompra.id)}
                      className="hover:bg-red-100 text-red-600 hover:text-red-700"
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-lg font-semibold p-10"
              >
                No hay ordenes de compra
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteOrdenCompraDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        ordenCompraId={ordenToDelete ?? 0}
        isLoading={isDeletingOrdenCompra}
      />
    </div>
  );
};
