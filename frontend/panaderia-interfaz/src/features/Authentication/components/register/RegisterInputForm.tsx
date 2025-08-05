import type { UseFormRegister, Path } from "react-hook-form";
import type { TRegisterUserSchema } from "@/features/Authentication/schemas/schemas";

export default function RegisterInputForm({
  name,
  placeholder,
  type,
  register,
}: {
  name: Path<TRegisterUserSchema>;
  placeholder: string;
  type: string;
  register: UseFormRegister<TRegisterUserSchema>;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="text-[0.7rem] font-semibold font-[Roboto]">{name}</div>
      <input
        {...register(name)}
        className="w-full text-[0.7rem] p-2 pl-8 border font-semibold font-[Roboto] border-gray-300 bg-gray-100 rounded-xs outline-0
            focus:outline-blue-500 focus:outline-2"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
