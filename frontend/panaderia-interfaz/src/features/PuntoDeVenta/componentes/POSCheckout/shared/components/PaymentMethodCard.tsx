import { cn } from "@/lib/utils";
import type { PaymentMethodConfig } from "../checkout-types";

interface PaymentMethodCardProps {
    method: PaymentMethodConfig;
    isSelected: boolean;
    onSelect: () => void;
}

export function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
    const Icon = method.icon;

    return (
        <button
            onClick={onSelect}
            className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer",
                "hover:scale-[1.02] hover:shadow-md",
                isSelected
                    ? "border-2 border-blue-900"
                    : "border-border hover:border-blue-900/50"
            )}
        >
            <div className={cn("rounded-lg p-3 border", method.color)}>
                <Icon className="h-6 w-6" />
            </div>
            <span className="text-lg font-medium text-foreground">{method.label}</span>
            {isSelected && (
                <div className="ml-auto h-3 w-3 rounded-full bg-blue-900" />
            )}
        </button>
    );
}
