import type { LotesMateriaPrimaFormInputContainerProps } from "@/lib/types";
import { LotesInputForm } from "./LotesInputForm";

export const LotesMateriaPrimaInputContainer = ({inputType, title, name, register, errors, optional}: LotesMateriaPrimaFormInputContainerProps ) => {
    return (
        <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className={`basis-1/4 font-[Roboto] text-sm font-semibold ${optional ? 'text-black' : 'text-red-500'}`}>{title}</div>
                        <LotesInputForm typeInput={inputType} name={name} register={register} />
                    </div>
                <div className="ml-[27%] text-red-500 text-xs">{errors[name]?.message}</div>
        </div>
    )
}