import MateriaInputForm from "./MateriaInputForm";
import type { MateriaPrimaFormInputContainerProps } from "@/features/MateriaPrima/types/types";


export const MateriaPrimaFormInputContainer = ({
  inputType,
  title,
  name,
  register,
  errors,
  optional,
}: MateriaPrimaFormInputContainerProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div
          className={`basis-1/4 font-[Roboto] text-sm font-semibold ${optional ? "text-black" : "text-red-500"}`}
        >
          {title}
        </div>
        <MateriaInputForm
          typeInput={inputType}
          name={name}
          register={register}
        />
      </div>
      <div className="ml-[27%] text-red-500 text-xs">
        {errors[name]?.message}
      </div>
    </div>
  );
};
