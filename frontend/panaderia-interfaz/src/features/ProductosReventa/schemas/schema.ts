import { z } from "zod";

export const productosReventaSchema = z.object({
  nombre_producto: z
    .string()
    .min(1, "El nombre del producto es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z
    .string()
    .max(255, "La descripción no puede exceder 255 caracteres")
    .optional(),
  SKU: z
    .string()
    .min(1, "El SKU es requerido")
    .min(4, "El SKU debe tener al menos 4 caracteres")
    .max(50, "El SKU no puede exceder 50 caracteres"),
  categoria: z.coerce
    .number({
      required_error: "La categoría es requerida",
      invalid_type_error: "La categoría no es válida",
    })
    .min(1, "La categoría es requerida"),
  marca: z
    .string()
    .max(100, "La marca no puede exceder 100 caracteres")
    .optional(),
  proveedor_preferido: z
    .string()
    .optional()
    .transform((val) => (!val || val === "" ? undefined : Number(val))) as unknown as z.ZodOptional<z.ZodNumber>,
  unidad_base_inventario: z.coerce
    .number({
      required_error: "La unidad base de inventario es requerida",
      invalid_type_error: "La unidad base de inventario no es válida",
    })
    .min(1, "La unidad base de inventario es requerida"),
  unidad_venta: z.coerce
    .number({
      required_error: "La unidad de venta es requerida",
      invalid_type_error: "La unidad de venta no es válida",
    })
    .min(1, "La unidad de venta es requerida"),
  factor_conversion: z.coerce
    .number()
    .min(0, "El Factor de conversion debe ser mayor o igual a 0"),
  precio_venta_usd: z.coerce
    .number()
    .min(0, "El precio de venta debe ser mayor o igual a 0"),
  pecedero: z.coerce.boolean(),
});

export const loteProductosReventaSchema = z
  .object({
    proveedor_id: z.coerce
      .number({
        required_error: "El proveedor es requerido",
        invalid_type_error: "El proveedor no es válido",
      })
      .min(1, "El proveedor es requerido"),
    fecha_recepcion: z.coerce.date({
      required_error: "La fecha de recepción es requerida",
      invalid_type_error: "La fecha de recepción no es válida",
    }),
    fecha_caducidad: z.coerce.date({
      required_error: "La fecha de caducidad es requerida",
      invalid_type_error: "La fecha de caducidad no es válida",
    }),
    cantidad_recibida: z.coerce
      .number({
        required_error: "La cantidad recibida es requerida",
        invalid_type_error: "La cantidad recibida no es válida",
      })
      .min(1, "La cantidad recibida debe ser mayor a 0"),
    costo_unitario_usd: z.coerce
      .number()
      .min(0, "El costo unitario debe ser mayor a 0"),
  })
  .refine((data) => data.fecha_recepcion < data.fecha_caducidad, {
    message: "La fecha de recepción debe ser anterior a la fecha de caducidad",
    path: ["fecha_recepcion"],
  });

export type TProductosReventaSchema = z.infer<typeof productosReventaSchema>;
export type TLoteProductosReventaSchema = z.infer<typeof loteProductosReventaSchema>;
