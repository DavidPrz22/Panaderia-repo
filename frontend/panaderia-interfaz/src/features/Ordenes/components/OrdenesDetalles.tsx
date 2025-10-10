import type { Order } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdenesEstadoBadge } from "./OrdenesEstadoBadge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

export const OrderDetails = ({ order, onClose }: OrderDetailsProps) => {
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">{order.orderNumber}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Orden</p>
              <p className="font-medium">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estado</p>
              <OrdenesEstadoBadge status={order.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Método de Pago</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Datos del Cliente</h3>
            <div className="grid grid-cols-2 gap-4">
              {order.customer.address && (
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="text-sm">{order.customer.address}</p>
                </div>
              )}
              {order.customer.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm">{order.customer.email}</p>
                </div>
              )}
              {order.customer.phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="text-sm">{order.customer.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Lines */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Líneas de Productos</h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-table-header hover:bg-table-header">
                    <TableHead className="font-semibold">Producto</TableHead>
                    <TableHead className="font-semibold">Descripción</TableHead>
                    <TableHead className="font-semibold text-center">Cantidad</TableHead>
                    <TableHead className="font-semibold text-center">Entregado</TableHead>
                    <TableHead className="font-semibold text-center">Facturado</TableHead>
                    <TableHead className="font-semibold">UdM</TableHead>
                    <TableHead className="font-semibold text-right">Precio</TableHead>
                    <TableHead className="font-semibold text-center">Impuesto</TableHead>
                    <TableHead className="font-semibold text-center">Desc%</TableHead>
                    <TableHead className="font-semibold text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.product.code}</TableCell>
                      <TableCell>{item.product.description || item.product.name}</TableCell>
                      <TableCell className="text-center">{item.quantity.toFixed(2)}</TableCell>
                      <TableCell className="text-center">
                        {item.quantityDelivered.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantityInvoiced.toFixed(2)}
                      </TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-center">{item.tax}%</TableCell>
                      <TableCell className="text-center">{item.discount}%</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 flex justify-end">
            <div className="space-y-2 w-64">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impuestos:</span>
                <span className="font-medium">{formatCurrency(order.taxAmount)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-destructive">
                  <span>Descuento:</span>
                  <span>-{formatCurrency(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Notas</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
