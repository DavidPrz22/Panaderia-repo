import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Delete, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const calcButtons = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    ".", "0", "DEL"
  ];

  const isSplitMode = mode === "split";

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-4 lg:p-6 shadow-card">
      <h2 className="mb-3 lg:mb-4 text-base lg:text-lg font-semibold text-foreground">
        {isSplitMode ? `Monto: ${splitMethodLabel || "Selecciona un método"}` : "Monto Recibido"}
      </h2>

      {/* Display */}
      {!isSplitMode && (
        <div className="mb-3 lg:mb-4 rounded-xl bg-muted p-3 lg:p-4">
          <p className="text-xs lg:text-sm text-muted-foreground">Total a pagar</p>
          <p className="text-xl lg:text-2xl font-bold text-foreground">${total.toFixed(2)}</p>
        </div>
      )}

      <div className="mb-3 lg:mb-4 rounded-xl border-2 border-primary/30 bg-primary/5 p-3 lg:p-4">
        <p className="text-xs lg:text-sm text-muted-foreground">
          {isSplitMode ? "Monto asignado" : "Monto recibido"}
        </p>
        <p className="text-2xl lg:text-3xl font-bold text-primary">
          ${inputValue || "0.00"}
        </p>
      </div>

      {!isSplitMode && change >= 0 && numericValue > 0 && (
        <div className="mb-3 lg:mb-4 rounded-xl bg-emerald-500/10 p-3 lg:p-4">
          <p className="text-xs lg:text-sm text-emerald-600">Cambio</p>
          <p className="text-xl lg:text-2xl font-bold text-emerald-600">${change.toFixed(2)}</p>
        </div>
      )}

      {/* Quick amounts */}
      <div className="mb-3 lg:mb-4 grid grid-cols-3 gap-1.5 lg:gap-2">
        <Button variant="outline" size="sm" onClick={handleExactAmount} className="text-xs h-8 lg:h-9">
          {isSplitMode ? "Restante" : "Exacto"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickAmount(50)} className="text-xs h-8 lg:h-9">
          $50
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickAmount(100)} className="text-xs h-8 lg:h-9">
          $100
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickAmount(200)} className="text-xs h-8 lg:h-9">
          $200
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickAmount(500)} className="text-xs h-8 lg:h-9">
          $500
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleQuickAmount(1000)} className="text-xs h-8 lg:h-9">
          $1000
        </Button>
      </div>

      {/* Calculator */}
      <div className="grid grid-cols-3 gap-1.5 lg:gap-2">
        {calcButtons.map((btn) => (
          <Button
            key={btn}
            variant="outline"
            className={cn(
              "h-10 lg:h-14 text-base lg:text-lg font-semibold",
              btn === "DEL" && "bg-destructive/10 text-destructive hover:bg-destructive/20"
            )}
            onClick={() => {
              if (btn === "DEL") handleDelete();
              else handleNumberClick(btn);
            }}
          >
            {btn === "DEL" ? <Delete className="h-4 w-4 lg:h-5 lg:w-5" /> : btn}
          </Button>
        ))}
      </div>

      {/* Action buttons - only show in normal mode */}
      {!isSplitMode && (
        <div className="mt-3 lg:mt-4 flex gap-2">
          <Button variant="outline" className="flex-1 h-10 lg:h-11" onClick={handleClear}>
            Limpiar
          </Button>
          <Button 
            className="flex-1 gap-2 h-10 lg:h-11" 
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
        <Button variant="outline" className="mt-3 lg:mt-4 h-10 lg:h-11" onClick={handleClear}>
          Limpiar
        </Button>
      )}
    </div>
  );
}
