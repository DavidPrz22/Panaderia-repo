import { z } from "zod";

const materiaPrimaComponenteSchema = z.object({
  componente_id: z.coerce
    .number()
    .min(1, { message: "El componente debe ser valido" }),
  materia_prima: z.boolean(),
  cantidad: z.coerce
    .number()
    .min(1, { message: "La cantidad debe ser mayor que 0" }),
});

const productoIntermedioComponenteSchema = z.object({
  componente_id: z.coerce
    .number()
    .min(1, { message: "El componente debe ser valido" }),
  producto_intermedio: z.boolean(),
  cantidad: z.coerce
    .number()
    .min(1, { message: "La cantidad debe ser mayor que 0" }),
});

const componentesRecetasSchema = z.union([
  materiaPrimaComponenteSchema,
  productoIntermedioComponenteSchema,
]);

const recetaRelacionadaSchema = z.coerce
  .number()
  .min(0, { message: "La receta relacionada debe ser valida" });

export const recetasFormSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre no es válido",
    })
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  rendimiento: z.coerce
    .number()
    .positive({ message: "El rendimiento debe ser mayor que 0" })
    .optional()
    .or(z.literal(null))
    .or(z.literal("")),

  componente_receta: z.array(componentesRecetasSchema).min(1, {
    message: "El componente es requerido",
  }),
  notas: z
    .string()
    .refine((val) => !val || val.length >= 3, {
      message: "Las notas no pueden tener menos de 3 caracteres",
    })
    .refine((val) => !val || val.length <= 250, {
      message: "Las notas no pueden tener más de 250 caracteres",
    })
    .optional(),
  receta_relacionada: z.array(recetaRelacionadaSchema).default([]),
});

export type TRecetasFormSchema = z.infer<typeof recetasFormSchema>;
