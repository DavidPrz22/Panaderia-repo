import type { TRegisterUserSchema } from "@/features/Authentication/schemas/schemas";
import type { FieldErrors, Path, UseFormRegister } from "react-hook-form";

export default function RegisterSelectContainer({
  title,
  name,
  register,
  errors,
}: {
  title: string;
  name: Path<TRegisterUserSchema>;
  register: UseFormRegister<TRegisterUserSchema>;
  errors: FieldErrors<TRegisterUserSchema>;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[0.7rem] font-semibold font-[Roboto]">{title}</div>
      <select
        {...register(name)}
        className="w-full cursor-pointer text-[0.7rem] p-1.5 border font-semibold font-[Roboto] border-gray-300 bg-gray-100 rounded-xs outline-0
            focus:outline-blue-500 focus:outline-2"
      >
        <option value=""></option>
        <option value="Gerente">Gerente</option>
        <option value="Vendedor">Vendedor</option>
      </select>
      <p className="text-red-500 text-[0.6rem]">
        {errors[name]?.type === "required_error"
          ? "El rol es requerido"
          : errors[name]?.message}
      </p>
    </div>
  );
}
