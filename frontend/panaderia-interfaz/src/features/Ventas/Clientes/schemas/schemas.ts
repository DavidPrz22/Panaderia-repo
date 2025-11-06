import { z } from "zod";

// Input schema used by the frontend when creating a cliente.
export const ClientesInputSchema = z.object({
    nombre_cliente: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
    apellido_cliente: z.string().min(2, "El apellido debe tener al menos 2 caracteres").max(100),
    // telefono: accept formatted (0424-5678965) or raw digits; normalize to formatted on success
    telefono: z
        .string()
        .optional()
        .transform((v) => (v ? v : undefined))
        .refine((v) => {
            if (!v) return true; // optional
            const digits = v.replace(/\D/g, '');
            return digits.length === 11;
        }, { message: 'Teléfono inválido. Use formato 0424-5678965 (11 dígitos).' }),
    email: z.string().optional().refine((v) => (v ? /^\S+@\S+\.\S+$/.test(v) : true), { message: 'El correo electrónico no es válido' }),
    // rif_cedula must be like V-12345678 or J-12345678 (letter + dash + digits)
    rif_cedula: z.string().refine((v) => {
        if (!v) return false;
        const parts = v.split('-');
        if (parts.length !== 2) return false;
        const letter = parts[0].toUpperCase();
        const num = parts[1].replace(/\D/g, '');
        if (!['V','J','G'].includes(letter)) return false;
        return num.length >= 6 && num.length <= 12;
    }, { message: 'RIF/Cédula inválido. Formato esperado: V-12345678 (letra V/J/G seguido de 6-12 dígitos).' }),
    notas: z.string().max(255).optional(),
});

export type TClientesInput = z.infer<typeof ClientesInputSchema>;

// Utility helpers
export function formatPhoneDigitsToMasked(phone?: string) {
    if (!phone) return phone;
    const digits = phone.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0,4)}-${digits.slice(4)}`;
}

export function formatRif(type: string, number: string) {
    const t = (type || '').toUpperCase();
    const n = (number || '').replace(/\D/g, '');
    return `${t}-${n}`;
}