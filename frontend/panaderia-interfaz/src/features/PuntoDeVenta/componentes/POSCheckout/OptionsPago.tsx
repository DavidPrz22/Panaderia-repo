import { Banknote, CreditCard, Smartphone, ArrowLeftRight, SplitSquareHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia" | "pago_movil" | "dividir";

interface PaymentOptionsProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  reference: string;
  onReferenceChange: (reference: string) => void;
}

const paymentMethods = [
  { id: "efectivo" as const, label: "Efectivo", icon: Banknote, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  { id: "tarjeta" as const, label: "Tarjeta", icon: CreditCard, color: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  { id: "transferencia" as const, label: "Transferencia", icon: ArrowLeftRight, color: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  { id: "pago_movil" as const, label: "Pago Móvil", icon: Smartphone, color: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
  { id: "dividir" as const, label: "Dividir Pago", icon: SplitSquareHorizontal, color: "bg-pink-500/10 text-pink-600 border-pink-500/30" },
];

const methodsWithReference: PaymentMethod[] = ["tarjeta", "transferencia", "pago_movil"];

export function PaymentOptions({ selectedMethod, onSelectMethod, reference, onReferenceChange }: PaymentOptionsProps) {
  const showReference = selectedMethod && methodsWithReference.includes(selectedMethod);

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-6 shadow-card">
      <h2 className="mb-6 text-lg font-semibold text-foreground">Método de Pago</h2>
      
      <div className="flex flex-1 flex-col gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          
          return (
            <button
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={cn(
                "flex items-center gap-4 rounded-xl border-2 p-5 transition-all duration-200",
                "hover:scale-[1.02] hover:shadow-md",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-background hover:border-primary/50"
              )}
            >
              <div className={cn("rounded-lg p-3 border", method.color)}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-lg font-medium text-foreground">{method.label}</span>
              {isSelected && (
                <div className="ml-auto h-3 w-3 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
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
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}
