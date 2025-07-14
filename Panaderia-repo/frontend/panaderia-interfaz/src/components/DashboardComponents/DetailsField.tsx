import { type ReactNode } from "react";

export const DetailsField = ({extraClass, children}: {extraClass?: string, children: ReactNode}) => {
    return (
        <div className={`text-sm text-gray-500 font-[Roboto] ${extraClass}`}>
            {children}
        </div>
    )
}