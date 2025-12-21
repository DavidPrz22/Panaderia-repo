import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsSummary } from "./ProductsSummary";
import { PaymentOptions, PaymentMethod } from "./PaymentOptions";
import { PaymentCalculator } from "./PaymentCalculator";
import { SplitPaymentPanel, SplitPayment } from "./SplitPaymentPanel";
import { toast } from "@/hooks/use-toast";

interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutScreenProps {
  items: CartProduct[];
  total: number;
  onBack: () => void;
  onComplete: () => void;
}

const methodLabels: Record<string, string> = {
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
  pago_movil: "Pago Móvil",
};

export function CheckoutScreen({ items, total, onBack, onComplete }: CheckoutScreenProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentReference, setPaymentReference] = useState("");
  const [splitPayments, setSplitPayments] = useState<SplitPayment[]>([]);
  const [selectedSplitIndex, setSelectedSplitIndex] = useState<number | null>(null);

  const totalWithTax = total * 1.16;

  const handleConfirmPayment = (amount: number) => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Selecciona un método de pago",
        description: "Debes seleccionar cómo se realizará el pago",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Pago completado",
      description: `Pago de $${totalWithTax.toFixed(2)} recibido con ${selectedPaymentMethod}. Cambio: $${(amount - totalWithTax).toFixed(2)}`,
    });
    onComplete();
  };

  const handleConfirmSplitPayment = () => {
    const allocatedTotal = splitPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = totalWithTax - allocatedTotal;

    if (splitPayments.length < 2) {
      toast({
        title: "Métodos insuficientes",
        description: "Agrega al menos 2 métodos de pago para dividir",
        variant: "destructive",
      });
      return;
    }

    if (Math.abs(remaining) > 0.01) {
      toast({
        title: "Monto incorrecto",
        description: remaining > 0 
          ? `Falta asignar $${remaining.toFixed(2)}` 
          : `El monto excede el total por $${Math.abs(remaining).toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }

    const methodsUsed = splitPayments.map(p => methodLabels[p.method]).join(", ");
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
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border bg-card px-6 py-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Finalizar Venta</h1>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-4 lg:gap-6 overflow-hidden p-4 lg:p-6">
        {/* Left - Products summary */}
        <div className="w-1/3">
          <ProductsSummary items={items} total={total} />
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
            splitMethodLabel={selectedSplitPayment ? methodLabels[selectedSplitPayment.method] : undefined}
          />
        </div>
      </div>
    </div>
  );
}
