import { LoginInput } from "./LoginInput";
import type { Path } from "react-hook-form";
import type { TLoginUserSchema } from "@/features/Authentication/schemas/schemas";
import type { UseFormRegister } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";

export function LoginInputField({
  title,
  name,
  placeholder,
  type,
  register,
  errors,
  icon,
}: {
  title: string;
  name: Path<TLoginUserSchema>;
  placeholder: string;
  type: string;
  register: UseFormRegister<TLoginUserSchema>;
  errors: FieldErrors<TLoginUserSchema>;
  icon: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="text-sm font-semibold font-[Roboto]">{title}</div>
      <div className="relative">
        <img
          src={icon}
          alt={icon}
          className="absolute left-2.5 bottom-3.5 size-[16px]"
        />
        <LoginInput
          placeholder={placeholder}
          type={type}
          register={register}
          name={name}
        />
      </div>
      <p className="text-red-500 text-xs">{errors[name]?.message}</p>
    </div>
  );
}
