import { Input } from "@/components/ui/input";
import { PAYMENT_METHODS, METHODS_WITH_REFERENCE } from "./shared/checkout-constants";
import { PaymentMethodCard } from "./shared/components/PaymentMethodCard";
import type { PaymentMethod } from "./shared/checkout-types";

interface PaymentOptionsProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  reference: string;
  onReferenceChange: (reference: string) => void;
}

export function PaymentOptions({
  selectedMethod,
  onSelectMethod,
  reference,
  onReferenceChange
}: PaymentOptionsProps) {
  const showReference = selectedMethod && METHODS_WITH_REFERENCE.includes(selectedMethod);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-5 pt-2 shadow-card border border-border overflow-y-auto">
      <h2 className="mb-6 text-lg font-semibold text-foreground">Método de Pago</h2>

      <div className="flex flex-1 flex-col gap-4">
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onSelect={() => onSelectMethod(method.id)}
          />
        ))}
      </div>

      {showReference && (
        <div className="mt-6 pt-6 border-t border-border">
          <label className="block text-sm font-medium text-foreground mb-2">
            Referencia de Pago
          </label>
          <Input
            type="text"
            placeholder="Ingrese la referencia del pago"
            value={reference}
            onChange={(e) => onReferenceChange(e.target.value)}
            className="w-full focus-visible:ring-blue-200"
          />
        </div>
      )}
    </div>
  );
}

// Re-export PaymentMethod type for convenience
export type { PaymentMethod };
