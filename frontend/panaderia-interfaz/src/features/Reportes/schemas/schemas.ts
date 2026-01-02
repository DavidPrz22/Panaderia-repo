import { z } from 'zod';

// Inventory Report Schemas
export const inventoryItemSchema = z.object({
    id: z.number(),
    nombre: z.string(),
    unidad_medida: z.string(),
    stock_actual: z.string().transform(Number),
    punto_reorden: z.string().transform(Number),
    lotes_disponibles: z.number(),
    precio_venta_usd: z.string().transform(Number).nullable().optional(),
    fecha_ultima_actualizacion: z.string().nullable().optional(),
    categoria: z.string(),
    estado: z.enum(['critico', 'bajo', 'ok']),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const inventoryReportSchema = z.array(inventoryItemSchema);

export type InventoryReport = z.infer<typeof inventoryReportSchema>;

export const inventorySummarySchema = z.object({
    materias_primas: z.number(),
    productos_finales: z.number(),
    productos_intermedios: z.number(),
    productos_reventa: z.number(),
});

export type InventorySummary = z.infer<typeof inventorySummarySchema>;

// Sales Report Schemas
export const sessionReportSchema = z.object({
    id: z.number(),
    fecha_apertura: z.string(),
    fecha_cierre: z.string().nullable(),
    cajero_nombre: z.string(),
    monto_inicial_usd: z.string().transform(Number),
    monto_inicial_ves: z.string().transform(Number),
    monto_final_usd: z.string().transform(Number).nullable(),
    monto_final_ves: z.string().transform(Number).nullable(),
    total_efectivo_usd: z.string().transform(Number).nullable(),
    total_efectivo_ves: z.string().transform(Number).nullable(),
    total_tarjeta_usd: z.string().transform(Number).nullable(),
    total_tarjeta_ves: z.string().transform(Number).nullable(),
    total_transferencia_usd: z.string().transform(Number).nullable(),
    total_transferencia_ves: z.string().transform(Number).nullable(),
    total_pago_movil_usd: z.string().transform(Number).nullable(),
    total_pago_movil_ves: z.string().transform(Number).nullable(),
    total_ventas_usd: z.string().transform(Number).nullable(),
    total_ventas_ves: z.string().transform(Number).nullable(),
    diferencia_usd: z.string().transform(Number).nullable(),
    diferencia_ves: z.string().transform(Number).nullable(),
    numero_transacciones: z.number(),
    esta_activa: z.boolean(),
    notas_apertura: z.string().nullable(),
    notas_cierre: z.string().nullable(),
});

export type SessionReport = z.infer<typeof sessionReportSchema>;

export const salesReportSchema = z.array(sessionReportSchema);

export type SalesReport = z.infer<typeof salesReportSchema>;

export const salesSummarySchema = z.object({
    count: z.number(),
});

export type SalesSummary = z.infer<typeof salesSummarySchema>;

// Item Vendido Schema
export const itemVendidoSchema = z.object({
    producto_id: z.number(),
    producto_nombre: z.string(),
    tipo_producto: z.string(),
    cantidad_total: z.string().transform(Number),
    subtotal_usd: z.string().transform(Number),
    subtotal_ves: z.string().transform(Number),
});

export type ItemVendido = z.infer<typeof itemVendidoSchema>;

export const itemsVendidosSchema = z.array(itemVendidoSchema);

export type ItemsVendidos = z.infer<typeof itemsVendidosSchema>;

// Transaction Schema
export const transaccionVentaSchema = z.object({
    id: z.number(),
    fecha_venta: z.string(),
    cliente_nombre: z.string(),
    monto_total_usd: z.string().transform(Number),
    monto_total_ves: z.string().transform(Number),
    numero_items: z.number(),
    notas: z.string().nullable(),
});

export type TransaccionVenta = z.infer<typeof transaccionVentaSchema>;

export const transaccionesSchema = z.array(transaccionVentaSchema);

export type Transacciones = z.infer<typeof transaccionesSchema>;

// Session Detail Schema
export const sessionDetailSchema = z.object({
    id: z.number(),
    fecha_apertura: z.string(),
    fecha_cierre: z.string().nullable(),
    cajero_nombre: z.string(),
    monto_inicial_usd: z.string().transform(Number),
    monto_inicial_ves: z.string().transform(Number),
    monto_final_usd: z.string().transform(Number).nullable(),
    monto_final_ves: z.string().transform(Number).nullable(),
    total_efectivo_usd: z.string().transform(Number).nullable(),
    total_efectivo_ves: z.string().transform(Number).nullable(),
    total_tarjeta_usd: z.string().transform(Number).nullable(),
    total_tarjeta_ves: z.string().transform(Number).nullable(),
    total_transferencia_usd: z.string().transform(Number).nullable(),
    total_transferencia_ves: z.string().transform(Number).nullable(),
    total_pago_movil_usd: z.string().transform(Number).nullable(),
    total_pago_movil_ves: z.string().transform(Number).nullable(),
    total_cambio_usd: z.string().transform(Number).nullable(),
    total_cambio_ves: z.string().transform(Number).nullable(),
    total_ventas_usd: z.string().transform(Number).nullable(),
    total_ventas_ves: z.string().transform(Number).nullable(),
    diferencia_usd: z.string().transform(Number).nullable(),
    diferencia_ves: z.string().transform(Number).nullable(),
    esta_activa: z.boolean(),
    notas_apertura: z.string().nullable(),
    notas_cierre: z.string().nullable(),
    transacciones: transaccionesSchema,
    items_vendidos: itemsVendidosSchema,
});

export type SessionDetail = z.infer<typeof sessionDetailSchema>;
