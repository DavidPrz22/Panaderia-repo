import { type ReactNode } from "react";


export const DetailFieldValue = ({extraClass, children}: {extraClass?: string, children: ReactNode}) => {
    return (
        <div className={`text-sm text-black font-[Roboto] font-bold ${extraClass}`}>
            {children}
        </div>
    )
}