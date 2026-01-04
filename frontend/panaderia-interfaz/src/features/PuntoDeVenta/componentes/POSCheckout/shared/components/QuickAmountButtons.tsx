import { Button } from "@/components/ui/button";
import { QUICK_AMOUNTS } from "../checkout-constants";

interface QuickAmountButtonsProps {
    onAmountSelect: (amount: number) => void;
    onExactAmount: () => void;
    isSplitMode?: boolean;
}

export function QuickAmountButtons({
    onAmountSelect,
    onExactAmount,
    isSplitMode = false
}: QuickAmountButtonsProps) {
    return (
        <div className="grid grid-cols-3 gap-1.5 lg:gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={onExactAmount}
                className="text-xs h-8 lg:h-9 cursor-pointer"
            >
                {isSplitMode ? "Restante" : "Exacto"}
            </Button>
            {QUICK_AMOUNTS.map((amount) => (
                <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => onAmountSelect(amount)}
                    className="text-xs h-8 lg:h-9 cursor-pointer"
                >
                    Bs. {amount}
                </Button>
            ))}
        </div>
    );
}
