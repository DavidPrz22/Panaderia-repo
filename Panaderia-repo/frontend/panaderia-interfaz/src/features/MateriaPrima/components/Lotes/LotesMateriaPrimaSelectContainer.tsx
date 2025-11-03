import type { LotesMateriaPrimaFormSelectContainerProps } from "@/features/MateriaPrima/types/types";

export const LotesMateriaPrimaSelectContainer = ({
  title,
  name,
  register,
  errors,
  children,
}: LotesMateriaPrimaFormSelectContainerProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="basis-1/4 font-[Roboto] text-sm font-semibold text-red-500">
          {title}
        </div>
        <select
          {...register(name)}
          className="basis-2/4 border border-gray-300 rounded-md p-2"
        >
          {children}
        </select>
      </div>
      <div className="ml-[27%] text-red-500 text-xs">
        {errors[name]?.message}
      </div>
    </div>
  );
};
