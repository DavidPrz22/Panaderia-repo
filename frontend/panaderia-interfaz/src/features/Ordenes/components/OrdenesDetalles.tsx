import type { Orden } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrdenesEstadoBadge } from "./OrdenesEstadoBadge";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, XCircle, Banknote } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderDetailsProps {
  orden: Orden;
  onClose: () => void;
}

import { toast } from "sonner";
import type { Estados } from "../types/types";
import { ReferenciaPagoDialog } from "./ReferenciaPagoDialog";
import { CancelOrderDialog } from "./CancelOrderDialog";
import { useOrdenesContext } from "@/context/OrdenesContext";
import { useCancelOrdenMutation } from "../hooks/mutations/mutations";
import { useState } from "react";

import { useRegisterPaymentReferenceMutation, useUpdateOrdenStatusMutation } from "../hooks/mutations/mutations";

export const OrdenDetalles = ({ orden, onClose }: OrderDetailsProps) => {

  const { showReferenciaPagoDialog, setShowReferenciaPagoDialog, showCancelDialog, setShowCancelDialog } = useOrdenesContext();

  const [estadoPendiente, setEstadoPendiente] = useState<Estados>(orden.estado_orden.nombre_estado as Estados);

  const { mutateAsync: updateOrdenStatusMutation, isPending: isLoadingUpdateOrdenStatusMutation} = useUpdateOrdenStatusMutation();

  const { mutateAsync: registerPaymentReferenceMutation} = useRegisterPaymentReferenceMutation();

  const { mutateAsync: cancelOrdenMutation, isPending: isLoadingCancelOrdenMutation} = useCancelOrdenMutation();
 
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleStatusChange = async (newStatus: Estados) => {
    // Si se está confirmando y el método de pago requiere referencia
    if (
      newStatus === "Completado" &&
      ((orden.metodo_pago.nombre_metodo === "Tarjeta" || orden.metodo_pago.nombre_metodo === "Transferencia" || orden.metodo_pago.nombre_metodo === "Pago Movíl") && !orden.referencia_pago)
    ) {
      setShowReferenciaPagoDialog(true);
    } else {
      setEstadoPendiente(newStatus);
      await updateOrdenStatusMutation({ id: orden.id, estado: newStatus });
      toast.success(`Orden marcada como ${newStatus}`);
    }
  };

  const getStatusActions = () => {
    switch (estadoPendiente) {  
      case "Pendiente":
        return (
          <Button disabled={isLoadingUpdateOrdenStatusMutation} onClick={() => handleStatusChange("En Proceso")} className="gap-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            <CheckCircle className="h-4 w-4" />
            Marcar como En Proceso
          </Button>
        );
      case "En Proceso":

      if ((orden.metodo_pago.nombre_metodo === "Tarjeta" || orden.metodo_pago.nombre_metodo === "Transferencia" || orden.metodo_pago.nombre_metodo === "Pago Movíl") && !orden.referencia_pago) {
        return (
          <Button disabled={isLoadingUpdateOrdenStatusMutation} onClick={() => handleStatusChange("Completado")} className="gap-2 bg-green-600 text-white hover:bg-green-700 cursor-pointer">
            <Banknote className="h-4 w-4" />
            Proveer Referencia de Pago
          </Button>
        );
      } else {
        return (
          <Button disabled={isLoadingUpdateOrdenStatusMutation} onClick={() => handleStatusChange("Completado")} className="gap-2 bg-green-600 text-white hover:bg-green-700 cursor-pointer">
            <CheckCircle className="h-4 w-4" />
            Marcar como Completado
          </Button>
        );
      }
      default:
        return null;
    }
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

  const handleReferenciaPagoConfirm = async (ordenId: number, referenciaPago: string) => {
    try {
      await registerPaymentReferenceMutation({ id: ordenId, referencia_pago: referenciaPago });
      toast.success(`Referencia de pago registrada correctamente`);
      setShowReferenciaPagoDialog(false)
    } catch (error) {
      console.error("Error registering payment reference:", error);
      toast.error(`Error registrando referencia de pago`);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrdenMutation(orden.id);
      toast.success(`Orden cancelada correctamente`);
      setShowCancelDialog(false);
      setEstadoPendiente("Cancelado");
    } catch (error) {
      console.error("Error canceling orden:", error);
      toast.error(`Error cancelando orden`);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b sticky top-0 bg-card z-10">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl font-bold">{orden.id}</CardTitle>
              <OrdenesEstadoBadge estadoOrden={estadoPendiente as Estados} />
            </div>
            <div className="flex items-center gap-2">
              {getStatusActions()}

              {orden.estado_orden.nombre_estado !== "Completado" && orden.estado_orden.nombre_estado !== "Cancelado" && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowCancelDialog(true);
                  }}
                  className="gap-2 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                >
                  <XCircle className="h-4 w-4" />
                  Cancelar Orden
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{orden.cliente.nombre_cliente}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Orden</p>
                <p className="font-medium">{formatDate(orden.fecha_creacion_orden)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método de Pago</p>
                <p className="font-medium">{orden.metodo_pago.nombre_metodo}</p>
              </div>
              {orden.referencia_pago && (
                <div>
                  <p className="text-sm text-muted-foreground">Referencia de Pago</p>
                  <p className="font-medium">{orden.referencia_pago}</p>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Datos del Cliente</h3>
              <div className="grid grid-cols-2 gap-4">
                {orden.cliente.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm">{orden.cliente.email}</p>
                  </div>
                )}
                {orden.cliente.telefono && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="text-sm">{orden.cliente.telefono}</p>
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
                    <TableRow className="bg-gray-50 hover:bg-table-header">
                      <TableHead className="font-semibold">Producto</TableHead>
                      <TableHead className="font-semibold text-center">Cantidad Solicitada</TableHead>
                      <TableHead className="font-semibold text-center">Unidad de Medida</TableHead>
                      <TableHead className="font-semibold text-right">Precio Unitario</TableHead>
                      <TableHead className="font-semibold text-center">Impuesto</TableHead>
                      <TableHead className="font-semibold text-center">Descuento</TableHead>
                      <TableHead className="font-semibold text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orden.productos.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.producto.nombre_producto}</TableCell>
                        <TableCell className="text-center">{item.cantidad_solicitada}</TableCell>
                        <TableCell className="text-center">{item.unidad_medida.abreviatura}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.precio_unitario_usd)}</TableCell>
                        <TableCell className="text-center">{item.impuesto_porcentaje}%</TableCell>
                        <TableCell className="text-center">{item.descuento_porcentaje}%</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.subtotal_linea_usd)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 flex justify-end gap-6">

              <div className="space-y-2 w-64">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasa de Cambio:</span>
                  <span className="font-medium">{orden.tasa_cambio_aplicada}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold">Total en VES:</span>
                  <span className="font-medium">{orden.monto_total_ves}</span>
                </div>
              </div>

              <div className="space-y-2 w-64">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos:</span>
                  <span className="font-medium">{formatCurrency(orden.monto_impuestos_usd)}</span>
                </div>
                {orden.monto_descuento_usd > 0 && (
                  <div className="flex justify-between text-sm ">
                    <span>Descuento:</span>
                    <span>{formatCurrency(orden.monto_descuento_usd)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(orden.monto_total_usd)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {orden.notas_generales && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notas</h3>
                <p className="text-sm text-muted-foreground">{orden.notas_generales}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ReferenciaPagoDialog
        open={showReferenciaPagoDialog}
        onClose={() => {
          setShowReferenciaPagoDialog(false);
        }}
        onConfirm={handleReferenciaPagoConfirm}
        paymentMethod={orden.metodo_pago}
      />
      
      <CancelOrderDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelOrder}
        orderId={orden.id}
        isLoadingCancelOrdenMutation={isLoadingCancelOrdenMutation}
      />
    </>
  );
};
