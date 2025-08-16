import { z } from "zod";

// const recetaSchema = z.object({
//     id: z.number(),
//     nombre: z.string(),
// });

export const productosIntermediosSchema = z.object({
  nombre_producto: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  SKU: z.string().min(3, "El SKU debe tener al menos 3 caracteres"),
  punto_reorden: z.coerce
    .number()
    .positive()
    .min(0, "El punto de reorden debe ser mayor que 0"),
  categoria: z.coerce
    .number({
      required_error: "La categoría es requerida",
      invalid_type_error: "La categoría no es válida",
    })
    .min(1, "La categoría es requerida"),
  unidad_medida_nominal: z.coerce
    .number({
      required_error: "La unidad de medida es requerida",
      invalid_type_error: "La unidad de medida no es válida",
    })
    .min(1, "La unidad de medida es requerida"),
  receta_relacionada: z.coerce
    .number({
      required_error: "La receta es requerida",
      invalid_type_error: "La receta no es válida",
    })
    .min(0, "La receta es requerida"),
  descripcion: z
    .string()
    .min(3, "La descripción debe tener al menos 3 caracteres")
    .optional(),
});

export type TProductosIntermediosSchema = z.infer<
  typeof productosIntermediosSchema
>;
