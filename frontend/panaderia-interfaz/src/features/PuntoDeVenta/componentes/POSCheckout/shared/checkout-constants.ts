import { Banknote, CreditCard, Smartphone, ArrowLeftRight, SplitSquareHorizontal } from "lucide-react";
import type { PaymentMethodConfig, PaymentMethod } from "./checkout-types";

// Payment method configurations
export const PAYMENT_METHODS: PaymentMethodConfig[] = [
    {
        id: "efectivo",
        label: "Efectivo",
        icon: Banknote,
        color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
    },
    {
        id: "tarjeta",
        label: "Tarjeta",
        icon: CreditCard,
        color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        needsReference: true
    },
    {
        id: "transferencia",
        label: "Transferencia",
        icon: ArrowLeftRight,
        color: "bg-purple-500/10 text-purple-600 border-purple-500/30",
        needsReference: true
    },
    {
        id: "pago_movil",
        label: "Pago Móvil",
        icon: Smartphone,
        color: "bg-orange-500/10 text-orange-600 border-orange-500/30",
        needsReference: true
    },
    {
        id: "dividir",
        label: "Dividir Pago",
        icon: SplitSquareHorizontal,
        color: "bg-pink-500/10 text-pink-600 border-pink-500/30"
    },
];

// Available methods for split payments (excludes "dividir")
export const SPLIT_PAYMENT_METHODS = PAYMENT_METHODS.filter(m => m.id !== "dividir");

// Payment method labels mapping
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
    efectivo: "Efectivo",
    tarjeta: "Tarjeta",
    transferencia: "Transferencia",
    pago_movil: "Pago Móvil",
};

// Methods that require reference number
export const METHODS_WITH_REFERENCE: PaymentMethod[] = ["tarjeta", "transferencia", "pago_movil"];

// Quick amount presets
export const QUICK_AMOUNTS = [50, 100, 200, 500, 1000];

// Tax rate
export const TAX_RATE = 0.16;
