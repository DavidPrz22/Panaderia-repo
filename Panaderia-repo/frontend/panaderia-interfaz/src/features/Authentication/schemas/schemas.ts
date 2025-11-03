import { z } from "zod";

export const registerUserSchema = z
  .object({
    username: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    full_name: z
      .string()
      .min(3, "El nombre completo debe tener al menos 3 caracteres"),
    email: z.string().email("El email no es válido"),
    password: z
      .string()
      .min(4, "La contraseña debe tener al menos 5 caracteres"),
    repeatpassword: z.string().min(4, "La contraseña no coincide"),
    rol: z.enum(["Gerente", "Vendedor"], { message: "El rol no es válido" }),
  })
  .refine((data) => data.password === data.repeatpassword, {
    message: "Las contraseñas no coinciden",
    path: ["repeatpassword"],
  });

export const loginUserSchema = z.object({
  username: z.string().min(3, "El nombe de usuario debe ser valido"),
  password: z.string().min(4, "La contraseña debe ser valida"),
});

export type TRegisterUserSchema = z.infer<typeof registerUserSchema>;
export type TLoginUserSchema = z.infer<typeof loginUserSchema>;
