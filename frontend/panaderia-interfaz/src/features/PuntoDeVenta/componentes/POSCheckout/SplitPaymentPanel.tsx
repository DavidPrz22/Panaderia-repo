import { useState } from "react";
import { Banknote, CreditCard, Smartphone, ArrowLeftRight, Plus, X, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SplitMethod = "efectivo" | "tarjeta" | "transferencia" | "pago_movil";

export interface SplitPayment {
  method: SplitMethod;
  amount: number;
  reference?: string;
}

interface SplitPaymentPanelProps {
  total: number;
  payments: SplitPayment[];
  onPaymentsChange: (payments: SplitPayment[]) => void;
  onCancel: () => void;
  onConfirm: () => void;
  selectedPaymentIndex: number | null;
  onSelectPayment: (index: number | null) => void;
}

const availableMethods = [
  { id: "efectivo" as const, label: "Efectivo", icon: Banknote, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  { id: "tarjeta" as const, label: "Tarjeta", icon: CreditCard, color: "bg-blue-500/10 text-blue-600 border-blue-500/30", needsReference: true },
  { id: "transferencia" as const, label: "Transferencia", icon: ArrowLeftRight, color: "bg-purple-500/10 text-purple-600 border-purple-500/30", needsReference: true },
  { id: "pago_movil" as const, label: "Pago Móvil", icon: Smartphone, color: "bg-orange-500/10 text-orange-600 border-orange-500/30", needsReference: true },
];

export function SplitPaymentPanel({ 
  total, 
  payments, 
  onPaymentsChange, 
  onCancel, 
  onConfirm,
  selectedPaymentIndex,
  onSelectPayment
}: SplitPaymentPanelProps) {
  const [showMethodPicker, setShowMethodPicker] = useState(false);

  const allocatedTotal = payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = total - allocatedTotal;

  const addPayment = (method: SplitMethod) => {
    const newPayment: SplitPayment = {
      method,
      amount: remaining > 0 ? remaining : 0,
      reference: "",
    };
    const newPayments = [...payments, newPayment];
    onPaymentsChange(newPayments);
    onSelectPayment(newPayments.length - 1);
    setShowMethodPicker(false);
  };

  const updatePaymentReference = (index: number, reference: string) => {
    const updated = [...payments];
    updated[index] = { ...updated[index], reference };
    onPaymentsChange(updated);
  };

  const removePayment = (index: number) => {
    onPaymentsChange(payments.filter((_, i) => i !== index));
    if (selectedPaymentIndex === index) {
      onSelectPayment(null);
    } else if (selectedPaymentIndex !== null && selectedPaymentIndex > index) {
      onSelectPayment(selectedPaymentIndex - 1);
    }
  };

  const usedMethods = payments.map(p => p.method);
  const availableToAdd = availableMethods.filter(m => !usedMethods.includes(m.id));

  const isValid = payments.length >= 2 && Math.abs(remaining) <= 0.01;

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-6 shadow-card">
      {/* Header with cancel button */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="icon" onClick={onCancel} className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-foreground">Dividir Pago</h2>
      </div>
      
      {/* Summary bar */}
      <div className="mb-4 rounded-xl bg-muted/50 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total a pagar:</span>
          <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-muted-foreground">Asignado:</span>
          <span className="font-medium text-foreground">${allocatedTotal.toFixed(2)}</span>
        </div>
        <div className={cn(
          "flex justify-between text-sm mt-1 pt-2 border-t border-border",
          remaining > 0.01 ? "text-amber-600" : remaining < -0.01 ? "text-destructive" : "text-emerald-600"
        )}>
          <span>Restante:</span>
          <span className="font-bold">${remaining.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment entries */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {payments.map((payment, index) => {
          const methodInfo = availableMethods.find(m => m.id === payment.method)!;
          const Icon = methodInfo.icon;
          const needsReference = methodInfo.needsReference;
          const isSelected = selectedPaymentIndex === index;

          return (
            <div 
              key={index} 
              className={cn(
                "rounded-xl border-2 bg-background p-4 cursor-pointer transition-all",
                isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/50"
              )}
              onClick={() => onSelectPayment(index)}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("rounded-lg p-2 border", methodInfo.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-foreground flex-1">{methodInfo.label}</span>
                <span className="text-lg font-bold text-foreground">${payment.amount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePayment(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {needsReference && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Input
                    type="text"
                    value={payment.reference || ""}
                    onChange={(e) => updatePaymentReference(index, e.target.value)}
                    placeholder="Número de referencia"
                    className="mt-2"
                  />
                </div>
              )}
              
              {isSelected && (
                <p className="text-xs text-primary mt-2">Usa la calculadora para ajustar el monto →</p>
              )}
            </div>
          );
        })}

        {/* Add method button */}
        {availableToAdd.length > 0 && (
          <div className="relative">
            {showMethodPicker ? (
              <div className="rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 p-3">
                <p className="text-xs text-muted-foreground mb-2 text-center">Seleccionar método</p>
                <div className="grid grid-cols-2 gap-2">
                  {availableToAdd.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => addPayment(method.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border p-2 transition-all",
                          "hover:scale-[1.02] hover:shadow-sm",
                          method.color
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-medium">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2 text-xs"
                  onClick={() => setShowMethodPicker(false)}
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setShowMethodPicker(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Agregar método de pago</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Validation message */}
      {payments.length > 0 && Math.abs(remaining) > 0.01 && (
        <div className={cn(
          "mt-4 rounded-lg p-3 text-sm",
          remaining > 0 ? "bg-amber-500/10 text-amber-600" : "bg-destructive/10 text-destructive"
        )}>
          {remaining > 0 
            ? `Falta asignar $${remaining.toFixed(2)} del total`
            : `El monto asignado excede el total por $${Math.abs(remaining).toFixed(2)}`
          }
        </div>
      )}

      {/* Confirm button */}
      <Button 
        size="lg" 
        className="w-full mt-4"
        onClick={onConfirm}
        disabled={!isValid}
      >
        <Check className="h-5 w-5 mr-2" />
        Confirmar Pago Dividido
      </Button>
    </div>
  );
}