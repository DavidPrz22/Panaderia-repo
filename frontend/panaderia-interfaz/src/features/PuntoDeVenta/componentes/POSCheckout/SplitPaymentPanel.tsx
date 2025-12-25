import { useState } from "react";
import { Plus, X, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SPLIT_PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "./shared/checkout-constants";
import type { SplitPayment } from "./shared/checkout-types";

interface SplitPaymentPanelProps {
    total: number;
    payments: SplitPayment[];
    onPaymentsChange: (payments: SplitPayment[]) => void;
    onCancel: () => void;
    onConfirm: () => void;
    selectedPaymentIndex: number | null;
    onSelectPayment: (index: number | null) => void;
}

export function SplitPaymentPanel({
    total,
    payments,
    onPaymentsChange,
    onCancel,
    onConfirm,
    selectedPaymentIndex,
    onSelectPayment
}: SplitPaymentPanelProps) {
    const [showMethodSelector, setShowMethodSelector] = useState(false);

    const allocatedTotal = payments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = total - allocatedTotal;

    const addPayment = (method: SplitPayment["method"]) => {
        const newPayment: SplitPayment = {
            method,
            amount: 0,
            reference: "",
            change: undefined,
        };
        const updatedPayments = [...payments, newPayment];
        onPaymentsChange(updatedPayments);
        onSelectPayment(updatedPayments.length - 1);
        setShowMethodSelector(false);
    };

    const updatePaymentReference = (index: number, reference: string) => {
        const updated = [...payments];
        updated[index] = { ...updated[index], reference };
        onPaymentsChange(updated);
    };

    const removePayment = (index: number) => {
        const updated = payments.filter((_, i) => i !== index);
        onPaymentsChange(updated);
        if (selectedPaymentIndex === index) {
            onSelectPayment(null);
        } else if (selectedPaymentIndex !== null && selectedPaymentIndex > index) {
            onSelectPayment(selectedPaymentIndex - 1);
        }
    };

    const getMethodConfig = (methodId: string) => {
        return SPLIT_PAYMENT_METHODS.find(m => m.id === methodId);
    };

    return (
        <div className="flex h-full flex-col rounded-2xl bg-card p-5 pt-2 shadow-card overflow-auto border border-border">
            {/* Header */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">Dividir Pago</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Asigna montos a diferentes métodos de pago
                </p>
            </div>

            {/* Summary */}
            <div className="mb-4 rounded-xl bg-muted p-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Total a pagar</span>
                    <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Asignado</span>
                    <span className="font-semibold text-foreground">${allocatedTotal.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Restante</span>
                    <span className={cn(
                        "font-bold",
                        remaining > 0 ? "text-orange-600" : remaining < 0 ? "text-red-600" : "text-green-600"
                    )}>
                        ${remaining.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Payment methods list */}
            <ScrollArea className="flex-1 mb-4">
                <div className="space-y-2 pr-2">
                    {payments.map((payment, index) => {
                        const methodConfig = getMethodConfig(payment.method);
                        const Icon = methodConfig?.icon;
                        const isSelected = selectedPaymentIndex === index;

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "rounded-lg border-2 p-3 transition-all cursor-pointer",
                                    isSelected
                                        ? "border border-blue-900 bg-blue-50/30 "
                                        : "border-border bg-background hover:border-primary/50"
                                )}
                                onClick={() => onSelectPayment(index)}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    {Icon && (
                                        <div className={cn("rounded-lg p-2 border", methodConfig?.color)}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                    )}
                                    <span className="font-medium text-foreground flex-1">
                                        {PAYMENT_METHOD_LABELS[payment.method]}
                                    </span>
                                    <span className="font-bold text-primary">
                                        ${payment.amount.toFixed(2)}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removePayment(index);
                                        }}
                                        className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Reference input for methods that need it */}
                                {methodConfig?.needsReference && (
                                    <Input
                                        type="text"
                                        placeholder="Referencia"
                                        value={payment.reference || ""}
                                        onChange={(e) => updatePaymentReference(index, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-sm h-8 focus-visible:ring-blue-200"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            {/* Add payment button or method selector */}
            {showMethodSelector ? (
                <div className="mb-4 space-y-2">
                    <p className="text-sm font-medium text-foreground mb-2">Selecciona un método:</p>
                    <div className="grid grid-cols-2 gap-2">
                        {SPLIT_PAYMENT_METHODS.map((method) => {
                            const Icon = method.icon;
                            return (
                                <button
                                    key={method.id}
                                    onClick={() => addPayment(method.id as SplitPayment["method"])}
                                    className={cn(
                                        "flex items-center gap-2 rounded-lg border p-3 transition-all",
                                        "hover:scale-[1.02] hover:shadow-md border-border bg-background hover:border-primary/50"
                                    )}
                                >
                                    <div className={cn("rounded p-2 border", method.color)}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium">{method.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMethodSelector(false)}
                        className="w-full"
                    >
                        Cancelar
                    </Button>
                </div>
            ) : (
                <Button
                    variant="outline"
                    onClick={() => setShowMethodSelector(true)}
                    className="mb-4 w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Método de Pago
                </Button>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </Button>
                <Button onClick={onConfirm} className="flex-1">
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar
                </Button>
            </div>
        </div>
    );
}

// Re-export SplitPayment type for convenience
export type { SplitPayment };