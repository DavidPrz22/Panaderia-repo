import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SessionDetail } from "../../types/types";

interface SessionDetailsProps {
    sessionDetail: SessionDetail | undefined;
    isLoading: boolean;
}

export const SessionDetails = ({ sessionDetail, isLoading }: SessionDetailsProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!sessionDetail) {
        return null;
    }

    const efectivoEnCaja = (sessionDetail.monto_inicial_ves || 0) +
        (sessionDetail.total_efectivo_ves || 0) -
        (sessionDetail.total_cambio_efectivo_ves || 0);

    return (
        <div className="space-y-6">
            {/* Session Header */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    Sesión #{sessionDetail.id}
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-muted-foreground">Cajero:</span>
                        <p className="font-medium">{sessionDetail.cajero_nombre}</p>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Estado:</span>
                        <p className="font-medium">
                            {sessionDetail.esta_activa ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                                    Activa
                                </Badge>
                            ) : (
                                <Badge variant="outline">Cerrada</Badge>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <hr className="my-4 border-t" />

            {/* Tabs */}
            <Tabs defaultValue="totales" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="totales">Resumen de Totales</TabsTrigger>
                    <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
                    <TabsTrigger value="items">Artículos Vendidos</TabsTrigger>
                </TabsList>

                <TabsContent value="totales" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Monto Inicial (General)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Bs. {sessionDetail.monto_inicial_ves?.toFixed(2) || '0.00'}</div>
                                <p className="text-xs text-muted-foreground mt-1">Base de caja</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Monto Final (General)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Bs. {sessionDetail.monto_final_ves?.toFixed(2) || '0.00'}</div>
                                <p className="text-xs text-muted-foreground mt-1">Total contado al cierre</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                Efectivo en Caja (Teórico)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">Bs. {efectivoEnCaja.toFixed(2)}</div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Inicial ({sessionDetail.monto_inicial_ves?.toFixed(2)}) +
                                Ventas Efectivo ({sessionDetail.total_efectivo_ves?.toFixed(2)}) -
                                Cambio Efectivo ({sessionDetail.total_cambio_efectivo_ves?.toFixed(2) || '0.00'})
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Ventas por Método de Pago</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Efectivo:</span>
                                <span className="font-medium">Bs. {sessionDetail.total_efectivo_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tarjeta:</span>
                                <span className="font-medium">Bs. {sessionDetail.total_tarjeta_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Transferencia:</span>
                                <span className="font-medium">Bs. {sessionDetail.total_transferencia_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Pago Móvil:</span>
                                <span className="font-medium">Bs. {sessionDetail.total_pago_movil_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                            <hr className="my-4 border-t" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total Ventas:</span>
                                <span>Bs. {sessionDetail.total_ventas_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Desglose de Cambio (Vuelto)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cambio en Efectivo:</span>
                                <span className="font-medium text-orange-600">- Bs. {sessionDetail.total_cambio_efectivo_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Cambio en Pago Móvil:</span>
                                <span className="font-medium text-orange-600">- Bs. {sessionDetail.total_cambio_pago_movil_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                            <hr className="my-2 border-t border-dashed" />
                            <div className="flex justify-between font-semibold">
                                <span>Total Cambio Otorgado:</span>
                                <span className="text-orange-700">- Bs. {sessionDetail.total_cambio_ves?.toFixed(2) || '0.00'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {sessionDetail.diferencia_ves !== null && sessionDetail.diferencia_ves !== 0 && (
                        <Card className={sessionDetail.diferencia_ves < 0 ? 'border-red-500' : 'border-green-500'}>
                            <CardHeader>
                                <CardTitle className="text-base">Diferencia de Caja</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${sessionDetail.diferencia_ves < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    Bs. {sessionDetail.diferencia_ves.toFixed(2)}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {sessionDetail.notas_cierre && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Notas de Cierre</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{sessionDetail.notas_cierre}</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="transacciones">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead className="text-right">Total Bs.</TableHead>
                                <TableHead className="text-right">Items</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessionDetail.transacciones.map((transaccion) => (
                                <TableRow key={transaccion.id}>
                                    <TableCell>#{transaccion.id}</TableCell>
                                    <TableCell>{transaccion.cliente_nombre}</TableCell>
                                    <TableCell>
                                        {format(new Date(transaccion.fecha_venta), 'dd/MM/yyyy HH:mm', { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">Bs. {transaccion.monto_total_ves.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">{transaccion.numero_items}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="items">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead className="text-right">Cantidad</TableHead>
                                <TableHead className="text-right">Subtotal Bs.</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessionDetail.items_vendidos.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.producto_nombre}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{item.tipo_producto}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">{item.cantidad_total.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">Bs. {item.subtotal_ves.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </Tabs>
        </div>
    );
};
