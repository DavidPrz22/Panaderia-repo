import { z } from "zod";

export const productoFinalSchema = z.object({
  nombre_producto: z.string().min(1, "El nombre del producto es requerido"),
  SKU: z.string({
      required_error: "El SKU es requerido",
    }).min(4, "El SKU deber tener mínimo 5 carácteres"),
  descripcion: z.string()
    .refine((val) => !val || val.length >= 3, {
      message: "Las notas no pueden tener menos de 3 caracteres"
    })
    .refine((val) => !val || val.length <= 250, {
      message: "Las notas no pueden tener más de 250 caracteres"
    })
    .optional(),
  tipo_manejo_venta: z.enum(["UNIDAD", "PESO_VOLUMEN"]),
  categoria: z.coerce.number().min(0, "La categoría es requerida"),
  receta_relacionada: z.coerce.number().min(0, "La receta relacionada es requerida"),
  precio_venta_usd: z.coerce.number().refine((val) => !val || val > 0, {
    message: "El precio de venta debe ser mayor a 0",
  }).optional(),
  unidad_venta: z.coerce.number().min(0, "La unidad de venta es requerida"),
  punto_reorden: z.coerce.number().min(0, "El punto de reorden no puede ser negativo"),
  unidad_medida_nominal: z.coerce.number().min(1, "La unidad de medida es requerida"),
});

export type TProductoFinalSchema = z.infer<typeof productoFinalSchema>;
