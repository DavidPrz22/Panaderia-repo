import type { Order } from "../types/types";
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
import { Eye, Pencil, MoreVertical, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onStatusChange?: (order: Order, newStatus: any) => void;
}

export const OrdersTable = ({ orders, onViewOrder, onEditOrder, onStatusChange }: OrdersTableProps) => {
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

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
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
            <TableHead className="font-semibold text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-table-rowHover">
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>{formatDate(order.orderDate)}</TableCell>
              <TableCell>
                {order.confirmedDeliveryDate
                  ? formatDate(order.confirmedDeliveryDate)
                  : order.requestedDeliveryDate
                  ? formatDate(order.requestedDeliveryDate)
                  : "-"}
              </TableCell>
              <TableCell>
                <OrdenesEstadoBadge status={order.status} />
              </TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(order.total)}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewOrder(order)}
                    title="Ver detalles"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditOrder(order)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" title="Más acciones">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Cambiar Estado</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onStatusChange?.(order, "Pendiente")}
                        disabled={order.status === "Pendiente"}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Pendiente
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange?.(order, "Confirmado")}
                        disabled={order.status === "Confirmado"}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Confirmado
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange?.(order, "En Preparación")}
                        disabled={order.status === "En Preparación"}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        En Preparación
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange?.(order, "Listo para Entrega")}
                        disabled={order.status === "Listo para Entrega"}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Listo para Entrega
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange?.(order, "Entregado")}
                        disabled={order.status === "Entregado"}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Entregado
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onStatusChange?.(order, "Cancelado")}
                        disabled={order.status === "Cancelado"}
                        className="text-destructive"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Cancelado
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};