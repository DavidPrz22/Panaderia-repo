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

export type TProductosReventaSchema = z.infer<typeof productosReventaSchema>;
