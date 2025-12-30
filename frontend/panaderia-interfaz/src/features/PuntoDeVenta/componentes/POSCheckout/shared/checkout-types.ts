// Shared type definitions for checkout components


export interface CartProduct {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export type PaymentMethod = "efectivo" | "tarjeta" | "transferencia" | "pago_movil" | "dividir" ;

export type ChangeDeliveryMethod = "efectivo" | "pago_movil";

export interface SplitPayment {
    method: Exclude<PaymentMethod, "dividir">;
    amount: number;
    reference?: string;
    change?: number;
    // How the change is actually delivered when method is "efectivo".
    changeDelivery?: ChangeDeliveryMethod;
}

export interface PaymentMethodConfig {
    id: PaymentMethod;
    label: string;
    icon: any; // LucideIcon type
    color: string;
    needsReference?: boolean;
}
