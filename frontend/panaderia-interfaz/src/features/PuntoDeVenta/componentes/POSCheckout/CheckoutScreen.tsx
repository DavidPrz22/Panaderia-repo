import { useEffect, useState } from "react";
import { ProductsSummary } from "./ProductosResumen";
import { PaymentOptions } from "./PaymentOptions";
import { PaymentCalculator } from "./CheckoutCalculator";
import { SplitPaymentPanel, type SplitPayment } from "./SplitPaymentPanel";
import { CheckoutHeader } from "./shared/components/CheckoutHeader";
import { useToast } from "@/features/PuntoDeVenta/hooks/use-toast";
import { usePOSContext } from "@/context/POSContext";
import {
    validateSplitPayments,
    calculateTotalWithTax,
    validateReferences
} from "./shared/checkout-utils";
import { RoundToTwo } from "@/utils/utils";
import { PAYMENT_METHOD_LABELS } from "./shared/checkout-constants";
import type { WatchSetValue } from "../../types/types";
import { useBCVRateQuery } from "../../hooks/queries/queries";

interface CheckoutScreenProps {
    onBack: () => void;
    onComplete: () => void;
    isProcessing?: boolean;
}

export function CheckoutScreen({ onBack, onComplete, setValue, isProcessing }: CheckoutScreenProps & WatchSetValue) {
    const { carrito, selectedPaymentMethod, setSelectedPaymentMethod, splitPayments, setSplitPayments } = usePOSContext();
    const [paymentReference, setPaymentReference] = useState("");
    const [selectedSplitIndex, setSelectedSplitIndex] = useState<number | null>(null);
    const { toast } = useToast();
    const { data } = useBCVRateQuery();

    const rate = data?.promedio || 0;

    // Calculate totals in Bolívares (Bs.) as base currency
    const totalBs = RoundToTwo(carrito.reduce((sum, item) => sum + item.subtotal * rate, 0));
    const totalWithTax = RoundToTwo(calculateTotalWithTax(totalBs));
    const isSplitMode = selectedPaymentMethod === "dividir";

    // Format payments for form submission
    useEffect(() => {
        const pago_con_formato = splitPayments.map((pago) => {
            const hasChange = !!pago.change && pago.change > 0;
            const changeBs = hasChange ? RoundToTwo(pago.change!) : 0;
            const changeUsd = hasChange && rate ? RoundToTwo(changeBs / rate) : 0;

            const isCambioPagoMovil = pago.changeDelivery === "pago_movil";

            return {
                metodo_pago: pago.method,
                // Base currency is now Bolívares (Bs.)
                monto_pago_ves: RoundToTwo(pago.amount),
                monto_pago_usd: rate ? RoundToTwo(pago.amount / rate) : 0,
                referencia_pago: pago.reference || undefined, // Sync reference
                // Split change between efectivo vs pago_movil for audits
                cambio_efectivo_ves: hasChange && !isCambioPagoMovil ? changeBs : undefined,
                cambio_efectivo_usd: hasChange && !isCambioPagoMovil ? changeUsd : undefined,
                cambio_pago_movil_ves: hasChange && isCambioPagoMovil ? changeBs : undefined,
                cambio_pago_movil_usd: hasChange && isCambioPagoMovil ? changeUsd : undefined,
            };
        });
        setValue?.("pagos", pago_con_formato);
    }, [splitPayments, setValue, rate]);

    // Initialize Split Payments logic when switching modes
    useEffect(() => {
        if (isSplitMode) {
            // Just entered split mode
            setSplitPayments([]);
            setSelectedSplitIndex(null);
            setPaymentReference("");
        } else if (selectedPaymentMethod) {
            // Entered normal payment mode (or switched method within normal)
            setSplitPayments([{
                method: selectedPaymentMethod,
                amount: totalWithTax,
                change: 0,
                reference: "",
                changeDelivery: "efectivo",
            }]);
            setPaymentReference("");
        }
    }, [isSplitMode, selectedPaymentMethod]); // Intentionally omitting totalWithTax to avoid resetting on minor updates, but logically should reset if total lines change.

    // Sync local reference state to splitPayments (for normal mode)
    useEffect(() => {
        if (!isSplitMode && splitPayments.length > 0) {
            const current = splitPayments[0];
            if (current.reference !== paymentReference) {
                const updated = [...splitPayments];
                updated[0] = { ...current, reference: paymentReference };
                setSplitPayments(updated);
            }
        }
    }, [paymentReference, isSplitMode]); // splitPayments intentionally omitted to avoid loop

    const handleValidateReferences = () => {
        const validation = validateReferences(splitPayments);
        if (!validation.valid) {
            toast({
                title: "Referencia inválida",
                description: validation.error,
                variant: "destructive",
            });

            (document.querySelectorAll("#payment-reference") as NodeListOf<HTMLInputElement>)?.
                forEach((el) => {
                    el.classList.add("border-red-200");
                });

            return false;
        }
        return true;
    };

    const handleConfirmPayment = () => {
        if (!selectedPaymentMethod) {
            toast({
                title: "Selecciona un método de pago",
                description: "Debes seleccionar cómo se realizará el pago",
                variant: "destructive",
            });
            return;
        }

        if (!handleValidateReferences()) {
            return;
        }

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

        if (!handleValidateReferences()) {
            return;
        }

        onComplete();
    };

    const handleCancelSplit = () => {
        setSelectedPaymentMethod("efectivo");
        setSplitPayments([{
            method: "efectivo",
            amount: totalWithTax,
            change: 0,
            reference: "",
            changeDelivery: "efectivo",
        }]);
        setSelectedSplitIndex(null);
        setPaymentReference("");
    };

    // Unified Amount Change Handler
    const handleAmountChange = (amount: number, change: number | undefined) => {
        if (isSplitMode) {
            if (selectedSplitIndex !== null && selectedSplitIndex < splitPayments.length) {
                const updated = [...splitPayments];
                const current = updated[selectedSplitIndex];
                updated[selectedSplitIndex] = {
                    ...current,
                    amount,
                    change,
                    // Default change delivery to efectivo when we first have change
                    changeDelivery: change && change > 0 ? (current.changeDelivery || "efectivo") : current.changeDelivery,
                };
                setSplitPayments(updated);
            }
        } else {
            // Normal Mode
            if (selectedPaymentMethod) {
                // Update the single payment entry
                // We preserve reference if it exists in state
                const prev = splitPayments[0];
                const updated: SplitPayment[] = [{
                    method: selectedPaymentMethod,
                    amount,
                    change,
                    reference: paymentReference, // Use state reference
                    changeDelivery: change && change > 0 ? (prev?.changeDelivery || "efectivo") : prev?.changeDelivery,
                }];
                setSplitPayments(updated);
            }
        }
    };

    const selectedSplitPayment = selectedSplitIndex !== null ? splitPayments[selectedSplitIndex] : undefined;

    const handleChangeDeliveryChange = (delivery: "efectivo" | "pago_movil") => {
        if (isSplitMode) {
            if (selectedSplitIndex !== null && selectedSplitIndex < splitPayments.length) {
                const updated = [...splitPayments];
                const current = updated[selectedSplitIndex];
                updated[selectedSplitIndex] = {
                    ...current,
                    changeDelivery: delivery,
                };
                setSplitPayments(updated);
            }
        } else {
            // Normal mode: only one payment
            if (splitPayments.length > 0) {
                const current = splitPayments[0];
                setSplitPayments([
                    {
                        ...current,
                        changeDelivery: delivery,
                    },
                ]);
            }
        }
    };

    // For Calculator: In split mode, the 'total' passed is the remaining amount to be paid.
    // However, the Calculator logic for split mode adds 'splitAmount' to 'total' to find the Max limit.
    // So distinct from 'totalWithTax'.
    const remainingForSplit = RoundToTwo(totalWithTax - splitPayments.reduce((sum, p) => sum + p.amount, 0));


    return (
        <div className="flex h-screen flex-col bg-gray-50 w-full">
            <CheckoutHeader onBack={onBack} />

            <div className="flex flex-1 gap-6 overflow-hidden px-6 pb-6 pt-3">
                {/* Left - Products */}
                <div className="w-1/3">
                    <ProductsSummary />
                </div>

                {/* Middle - Payment options / Split */}
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
                            isProcessing={isProcessing}
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
                        // In split mode, pass remaining. In normal, totalWithTax.
                        total={isSplitMode ? remainingForSplit : totalWithTax}
                        paymentMethod={isSplitMode ? (selectedSplitPayment?.method || "efectivo") : (selectedPaymentMethod || "efectivo")}

                        onConfirmPayment={isSplitMode ? undefined : handleConfirmPayment}
                        mode={isSplitMode ? "split" : "normal"}

                        // Split specific
                        splitAmount={selectedSplitPayment?.amount}
                        selectedSplitPayment={selectedSplitPayment}
                        splitMethodLabel={selectedSplitPayment ? PAYMENT_METHOD_LABELS[selectedSplitPayment.method] : undefined}

                        // Handlers
                        onSplitAmountChange={handleAmountChange}
                        onNormalAmountChange={handleAmountChange}
                        isProcessing={isProcessing}
                        changeDelivery={isSplitMode ? selectedSplitPayment?.changeDelivery : splitPayments[0]?.changeDelivery}
                        onChangeDeliveryChange={handleChangeDeliveryChange}
                    />
                </div>
            </div>
        </div>
    );
}
