import z from "zod";

const componenteSchema = z.object({
  id: z
    .number()
    .min(0, { message: "El ID del componente debe ser un número positivo" }),
  cantidad: z.number().min(1, { message: "La cantidad debe ser al menos 1" }),
  tipo: z.enum(["MateriaPrima", "ProductoIntermedio"], {
    required_error: "El tipo de componente es requerido",
    invalid_type_error: "El tipo de componente debe ser 'MateriaPrima' o 'ProductoIntermedio'",
  }),
});

export const productionSchema = z.object({
  productoId: z
    .number()
    .min(0, { message: "El ID del producto debe ser un número positivo" }),
  componentes: z
    .array(componenteSchema)
    .min(1, { message: "Debe haber al menos un componente" }),
  cantidadProduction: z
    .number()
    .min(1, { message: "La cantidad a producir debe ser al menos 1" }),
  tipoProducto: z.enum(["producto-final", "producto-intermedio"], {
    required_error: "El tipo de producto es requerido",
    invalid_type_error:
      "El tipo de producto debe ser 'producto-final' o 'producto-intermedio'",
  }),
  fechaExpiracion: z.date({
    required_error: "La fecha de expiración es requerida",
    invalid_type_error: "La fecha de expiración debe ser una fecha válida",
  }),
});

export type TProductionFormData = z.infer<typeof productionSchema>;
