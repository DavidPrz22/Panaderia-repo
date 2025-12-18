import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { usePOSContext } from "@/context/POSContext";

export const POSCartItemPanelTotals = () => {
    const { carrito } = usePOSContext();
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

    const handleCheckout = () => {
        console.log("Checkout");
    };
    const clearCart = () => {
        console.log("Clear cart");
    };

    return (
        <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-12 text-base font-semibold"
              disabled={carrito.length === 0}
            >
              Ir a Cobrar
            </Button>

            <Button
              onClick={clearCart}
              variant="outline"
              className="w-full"
              disabled={carrito.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar Orden
            </Button>
          </div>
    );
};