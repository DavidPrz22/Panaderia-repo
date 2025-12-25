import { useState } from "react";
import { ProductsSummary } from "./ProductosResumen";
import { PaymentOptions } from "./PaymentOptions";
import type { PaymentMethod } from "./shared/checkout-types";
import { PaymentCalculator } from "./CheckoutCalculator";
import { SplitPaymentPanel, type SplitPayment } from "./SplitPaymentPanel";
import { CheckoutHeader } from "./shared/components/CheckoutHeader";
import { useToast } from "@/features/PuntoDeVenta/hooks/use-toast";
import { usePOSContext } from "@/context/POSContext";
import {
    validateSplitPayments,
    calculateTotalWithTax,
    formatSplitPaymentMethods,
    calculateChange
} from "./shared/checkout-utils";
import { PAYMENT_METHOD_LABELS } from "./shared/checkout-constants";

interface CheckoutScreenProps {
    onBack: () => void;
    onComplete: () => void;
}

export function CheckoutScreen({ onBack, onComplete }: CheckoutScreenProps) {
    const { carrito } = usePOSContext();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
    const [paymentReference, setPaymentReference] = useState("");
    const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
    const [selectedSplitIndex, setSelectedSplitIndex] = useState<number | null>(null);
    const { toast } = useToast();

    // Calculate total from carrito
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const totalWithTax = calculateTotalWithTax(total);


    const handleConfirmPayment = (amount: number) => {
        if (!selectedPaymentMethod) {
            toast({
                title: "Selecciona un método de pago",
                description: "Debes seleccionar cómo se realizará el pago",
                variant: "destructive",
            });
            return;
        }

        const change = calculateChange(amount, totalWithTax);
        toast({
            title: "Pago completado",
            description: `Pago de $${totalWithTax.toFixed(2)} recibido con ${selectedPaymentMethod}. Cambio: $${change.toFixed(2)}`,
        });
        onComplete();
    };

    const handleConfirmSplitPayment = () => {
        const validation = validateSplitPayments(splitPayments, totalWithTax);

        if (!validation.valid) {
            toast({
                title: validation.error?.includes("métodos") ? "Métodos insuficientes" : "Monto incorrecto",
                description: validation.error,
                variant: "destructive",
            });
            return;
        }

        const methodsUsed = formatSplitPaymentMethods(splitPayments);
        toast({
            title: "Pago completado",
            description: `Pago dividido de $${totalWithTax.toFixed(2)} completado (${methodsUsed})`,
        });
        onComplete();
    };

    const handleCancelSplit = () => {
        setSelectedPaymentMethod(null);
        setSplitPayments([]);
        setSelectedSplitIndex(null);
    };

    const handleSplitAmountChange = (amount: number) => {
        if (selectedSplitIndex !== null && selectedSplitIndex < splitPayments.length) {
            const updated = [...splitPayments];
            updated[selectedSplitIndex] = { ...updated[selectedSplitIndex], amount };
            setSplitPayments(updated);
        }
    };

    const isSplitMode = selectedPaymentMethod === "dividir";
    const selectedSplitPayment = selectedSplitIndex !== null ? splitPayments[selectedSplitIndex] : null;
    const remainingForSplit = totalWithTax - splitPayments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="flex h-screen flex-col bg-gray-50 w-full">
            {/* Header */}
            <CheckoutHeader onBack={onBack} />

            {/* Main content */}
            <div className="flex flex-1 gap-6 overflow-hidden px-6 pb-6 pt-3">
                {/* Left - Products summary */}
                <div className="w-1/3">
                    <ProductsSummary />
                </div>

                {/* Middle - Payment options or Split Payment */}
                <div className="w-1/3">
                    {isSplitMode ? (
                        <SplitPaymentPanel
                            total={totalWithTax}
                            payments={splitPayments}
                            onPaymentsChange={setSplitPayments}
                            onCancel={handleCancelSplit}
                            onConfirm={handleConfirmSplitPayment}
                            selectedPaymentIndex={selectedSplitIndex}
                            onSelectPayment={setSelectedSplitIndex}
                        />
                    ) : (
                        <PaymentOptions
                            selectedMethod={selectedPaymentMethod}
                            onSelectMethod={setSelectedPaymentMethod}
                            reference={paymentReference}
                            onReferenceChange={setPaymentReference}
                        />
                    )}
                </div>

                {/* Right - Calculator */}
                <div className="w-1/3">
                    <PaymentCalculator
                        total={isSplitMode ? remainingForSplit : totalWithTax}
                        onConfirmPayment={isSplitMode ? undefined : handleConfirmPayment}
                        mode={isSplitMode ? "split" : "normal"}
                        splitAmount={selectedSplitPayment?.amount}
                        onSplitAmountChange={handleSplitAmountChange}
                        splitMethodLabel={selectedSplitPayment ? PAYMENT_METHOD_LABELS[selectedSplitPayment.method] : undefined}
                    />
                </div>
            </div>
        </div>
    );
}
