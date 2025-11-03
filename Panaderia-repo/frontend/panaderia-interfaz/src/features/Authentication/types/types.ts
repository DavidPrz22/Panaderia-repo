import type { Path, UseFormRegister } from "react-hook-form";
import type { TLoginUserSchema } from "../schemas/schemas";

export type RegisterUser = {
  username: string;
  email: string;
  full_name: string;
  password: string;
  repassword: string;
  rol: string;
};

export type TUser = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  rol: string;
};

export type LoginUserType = {
  placeholder: string;
  type: string;
  name: Path<TLoginUserSchema>;
  register: UseFormRegister<TLoginUserSchema>;
};
