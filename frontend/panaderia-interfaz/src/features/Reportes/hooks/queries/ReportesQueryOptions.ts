import {
    fetchMateriaPrimaReport,
    fetchProductosFinalesReport,
    fetchProductosIntermediosReport,
    fetchProductosReventaReport,
    fetchSalesSessions,
    fetchSessionDetail,
    fetchItemsVendidos,
    fetchInventorySummary,
    fetchSalesSummary,
} from "../../api/api";

// Inventory Report Options
export const materiaPrimaReportQueryOptions = () => ({
    queryKey: ['reportes', 'inventario', 'materias-primas'],
    queryFn: fetchMateriaPrimaReport,
});

export const productosFinalesReportQueryOptions = () => ({
    queryKey: ['reportes', 'inventario', 'productos-finales'],
    queryFn: fetchProductosFinalesReport,
});

export const productosIntermediosReportQueryOptions = () => ({
    queryKey: ['reportes', 'inventario', 'productos-intermedios'],
    queryFn: fetchProductosIntermediosReport,
});

export const productosReventaReportQueryOptions = () => ({
    queryKey: ['reportes', 'inventario', 'productos-reventa'],
    queryFn: fetchProductosReventaReport,
});

export const inventorySummaryQueryOptions = () => ({
    queryKey: ['reportes', 'inventario', 'resumen'],
    queryFn: fetchInventorySummary,
});

// Sales Report Options
export const salesSessionsQueryOptions = (params?: {
    start_date?: string;
    end_date?: string;
}) => ({
    queryKey: ['reportes', 'ventas', 'sesiones', params],
    queryFn: () => fetchSalesSessions(params),
});

export const salesSummaryQueryOptions = () => ({
    queryKey: ['reportes', 'ventas', 'resumen'],
    queryFn: fetchSalesSummary,
});

export const sessionDetailQueryOptions = (sessionId: number | null) => ({
    queryKey: ['reportes', 'ventas', 'detalle', sessionId],
    queryFn: () => fetchSessionDetail(sessionId!),
    enabled: sessionId !== null,
});

export const itemsVendidosQueryOptions = (sessionId: number | null) => ({
    queryKey: ['reportes', 'ventas', 'items-vendidos', sessionId],
    queryFn: () => fetchItemsVendidos(sessionId!),
    enabled: sessionId !== null,
});
