import type { UseFormRegister, Path } from "react-hook-form";
import type { TRegisterUserSchema } from "@/features/Authentication/schemas/schemas";

export function RegisterInput({
  placeholder,
  type,
  name,
  register,
}: {
  placeholder: string;
  type: string;
  name: Path<TRegisterUserSchema>;
  register: UseFormRegister<TRegisterUserSchema>;
}) {
  return (
    <input
      {...register(name)}
      className="w-full text-[0.7rem] px-1 py-1.5 pl-8 border font-semibold font-[Roboto] border-gray-300 bg-gray-100 rounded-xs outline-0
        focus:outline-blue-500 focus:outline-2"
      type={type}
      placeholder={placeholder}
    />
  );
}
