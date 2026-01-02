import { useState } from "react";
import {
    Package,
    Wheat,
    Box,
    ShoppingBag,
    TrendingUp,
    FileText,
    ArrowLeft,
    Download,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    useMateriaPrimaReportQuery,
    useProductosFinalesReportQuery,
    useProductosIntermediosReportQuery,
    useProductosReventaReportQuery,
    useSalesSessionsQuery,
    useSessionDetailQuery,
} from "../hooks/queries/queries";
import { downloadSalesReportPDF } from "../api/api";
import type { InventoryItem } from "../schemas/schemas";

type ReportView = "menu" | "materias-primas" | "productos-finales" | "productos-intermedios" | "productos-reventa" | "ventas";

const Reportes = () => {
    const [currentView, setCurrentView] = useState<ReportView>("menu");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Queries
    const { data: materiaPrimaData, isLoading: isLoadingMP } = useMateriaPrimaReportQuery();
    const { data: productosFinalesData, isLoading: isLoadingPF } = useProductosFinalesReportQuery();
    const { data: productosIntermediosData, isLoading: isLoadingPI } = useProductosIntermediosReportQuery();
    const { data: productosReventaData, isLoading: isLoadingPR } = useProductosReventaReportQuery();
    const { data: salesData, isLoading: isLoadingSales } = useSalesSessionsQuery({
        start_date: startDate || undefined,
        end_date: endDate || undefined,
    });
    const { data: sessionDetail, isLoading: isLoadingDetail } = useSessionDetailQuery(selectedSessionId);

    const getStockBadge = (estado: string) => {
        if (estado === 'critico') {
            return <Badge variant="destructive">Crítico</Badge>;
        } else if (estado === 'bajo') {
            return <Badge className="bg-orange-500 hover:bg-orange-600">Bajo</Badge>;
        }
        return <Badge className="bg-accent hover:bg-accent/90">OK</Badge>;
    };

    const handleDownloadPDF = async () => {
        try {
            setIsDownloading(true);
            const blob = await downloadSalesReportPDF({
                start_date: startDate || undefined,
                end_date: endDate || undefined,
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_ventas_${new Date().toISOString().split('T')[0]}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSessionClick = (sessionId: number) => {
        setSelectedSessionId(sessionId);
        setIsDetailsOpen(true);
    };

    const renderInventoryTable = (items: InventoryItem[] | undefined, showPrice = false, isLoading = false) => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }

        if (!items || items.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    No hay datos disponibles
                </div>
            );
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Unidad</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Stock Mín.</TableHead>
                        <TableHead className="text-right">Lotes Disponibles</TableHead>
                        {showPrice && <TableHead className="text-right">Precio</TableHead>}
                        <TableHead>Estado</TableHead>
                        <TableHead>Última Actualización</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.nombre}</TableCell>
                            <TableCell>{item.unidad_medida}</TableCell>
                            <TableCell className="text-right">{item.stock_actual.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{item.punto_reorden.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{item.lotes_disponibles}</TableCell>
                            {showPrice && item.precio_venta_usd !== null && item.precio_venta_usd !== undefined && (
                                <TableCell className="text-right">${item.precio_venta_usd.toFixed(2)}</TableCell>
                            )}
                            {showPrice && (item.precio_venta_usd === null || item.precio_venta_usd === undefined) && (
                                <TableCell className="text-right">-</TableCell>
                            )}
                            <TableCell>{getStockBadge(item.estado)}</TableCell>
                            <TableCell className="text-muted-foreground">
                                {item.fecha_ultima_actualizacion
                                    ? format(new Date(item.fecha_ultima_actualizacion), 'dd/MM/yyyy', { locale: es })
                                    : '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const renderSalesFilters = () => (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="startDate" className="text-sm font-medium mb-1.5 block">
                        Fecha Inicio
                    </Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-background"
                    />
                </div>
                <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="endDate" className="text-sm font-medium mb-1.5 block">
                        Fecha Fin
                    </Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-background"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => { setStartDate(""); setEndDate(""); }}
                    className="min-w-[100px]"
                >
                    Limpiar
                </Button>
                <Button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="min-w-[160px] gap-2"
                >
                    {isDownloading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Download className="h-4 w-4" />
                    )}
                    {isDownloading ? "Generando..." : "Descargar PDF"}
                </Button>
            </div>
            {(startDate || endDate) && salesData && (
                <p className="mt-3 text-sm text-muted-foreground">
                    Mostrando {salesData.length} registros
                </p>
            )}
        </div>
    );

    const renderSalesTable = () => {
        if (isLoadingSales) {
            return (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }

        if (!salesData || salesData.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    No hay datos disponibles
                </div>
            );
        }

        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Cajero</TableHead>
                        <TableHead className="text-right">Efectivo Inicial</TableHead>
                        <TableHead className="text-right">Ventas Efectivo</TableHead>
                        <TableHead className="text-right">Ventas Tarjeta</TableHead>
                        <TableHead className="text-right">Total Ventas</TableHead>
                        <TableHead className="text-right">Transacciones</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salesData.map((session) => (
                        <TableRow
                            key={session.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleSessionClick(session.id)}
                        >
                            <TableCell className="font-medium">
                                {format(new Date(session.fecha_apertura), 'dd/MM/yyyy', { locale: es })}
                            </TableCell>
                            <TableCell>
                                {format(new Date(session.fecha_apertura), 'HH:mm', { locale: es })}
                                {session.fecha_cierre && ` - ${format(new Date(session.fecha_cierre), 'HH:mm', { locale: es })}`}
                            </TableCell>
                            <TableCell>{session.cajero_nombre}</TableCell>
                            <TableCell className="text-right">${session.monto_inicial_usd?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell className="text-right">${session.total_efectivo_usd?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell className="text-right">${session.total_tarjeta_usd?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell className="text-right font-semibold">${session.total_ventas_usd?.toFixed(2) || '0.00'}</TableCell>
                            <TableCell className="text-right">{session.numero_transacciones}</TableCell>
                            <TableCell>
                                {session.esta_activa && (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                                        Activa
                                    </Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    const renderSessionDetails = () => {
        if (isLoadingDetail) {
            return (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }

        if (!sessionDetail) {
            return null;
        }

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
                                    <CardTitle className="text-sm font-medium">Efectivo Inicial</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${sessionDetail.monto_inicial_usd?.toFixed(2) || '0.00'}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm font-medium">Efectivo Final</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${sessionDetail.monto_final_usd?.toFixed(2) || '0.00'}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Ventas por Método de Pago</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Efectivo:</span>
                                    <span className="font-medium">${sessionDetail.total_efectivo_usd?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tarjeta:</span>
                                    <span className="font-medium">${sessionDetail.total_tarjeta_usd?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Transferencia:</span>
                                    <span className="font-medium">${sessionDetail.total_transferencia_usd?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Pago Móvil:</span>
                                    <span className="font-medium">${sessionDetail.total_pago_movil_usd?.toFixed(2) || '0.00'}</span>
                                </div>
                                <hr className="my-4 border-t" />
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total Ventas:</span>
                                    <span>${sessionDetail.total_ventas_usd?.toFixed(2) || '0.00'}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {sessionDetail.diferencia_usd !== null && sessionDetail.diferencia_usd !== 0 && (
                            <Card className={sessionDetail.diferencia_usd < 0 ? 'border-red-500' : 'border-green-500'}>
                                <CardHeader>
                                    <CardTitle className="text-base">Diferencia de Caja</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-2xl font-bold ${sessionDetail.diferencia_usd < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        ${sessionDetail.diferencia_usd.toFixed(2)}
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
                                    <TableHead className="text-right">Total USD</TableHead>
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
                                        <TableCell className="text-right">${transaccion.monto_total_usd.toFixed(2)}</TableCell>
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
                                    <TableHead className="text-right">Subtotal USD</TableHead>
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
                                        <TableCell className="text-right">${item.subtotal_usd.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </div>
        );
    };

    const reportCards = [
        {
            id: "materias-primas" as const,
            title: "Materias Primas",
            description: "Inventario de ingredientes y materiales base",
            icon: Wheat,
            count: materiaPrimaData?.length || 0,
            color: "text-amber-600"
        },
        {
            id: "productos-finales" as const,
            title: "Productos Finales",
            description: "Productos listos para la venta",
            icon: Package,
            count: productosFinalesData?.length || 0,
            color: "text-accent"
        },
        {
            id: "productos-intermedios" as const,
            title: "Productos Intermedios",
            description: "Productos en proceso de elaboración",
            icon: Box,
            count: productosIntermediosData?.length || 0,
            color: "text-blue-600"
        },
        {
            id: "productos-reventa" as const,
            title: "Productos de Reventa",
            description: "Productos comprados para revender",
            icon: ShoppingBag,
            count: productosReventaData?.length || 0,
            color: "text-purple-600"
        },
        {
            id: "ventas" as const,
            title: "Ventas por Apertura/Cierre",
            description: "Reportes de ventas por sesión de caja",
            icon: TrendingUp,
            count: salesData?.length || 0,
            color: "text-primary"
        },
    ];

    const getViewTitle = () => {
        switch (currentView) {
            case "materias-primas": return "Materias Primas";
            case "productos-finales": return "Productos Finales";
            case "productos-intermedios": return "Productos Intermedios";
            case "productos-reventa": return "Productos de Reventa";
            case "ventas": return "Ventas por Apertura/Cierre";
            default: return "Reportes";
        }
    };

    const renderContent = () => {
        if (currentView === "menu") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reportCards.map((report) => (
                        <Card
                            key={report.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                            onClick={() => setCurrentView(report.id)}
                        >
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className={`p-3 rounded-lg bg-muted ${report.color}`}>
                                    <report.icon className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-lg">{report.title}</CardTitle>
                                    <CardDescription>{report.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <FileText className="h-4 w-4" />
                                    <span>{report.count} registros</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );
        }

        return (
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrentView("menu")}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <CardTitle>{getViewTitle()}</CardTitle>
                        <CardDescription>
                            {currentView === "ventas"
                                ? "Reporte de ventas por cada apertura y cierre de caja"
                                : `Inventario actual de ${getViewTitle().toLowerCase()}`
                            }
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    {currentView === "materias-primas" && renderInventoryTable(materiaPrimaData, false, isLoadingMP)}
                    {currentView === "productos-finales" && renderInventoryTable(productosFinalesData, true, isLoadingPF)}
                    {currentView === "productos-intermedios" && renderInventoryTable(productosIntermediosData, false, isLoadingPI)}
                    {currentView === "productos-reventa" && renderInventoryTable(productosReventaData, true, isLoadingPR)}
                    {currentView === "ventas" && (
                        <>
                            {renderSalesFilters()}
                            {renderSalesTable()}
                        </>
                    )}
                </CardContent>
            </Card>
        );
    };

    return (
        <>
            <div className="flex min-h-screen bg-background">
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FileText className="h-6 w-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-bold text-foreground">Reportes</h1>
                            </div>
                            <p className="text-muted-foreground">
                                Accede a reportes de inventario y ventas
                            </p>
                        </div>

                        {/* Content */}
                        {renderContent()}
                    </div>
                </main>
            </div>

            {/* Session Details Sheet */}
            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Detalles de Sesión</SheetTitle>
                        <SheetDescription>
                            Información completa de la sesión de caja
                        </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        {renderSessionDetails()}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default Reportes;
