import type { SplitPayment } from "./checkout-types";
import { PAYMENT_METHOD_LABELS } from "./checkout-constants";

/**
 * Validates if split payments cover the total amount
 */
export function validateSplitPayments(
    splitPayments: SplitPayment[],
    total: number
): { valid: boolean; error?: string } {
    if (splitPayments.length < 2) {
        return {
            valid: false,
            error: "Agrega al menos 2 métodos de pago para dividir",
        };
    }

    const allocatedTotal = splitPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = total - allocatedTotal;

    if (Math.abs(remaining) > 0.01) {
        return {
            valid: false,
            error:
                remaining > 0
                    ? `Falta asignar $${remaining.toFixed(2)}`
                    : `El monto excede el total por $${Math.abs(remaining).toFixed(2)}`,
        };
    }

    return { valid: true };
}

/**
 * Calculates the total with tax
 */
export function calculateTotalWithTax(subtotal: number, taxRate: number = 0.16): number {
    return subtotal * (1 + taxRate);
}

/**
 * Formats split payment methods for display
 */
export function formatSplitPaymentMethods(splitPayments: SplitPayment[]): string {
    return splitPayments.map((p) => PAYMENT_METHOD_LABELS[p.method]).join(", ");
}

/**
 * Calculates change amount
 */
export function calculateChange(received: number, total: number): number {
    return Math.max(0, received - total);
}

export function validateReferences(splitPayments: SplitPayment[]): { valid: boolean; error?: string } {
    const hasReferences = splitPayments.every((p) => {
        if (p.method !== 'efectivo' && p.reference === "") {
            return false;
        }
        return true;
    });
    if (!hasReferences) {
        return {
            valid: false,
            error: "Debes agregar una referencia para cada método de pago que lo requiera",
        };
    }
    return { valid: true };
}
