import { z } from "zod";

const productSchema = z.object({
    producto: z.object({
        id: z.number().min(0, "El ID del producto es requerido"),
        tipo_producto: z.enum(["producto-final", "producto-reventa"]),
    }),
    cantidad_solicitada: z.number().min(1, "La cantidad es requerida"),
    unidad_medida_id: z.number().min(0, "El ID de la unidad de medida es requerido"),
    precio_unitario_usd: z.number().min(0, "El precio unitario es requerido"),
    subtotal_linea_usd: z.number().min(0, "El subtotal es requerido"),
    descuento_porcentaje: z.number().min(0, "El descuento es requerido"),
    impuesto_porcentaje: z.number().min(0, "El impuesto es requerido"),
});

export const orderSchema = z.object({
    cliente_id: z.number().min(0, "El ID del cliente es requerido"),
    fecha_creacion_orden: z.string().min(1, "La fecha de la orden es requerida"),
    fecha_entrega_solicitada: z.string().min(1, "La fecha de entrega solicitada es requerida"),
    fecha_entrega_definitiva: z.string().optional(),
    estado_orden: z.string().min(1, "El estado de la orden es requerido"),
    notas_generales: z.string().min(0, "Las notas generales son requeridas"),
    monto_descuento_usd: z.number().min(0, "El monto de descuento es requerido"),
    monto_total_usd: z.number().min(0, "El monto total es requerido"),
    monto_total_ves: z.number().min(0, "El monto total en VES es requerido"),
    tasa_cambio_aplicada: z.number().min(0, "La tasa de cambio es requerida"),
    metodo_pago_id: z.number().min(0, "El ID del método de pago es requerido"),
    productos: z.array(productSchema),
});