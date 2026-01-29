import { z } from "zod";

export const TransformacionSchema = z.object({
    nombre_transformacion: z.string()
        .min(1, "El nombre es requerido")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder los 100 caracteres"),
    cantidad_origen: z.coerce.number()
        .min(0.01, "La cantidad de origen debe ser mayor a 0"),
    cantidad_destino: z.coerce.number()
        .min(0.01, "La cantidad de destino debe ser mayor a 0"),
    fecha_creacion: z.date(),
    activo: z.boolean()
});

export type TTransformacionSchema = z.infer<typeof TransformacionSchema>;

export const EjecutarTransformacionSchema = z.object({
    transformacion_id: z.number({ required_error: "Debe seleccionar una transformación" })
        .positive("ID de transformación inválido"),
    producto_origen_id: z.number({ required_error: "Debe seleccionar un producto de origen" })
        .positive("ID de producto de origen inválido"),
    producto_destino_id: z.number({ required_error: "Debe seleccionar un producto destino" })
        .positive("ID de producto destino inválido"),
});

export type TEjecutarTransformacionSchema = z.infer<typeof EjecutarTransformacionSchema>;

export const searchQuerySchema = z.object({
    query: z.string().min(2, 'Mínimo 2 caracteres').max(100),
    limit: z.number().min(1).max(50).optional().default(10),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;