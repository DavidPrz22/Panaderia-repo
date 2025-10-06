import { z } from "zod";

export const TransformacionSchema = z.object({
    nombre_transformacion: z
    .string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
    cantidad_origen: z.number().min(1, "La cantidad de origen debe ser al menos 1"),
    cantidad_destino: z.number().min(1, "La cantidad de destino debe ser al menos 1"),
    fecha_creacion: z.date(),
    activo: z.boolean()
});

export type TTransformacionSchema = z.infer<typeof TransformacionSchema>;

export const EjecutarTransformacionSchema = z.object({
    nombre_transformacion: z
    .string().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
    producto_origen: z.string().min(3, "El producto de origen debe tener al menos 3 caracteres"),
    producto_destino: z.string().min(3, "El producto destino debe tener al menos 3 caracteres"),
    fecha_ejecucion: z.date(),
    activo: z.boolean()
});

export type TEjecutarTransformacionSchema = z.infer<typeof EjecutarTransformacionSchema>;


export const searchQuerySchema = z.object({
    query: z.string().min(2, 'Mínimo 2 caracteres').max(100),
    limit: z.number().min(1).max(50).optional().default(10),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;