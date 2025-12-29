import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalculatorKeypadProps {
    onNumberClick: (num: string) => void;
    onDelete: () => void;
}

const CALC_BUTTONS = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    ".", "0", "DEL"
];

export function CalculatorKeypad({ onNumberClick, onDelete }: CalculatorKeypadProps) {
    return (
        <div className="grid grid-cols-3 gap-1.5 lg:gap-2">
            {CALC_BUTTONS.map((btn) => (
                <Button
                    key={btn}
                    variant="outline"
                    className={cn(
                        "h-10 text-base lg:text-lg font-semibold cursor-pointer",
                        btn === "DEL" && "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    )}
                    onClick={() => {
                        if (btn === "DEL") onDelete();
                        else onNumberClick(btn);
                    }}
                >
                    {btn === "DEL" ? <Delete className="h-4 w-4 lg:h-5 lg:w-5" /> : btn}
                </Button>
            ))}
        </div>
    );
}
