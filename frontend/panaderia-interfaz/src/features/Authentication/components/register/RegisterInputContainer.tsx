import type { Path } from "react-hook-form";
import type { TRegisterUserSchema } from "@/features/Authentication/schemas/schemas";
import type { UseFormRegister } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";

import { RegisterInput } from "./RegisterInput";

export default function RegisterInputContainer({
  title,
  name,
  placeholder,
  type,
  register,
  errors,
  icon,
}: {
  title: string;
  name: Path<TRegisterUserSchema>;
  placeholder: string;
  type: string;
  register: UseFormRegister<TRegisterUserSchema>;
  errors: FieldErrors<TRegisterUserSchema>;
  icon: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[0.7rem] font-semibold font-[Roboto]">{title}</div>
      <div className="relative">
        <img
          src={icon}
          alt={icon}
          className="absolute left-2.5 bottom-2 size-[16px]"
        />
        <RegisterInput
          placeholder={placeholder}
          type={type}
          name={name}
          register={register}
        />
      </div>
      <p className="text-red-500 text-[0.6rem]">{errors[name]?.message}</p>
    </div>
  );
}
