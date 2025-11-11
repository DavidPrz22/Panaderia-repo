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
  cantidad: z.coerce.number().min(1, "La cantidad debe ser mayor a 0"),
  fecha_caducidad: z.string().min(1, "La fecha de caducidad es requerida"),
});

const detalleRecepcionSchema = z.object({
  detalle_oc_id: z.number(),
  lotes: z.array(loteRecepcion),
  cantidad_total_recibida: z.number(),
});

export const RecepcionFormSchema = z.object({
  orden_compra_id: z.number(),
  fecha_recepcion: z.string().min(1, "La fecha de recepción es requerida"),
  detalles: z.array(detalleRecepcionSchema),
  recibido_parcialmente: z.boolean(),
});

export const PagoSchema = z.object({
  fecha_pago: z.string().min(1, "La fecha de pago es requerida"),
  metodo_pago: z.number().min(0, "El método de pago es requerido"),
  referencia_pago: z.string().min(1, "La referencia de pago es requerida"),
  monto: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  moneda: z.string().min(1, "La moneda es requerida"),
  tasa_cambio: z.coerce.number().min(0.01, "La tasa de cambio debe ser mayor a 0"),
  notas_pago: z.string().optional(),
});

export type TOrdenCompraSchema = z.infer<typeof OrdenCompraSchema>;
export type TRecepcionFormSchema = z.infer<typeof RecepcionFormSchema>;
export type TPagoSchema = z.infer<typeof PagoSchema>;
