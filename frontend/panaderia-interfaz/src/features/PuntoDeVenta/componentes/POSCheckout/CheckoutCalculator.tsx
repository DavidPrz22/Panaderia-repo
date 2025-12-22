import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { CalculatorKeypad } from "./shared/components/CalculatorKeypad";
import { QuickAmountButtons } from "./shared/components/QuickAmountButtons";

interface PaymentCalculatorProps {
    total: number;
    onConfirmPayment?: (amount: number) => void;
    mode?: "normal" | "split";
    splitAmount?: number;
    onSplitAmountChange?: (amount: number) => void;
    splitMethodLabel?: string;
}

export function PaymentCalculator({
    total,
    onConfirmPayment,
    mode = "normal",
    splitAmount,
    onSplitAmountChange,
    splitMethodLabel
}: PaymentCalculatorProps) {
    const [inputValue, setInputValue] = useState("");

    // Sync with split amount when in split mode
    useEffect(() => {
        if (mode === "split" && splitAmount !== undefined) {
            setInputValue(splitAmount > 0 ? splitAmount.toFixed(2) : "");
        }
    }, [mode, splitAmount]);

    const numericValue = parseFloat(inputValue) || 0;
    const change = numericValue - total;

    const handleNumberClick = (num: string) => {
        if (num === "." && inputValue.includes(".")) return;
        if (inputValue.includes(".") && inputValue.split(".")[1]?.length >= 2) return;
        const newValue = inputValue + num;
        setInputValue(newValue);
        if (mode === "split" && onSplitAmountChange) {
            onSplitAmountChange(parseFloat(newValue) || 0);
        }
    };

    const handleClear = () => {
        setInputValue("");
        if (mode === "split" && onSplitAmountChange) {
            onSplitAmountChange(0);
        }
    };

    const handleDelete = () => {
        const newValue = inputValue.slice(0, -1);
        setInputValue(newValue);
        if (mode === "split" && onSplitAmountChange) {
            onSplitAmountChange(parseFloat(newValue) || 0);
        }
    };

    const handleQuickAmount = (amount: number) => {
        setInputValue(amount.toFixed(2));
        if (mode === "split" && onSplitAmountChange) {
            onSplitAmountChange(amount);
        }
    };

    const handleExactAmount = () => {
        setInputValue(total.toFixed(2));
        if (mode === "split" && onSplitAmountChange) {
            onSplitAmountChange(total);
        }
    };

    const isSplitMode = mode === "split";

    return (
        <div className="flex h-full flex-col rounded-2xl bg-card p-5 pt-2 shadow-card border border-border">
            <h2 className="mb-4 text-base lg:text-lg font-semibold text-foreground">
                {isSplitMode ? `Monto: ${splitMethodLabel || "Selecciona un método"}` : "Monto Recibido"}
            </h2>

            {/* Display */}
            {!isSplitMode && (
                <div className="mb-4 rounded-xl bg-muted px-4 py-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Total a pagar</p>
                    <p className="text-xl lg:text-2xl font-bold text-foreground">${total.toFixed(2)}</p>
                </div>
            )}

            <div className="mb-4 rounded-xl border-2 border-blue-900/30 bg-blue-900/5 px-4 py-1">
                <p className="text-xs lg:text-sm text-muted-foreground">
                    {isSplitMode ? "Monto asignado" : "Monto recibido"}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-900">
                    ${inputValue || "0.00"}
                </p>
            </div>

            {!isSplitMode && change >= 0 && numericValue > 0 && (
                <div className="mb-4 rounded-xl bg-emerald-500/10 px-4 py-1">
                    <p className="text-xs lg:text-sm text-emerald-600">Cambio</p>
                    <p className="text-xl lg:text-2xl font-bold text-emerald-600">${change.toFixed(2)}</p>
                </div>
            )}

            {/* Quick amounts */}
            <div className="mb-3">
                <QuickAmountButtons
                    onAmountSelect={handleQuickAmount}
                    onExactAmount={handleExactAmount}
                    isSplitMode={isSplitMode}
                />
            </div>

            {/* Calculator */}
            <CalculatorKeypad
                onNumberClick={handleNumberClick}
                onDelete={handleDelete}
            />

            {/* Action buttons - only show in normal mode */}
            {!isSplitMode && (
                <div className="mt-3 flex gap-2">
                    <Button variant="outline" className="flex-1 h-10 cursor-pointer" onClick={handleClear}>
                        Limpiar
                    </Button>
                    <Button
                        className="flex-1 gap-2 h-10 cursor-pointer bg-blue-900 hover:bg-blue-900/80"
                        disabled={numericValue < total}
                        onClick={() => onConfirmPayment?.(numericValue)}
                    >
                        <Check className="h-4 w-4" />
                        Confirmar
                    </Button>
                </div>
            )}

            {/* Clear button only in split mode */}
            {isSplitMode && (
                <Button variant="outline" className="mt-3 cursor-pointer h-10" onClick={handleClear}>
                    Limpiar
                </Button>
            )}
        </div>
    );
}
