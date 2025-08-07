import { get } from "react-hook-form";
import RecetasInput from "./RecetasInput";
import type { RecetasFormInputContainerProps } from "../types/types";
import RecetasSearchInput from "./RecetaSearchInput";

export default function RecetasFormInputContainer({
  register,
  title,
  name,
  errors,
  inputType,
  recetaBusqueda,
  optional,
  onChange,
}: RecetasFormInputContainerProps) {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-2">
        <div
          className={`font-[Roboto] text-md font-semibold ${optional ? "text-black" : "text-red-500"}`}
        >
          {title}
        </div>
        {recetaBusqueda ? (
          <RecetasSearchInput
            typeInput={inputType}
            placeholder="Busca componentes..."
            onChange={onChange}
          />
        ) : (
          <RecetasInput register={register} name={name} typeInput={inputType} />
        )}
      </div>

      <div className="pl-1 text-red-500 text-xs">
        {get(errors, name)?.message}
      </div>
    </div>
  );
}
