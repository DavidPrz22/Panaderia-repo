import type { DetalleOC, OrdenCompra } from "../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComprasEstadoBadge } from "./ComprasEstadoBadge";
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

interface ComprasDetallesProps {
  ordenCompra: OrdenCompra;
  onClose: () => void;
}
import type { EstadosOC } from "../types/types";


export const ComprasDetalles = ({ ordenCompra, onClose }: ComprasDetallesProps) => {

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
;

//   const handleCancelOrder = async () => {
//     try {
//       const response = await cancelOrdenMutation(orden.id);
//       toast.success(response.message);
//       if (response.warning) {
//         const lotes_expirados = response.lotes_expirados ? response.lotes_expirados.map((lote : {lote_expirado: number, producto: string, fecha_caducidad: string}) => `Lote expirado id: ${lote.lote_expirado} \n Para el producto: ${lote.producto} \n Con fecha de caducidad: ${lote.fecha_caducidad}`) : [];
//         toast.warning(response.warning + "\n" + lotes_expirados.join("\n"), {
//           duration: 5000,
//         });
//       }
//       setShowCancelDialog(false);
//       setEstadoPendiente("Cancelado");
//     } catch (error) {
//       console.error("Error canceling order:", error);
//       toast.error("Error cancelando orden");
//     }
//   };


  return (
    <>
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-6xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b sticky top-0 bg-card z-10">
            <div className="flex items-center gap-3">
              <CardTitle className="text-2xl font-bold">{ordenCompra.id}</CardTitle>
              <ComprasEstadoBadge estadoCompras={ordenCompra.estado_oc ? ordenCompra.estado_oc.nombre_estado as EstadosOC : 'Borrador'} />
            </div>
            <div className="flex items-center gap-2">
              
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Proveedor</p>
                <p className="font-medium">{ordenCompra.proveedor.nombre_proveedor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Orden</p>
                <p className="font-medium">{formatDate(ordenCompra.fecha_emision_oc)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Método de Pago</p>
                <p className="font-medium">{ordenCompra.metodo_pago.nombre_metodo}</p>
              </div>
              {ordenCompra.direccion_envio && (
                <div>
                  <p className="text-sm text-muted-foreground">Dirección de Envío</p>
                  <p className="font-medium">{ordenCompra.direccion_envio}</p>
                </div>
              )}
              {ordenCompra.terminos_pago && (
                <div>
                  <p className="text-sm text-muted-foreground">Términos de Pago</p>
                  <p className="font-medium">{ordenCompra.terminos_pago}</p>
                </div>
              )}
            </div>

            {/* Customer Details */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Datos del Cliente</h3>
              <div className="grid grid-cols-2 gap-4">
                {ordenCompra.proveedor.email_contacto && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm">{ordenCompra.proveedor.email_contacto}</p>
                  </div>
                )}
                {ordenCompra.proveedor.telefono_contacto && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="text-sm">{ordenCompra.proveedor.telefono_contacto}</p>
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
                    {ordenCompra.detalles.map((item: DetalleOC, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.producto_reventa_nombre || item.materia_prima_nombre}</TableCell>
                        <TableCell className="text-center">{item.cantidad_solicitada}</TableCell>
                        <TableCell className="text-center">{item.unidad_medida_abrev}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.costo_unitario_usd)}</TableCell>
                        <TableCell className="text-center">{item.porcentaje_impuesto}%</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.impuesto_linea_usd)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.subtotal_linea_usd)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.subtotal_linea_usd + item.impuesto_linea_usd)}</TableCell>
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
                  <span className="font-medium">{ordenCompra.tasa_cambio_aplicada}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold">Total en VES:</span>
                  <span className="font-medium">{ordenCompra.monto_total_oc_ves}</span>
                </div>
              </div>

              <div className="space-y-2 w-64">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impuestos:</span>
                  <span className="font-medium">{formatCurrency(ordenCompra.monto_impuestos_oc_usd)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{formatCurrency(ordenCompra.monto_total_oc_usd)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {ordenCompra.notas && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Notas</h3>
                <p className="text-sm text-muted-foreground">{ordenCompra.notas}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      
      
      {/* <CancelOrderDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelOrder}
        orderId={orden.id}
        isLoadingCancelOrdenMutation={isLoadingCancelOrdenMutation}
      /> */}
    </>
  );
};
