import type { UseFormRegister } from "react-hook-form";
import type { TMateriaPrimaSchema } from "@/features/MateriaPrima/schemas/schemas";
import type { Path } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";

export default function SelectInput({
  name,
  register,
  options,
  errors,
}: {
  name: Path<TMateriaPrimaSchema>;
  register: UseFormRegister<TMateriaPrimaSchema>;
  options: string[];
  errors: FieldErrors<TMateriaPrimaSchema>;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="basis-1/4 font-[Roboto] text-sm font-semibold text-red-500">
        Categoria
      </div>
      <select
        {...register(name)}
        className="basis-2/4 border border-gray-300 rounded-md p-2"
      >
        {options.map((option, index) => (
          <option key={index + 1} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="text-red-500 text-xs">{errors[name]?.message}</div>
    </div>
  );
}
