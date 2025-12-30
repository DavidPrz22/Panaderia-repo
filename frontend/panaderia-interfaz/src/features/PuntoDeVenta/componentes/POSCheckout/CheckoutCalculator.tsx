import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { CalculatorKeypad } from "./shared/components/CalculatorKeypad";
import { QuickAmountButtons } from "./shared/components/QuickAmountButtons";
import type { PaymentMethod, SplitPayment } from "./shared/checkout-types";
import { RoundToTwo } from "@/utils/utils";
import { usePOSContext } from "@/context/POSContext";

interface PaymentCalculatorProps {
    total: number;
    paymentMethod: PaymentMethod;
    onConfirmPayment?: () => void;
    mode?: "normal" | "split";
    splitAmount?: number;
    onSplitAmountChange?: (amount: number, change?: number) => void;
    onNormalAmountChange: (amount: number, change?: number) => void;
    splitMethodLabel?: string;
    selectedSplitPayment?: SplitPayment;
    isProcessing?: boolean;
}

export function PaymentCalculator({
    total,
    paymentMethod,
    onConfirmPayment,
    mode = "normal",
    splitAmount,
    onSplitAmountChange,
    onNormalAmountChange,
    splitMethodLabel,
    selectedSplitPayment,
    isProcessing
}: PaymentCalculatorProps) {
    const {
        calculatorInputValue: inputValue,
        setCalculatorInputValue: setInputValue,
    } = usePOSContext();

    const isSplitMode = mode === "split";


    console.log("isloading", isProcessing);
    // Calculate maximum allowed amount based on mode and total
    // For split mode: max is the remaining pool + current amount of this payment
    // For normal mode: max is the total to pay
    const maxAllowedAmount = isSplitMode
        ? RoundToTwo(total + (splitAmount || 0))
        : total;

    // Initialize/Sync input value
    useEffect(() => {
        if (isSplitMode) {
            // In split mode, if we have a splitAmount, show it
            if (splitAmount !== undefined) {
                const change = selectedSplitPayment?.change || 0;
                // Reconstruct what the user "tendered"
                const totalTendered = RoundToTwo(splitAmount + change);
                const currentVal = parseFloat(inputValue) || 0;

                // Only update input if it significantly disagrees with current input
                // This prevents overwriting user input while typing (e.g. "100.")
                // and avoids infinite loops logic
                if (Math.abs(currentVal - totalTendered) > 0.005) {
                    setInputValue(totalTendered > 0 ? totalTendered.toString() : "");
                }
            }
        } else {
            // In normal mode, default to total
            // Only update if value is different to avoid resetting if user is typing (though typically total is constant)
            const currentVal = parseFloat(inputValue) || 0;
            if (Math.abs(currentVal - total) > 0.005) {
                setInputValue(total.toFixed(2));
            }
        }
    }, [mode, isSplitMode, splitAmount, total, setInputValue, selectedSplitPayment]);

    // Validate amount when payment method changes (e.g., switching from Efectivo to Tarjeta)
    useEffect(() => {
        if (paymentMethod !== 'efectivo' && inputValue) {
            const currentVal = parseFloat(inputValue) || 0;
            if (currentVal > maxAllowedAmount) {
                handleValueChange(maxAllowedAmount.toString());
            }
        }
    }, [paymentMethod, maxAllowedAmount]);

    const calculateChange = (amount: number, totalToPay: number) => {
        if (paymentMethod !== 'efectivo') return undefined; // Only cash generates change
        const diff = RoundToTwo(amount - totalToPay);
        return diff > 0 ? diff : undefined;
    };

    const handleValueChange = useCallback((newValueStr: string) => {
        // Prevent multiple decimals
        if ((newValueStr.match(/\./g) || []).length > 1) return;

        // Limit to 2 decimal places
        if (newValueStr.includes(".")) {
            const [, decimals] = newValueStr.split(".");
            if (decimals && decimals.length > 2) return;
        }

        let numericValue = parseFloat(newValueStr) || 0;
        let finalStr = newValueStr;

        // Enforce max limit for non-cash methods
        if (paymentMethod !== 'efectivo' && numericValue > maxAllowedAmount) {
            numericValue = maxAllowedAmount;
            finalStr = maxAllowedAmount.toString();
        }

        setInputValue(finalStr);

        // Notify parent
        // For change calculation, we strictly use the numericValue (tendered) vs maxAllowedAmount (debt)
        const change = calculateChange(numericValue, isSplitMode ? maxAllowedAmount : total);

        if (isSplitMode && onSplitAmountChange) {
            // In split mode, the 'total' passed is 'remaining'.
            // Logic in parent expects "Applied Amount" for this payment slot.
            // If paying with cash and overpaying, we cap the Applied Amount to maxAllowedAmount.
            // The excess is stored in 'change'.
            let appliedAmount = numericValue;
            if (paymentMethod === 'efectivo' && numericValue > maxAllowedAmount) {
                appliedAmount = maxAllowedAmount;
            }

            onSplitAmountChange(appliedAmount, change);
        } else if (!isSplitMode) {
            onNormalAmountChange(numericValue, change);
        }
    }, [paymentMethod, maxAllowedAmount, isSplitMode, total, onSplitAmountChange, onNormalAmountChange, setInputValue]);


    const handleNumberClick = (num: string) => {
        if (num === "." && inputValue.includes(".")) return;
        handleValueChange(inputValue + num);
    };

    const handleDelete = () => {
        const newValue = inputValue.slice(0, -1);
        handleValueChange(newValue);
    };

    const handleClear = () => {
        handleValueChange("");
    };

    const handleQuickAmount = (amount: number) => {
        handleValueChange(amount.toString());
    };

    const handleExactAmount = () => {
        if (isSplitMode) {
            // For split, exact means the max allowed (remaining + current)
            handleValueChange(maxAllowedAmount.toString());
        } else {
            handleValueChange(maxAllowedAmount.toFixed(2));
        }
    };

    // Derived display values
    const numericInputValue = parseFloat(inputValue) || 0;
    // Calculate display change. 
    // For display, we want to show potential change against the target.
    // In normal mode, target is 'total'.
    // In split mode, calculating change is tricky because 'total' is remaining. 
    // But logically, change is (Paid - Owed).
    // User sees "Monto asignado" vs "Total/Restante".
    const displayChange = numericInputValue > (isSplitMode ? maxAllowedAmount : total)
        ? RoundToTwo(numericInputValue - (isSplitMode ? maxAllowedAmount : total))
        : 0;

    // Only show change if payment method is cash
    const showChange = displayChange > 0 && paymentMethod === "efectivo";

    return (
        <div className="flex h-full flex-col rounded-2xl bg-card p-5 pt-2 shadow-card border border-border overflow-y-auto">
            <h2 className="mb-4 text-base lg:text-lg font-semibold text-foreground">
                {isSplitMode ? `Monto: ${splitMethodLabel || "Selecciona un método"} ` : "Monto Recibido"}
            </h2>

            {/* Display Total - Only in Normal Mode */}
            {!isSplitMode && (
                <div className="mb-4 rounded-xl bg-muted px-4 py-1">
                    <p className="text-xs lg:text-sm text-muted-foreground">Total a pagar</p>
                    <p className="text-xl lg:text-2xl font-bold text-foreground">Bs. {total.toFixed(2)}</p>
                </div>
            )}

            {/* Display Input Amount */}
            <div className="mb-4 rounded-xl border-2 border-blue-900/30 bg-blue-900/5 px-4 py-1">
                <p className="text-xs lg:text-sm text-muted-foreground">
                    {isSplitMode ? "Monto asignado" : "Monto recibido"}
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-blue-900">
                    Bs. {inputValue === "" ? "0.00" : inputValue.startsWith(".") ? "0" + inputValue : inputValue}
                </p>
            </div>

            {/* Display Change */}
            {showChange && (
                <div className="mb-4 rounded-xl bg-emerald-500/10 px-4 py-1">
                    <p className="text-xs lg:text-sm text-emerald-600">Cambio</p>
                    <p className="text-xl lg:text-2xl font-bold text-emerald-600">Bs. {displayChange.toFixed(2)}</p>
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

            {/* Calculator Keypad */}
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
                        disabled={numericInputValue < total || isProcessing}
                        onClick={() => onConfirmPayment?.()}
                    >
                        {isProcessing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Check className="h-4 w-4" />
                        )}
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
