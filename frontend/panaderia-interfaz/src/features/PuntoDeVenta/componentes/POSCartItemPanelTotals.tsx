import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { usePOSContext } from "@/context/POSContext";
import { useEffect } from "react";
import { useBCVRateQuery } from "@/features/PuntoDeVenta/hooks/queries/queries";

type Props = {
  onSetTotals: (total_usd: number, tasa_cambio: number) => void;
}
export const POSCartItemPanelTotals = ({onSetTotals} : Props) => {
    const { carrito } = usePOSContext();
    const { data: bcvRate } = useBCVRateQuery();
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

    useEffect(()=> {
      onSetTotals(total, bcvRate?.promedio || 0);
    }, [total])

    const handleCheckout = () => {
        console.log("Checkout");
    };
    const clearCart = () => {
        console.log("Clear cart");
    };

    return (
        <div className="border-t border-border p-4 space-y-3 font-[Roboto]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-12 bg-blue-900 text-white font-semibold"
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