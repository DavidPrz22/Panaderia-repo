import { z } from "zod";

export const aperturaCajaSchema = z.object({
    monto_inicial_usd: z.number().min(1, "El monto debe ser mayor a 0").max(1000000, "El monto debe ser menor a 1000000"),
    monto_inicial_ves: z.number().min(1, "El monto debe ser mayor a 0").max(1000000, "El monto debe ser menor a 1000000"),
    notas_apertura: z.string().refine((value) => !value || value.length >= 3, "Por favor, ingresa notas").optional(),
});

export type TAperturaCaja = z.infer<typeof aperturaCajaSchema>;