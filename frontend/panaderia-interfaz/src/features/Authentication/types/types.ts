import type { Path, UseFormRegister } from "react-hook-form";
import type { TLoginUserSchema } from "../schemas/schemas";

export type UserRoles = "vendedor" | "gerente" | "admin";

export type RegisterUser = {
  username: string;
  email: string;
  full_name: string;
  password: string;
  repassword: string;
  rol: UserRoles;
};

export type User ={
  id: number;
  username: string;
  email: string;
  full_name: string;
  rol: UserRoles;
}

export type TUser = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  rol: UserRoles;
};

export type LoginUserType = {
  placeholder: string;
  type: string;
  name: Path<TLoginUserSchema>;
  register: UseFormRegister<TLoginUserSchema>;
};

export type Permissions = {
 [key in UserRoles]: string[]   
}