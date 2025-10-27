import { z } from "zod";

const detalleOC = z.object({
    id: z.number(),
    materia_prima: z.number().optional(),
    producto_reventa: z.number().optional(),
    cantidad_solicitada: z.number(),
    cantidad_recibida: z.number(),
    unidad_medida_compra: z.number(),
    costo_unitario_usd: z.number(),
    subtotal_linea_usd: z.number(),
    notas: z.string().optional(),
});

const OrdenCompraSchema = z.object({
    id: z.number(),
    proveedor: z.number(),
    fecha_emision_oc: z.string(),
    fecha_entrega_esperada: z.string(),
    fecha_entrega_real: z.string().optional(),
    estado_oc: z.number(),
    metodo_pago: z.number(),
    subtotal_oc_usd: z.number(),
    monto_total_oc_usd: z.number(),
    monto_impuestos_oc_usd: z.number(),
    tasa_cambio_aplicada: z.number(),
    notas: z.string().optional(),
    detalles: z.array(detalleOC),
    direccion_envio: z.string().optional(),
    terminos_pago: z.string().optional(),
});

export type OrdenCompra = z.infer<typeof OrdenCompraSchema>;