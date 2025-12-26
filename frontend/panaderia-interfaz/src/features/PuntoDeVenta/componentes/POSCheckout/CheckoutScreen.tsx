import { useEffect, useState } from "react";
import { ProductsSummary } from "./ProductosResumen";
import { PaymentOptions, type PaymentMethod } from "./PaymentOptions";
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
import { RoundToTwo } from "@/utils/utils";
import { PAYMENT_METHOD_LABELS } from "./shared/checkout-constants";
import type { WatchSetValue } from "../../types/types";
import { useBCVRateQuery } from "../../hooks/queries/queries";

interface CheckoutScreenProps {
    onBack: () => void;
    onComplete: () => void;
}

export function CheckoutScreen({ onBack, onComplete, watch, setValue }: CheckoutScreenProps & WatchSetValue) {
    const { carrito, selectedPaymentMethod, setSelectedPaymentMethod, splitPayments, setSplitPayments } = usePOSContext();
    const [paymentReference, setPaymentReference] = useState("");
    const [selectedSplitIndex, setSelectedSplitIndex] = useState<number | null>(null);
    const { toast } = useToast();
    const { data } = useBCVRateQuery()

    // Calculate total from carrito
    const total = RoundToTwo(carrito.reduce((sum, item) => sum + item.subtotal, 0));
    const totalWithTax = RoundToTwo(calculateTotalWithTax(total));

    const isSplitMode = selectedPaymentMethod === "dividir";

    useEffect(() => {
        const pago_con_formato = splitPayments.map((pago) => {
            return {
                metodo_pago: pago.method,
                monto_pago_usd: RoundToTwo(pago.amount),
                monto_pago_ves: RoundToTwo(pago.amount * data!.promedio) || 0,
                referencia_pago: pago.reference || undefined,
                cambio_efectivo_usd: pago.change ? RoundToTwo(pago.change) : undefined,
                cambio_efectivo_ves: pago.change ? RoundToTwo(pago.change * data!.promedio) : undefined,
            };
        });
        setValue?.("pagos", pago_con_formato);
    }, [splitPayments, setValue]);
    console.log("splitPayments", splitPayments);
    console.log("pagos", watch?.("pagos"));
    useEffect(() => {
        if (isSplitMode) {
            setSplitPayments([]);
            setSelectedSplitIndex(null);
        }
    }, [isSplitMode])

    useEffect(() => {
        if (isSplitMode) return;
        setSplitPayments([
            {
                method: selectedPaymentMethod ? selectedPaymentMethod : "efectivo",
                amount: totalWithTax,
                change: 0,
                reference: paymentReference
            }
        ])
    }, []);

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

    const handleChangePaymentOption = (value: PaymentMethod) => {
        setSelectedPaymentMethod(value)
    }

    const handleCancelSplit = () => {
        setSelectedPaymentMethod(null);
        setSplitPayments([]);
        setSelectedSplitIndex(null);
    };

    const handleSplitAmountChange = (amount: number, change: number | undefined) => {
        if (selectedSplitIndex !== null && selectedSplitIndex < splitPayments.length) {
            const updated = [...splitPayments];
            updated[selectedSplitIndex] = { ...updated[selectedSplitIndex], amount, change: change };
            setSplitPayments(updated);
        }
    };

    const handleNormalAmountChange = (amount: number, change: number | undefined) => {
        if (selectedSplitIndex === null && selectedPaymentMethod && selectedPaymentMethod !== "dividir") {
            const updated: SplitPayment[] = [{ method: selectedPaymentMethod, amount: amount, change: change }];
            setSplitPayments(updated);
        }
    };

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
                            onSelectMethod={handleChangePaymentOption}
                            reference={paymentReference}
                            onReferenceChange={setPaymentReference}
                        />
                    )}
                </div>

                {/* Right - Calculator */}
                <div className="w-1/3">
                    <PaymentCalculator
                        total={isSplitMode ? remainingForSplit : totalWithTax}
                        paymentMethod={selectedPaymentMethod!}
                        onConfirmPayment={isSplitMode ? undefined : handleConfirmPayment}
                        mode={isSplitMode ? "split" : "normal"}
                        splitAmount={selectedSplitPayment?.amount}
                        onSplitAmountChange={handleSplitAmountChange}
                        onNormalAmountChange={handleNormalAmountChange}
                        splitMethodLabel={selectedSplitPayment ? PAYMENT_METHOD_LABELS[selectedSplitPayment.method] : undefined}
                        selectedSplitPayment={isSplitMode ? selectedSplitPayment! : undefined}

                    />
                </div>
            </div>
        </div>
    );
}
