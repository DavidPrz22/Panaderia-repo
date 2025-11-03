import { DoubleSpinner } from "@/assets";

export const DoubleSpinnerLoading = ({ extraClassName } : { extraClassName?: string }) => {
    return (
        <div className={`flex items-center justify-center w-full ${extraClassName}`}>
            <div className="flex items-center gap-2">
                <img src={DoubleSpinner} alt="Loading..." />
                <span className="font-semibold text-2xl">
                    cargando...
                </span>
            </div>
        </div>
    )
}