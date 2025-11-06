import { z } from "zod";

const detalleOC = z.object({
  id: z.number(),
  materia_prima: z.number().optional(),
  producto_reventa: z.number().optional(),
  cantidad_solicitada: z.number(),
  unidad_medida_compra: z.number(),
  costo_unitario_usd: z.number(),
  subtotal_linea_usd: z.number(),
});

export const OrdenCompraSchema = z.object({
  proveedor: z.number(),
  fecha_emision_oc: z.string(),
  fecha_entrega_esperada: z.string(),
  fecha_entrega_real: z.string().optional(),
  estado_oc: z.number().min(0, "El estado de la orden es requerido"),
  metodo_pago: z.number().min(0, "El ID del método de pago es requerido"),
  monto_total_oc_usd: z
    .number()
    .min(0, "El monto total de la orden es requerido"),
  monto_total_oc_ves: z
    .number()
    .min(0, "El monto total de la orden en VES es requerido"),
  tasa_cambio_aplicada: z.number().min(0, "La tasa de cambio es requerida"),
  notas: z
    .string()
    .refine((val) => !val || val.length >= 3, {
      message: "Las notas no pueden tener menos de 3 caracteres",
    })
    .refine((val) => !val || val.length <= 250, {
      message: "Las notas no pueden tener más de 250 caracteres",
    })
    .optional(),
  detalles: z.array(detalleOC),
  direccion_envio: z.string().optional(),
  terminos_pago: z.string().optional(),
});

const loteRecepcion = z.object({
  id: z.number(),
  cantidad: z.number(),
  fecha_caducidad: z.string(),
});

const detalleRecepcionSchema = z.object({
  detalle_oc_id: z.number(),
  lotes: z.array(loteRecepcion),
  cantidad_total_recibida: z.number(),
});

export const RecepcionFormSchema = z.object({
  orden_compra_id: z.number(),
  detalles: z.array(detalleRecepcionSchema),
  recibido_parcialmente: z.boolean(),
});

export type TOrdenCompraSchema = z.infer<typeof OrdenCompraSchema>;
export type TRecepcionFormSchema = z.infer<typeof RecepcionFormSchema>;
