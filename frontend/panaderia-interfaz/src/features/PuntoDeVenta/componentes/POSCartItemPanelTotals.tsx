import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { usePOSContext } from "@/context/POSContext";
import { useEffect } from "react";
import { useBCVRateQuery } from "@/features/PuntoDeVenta/hooks/queries/queries";

type Props = {
  onSetTotals: (total_usd: number, tasa_cambio: number) => void;
}
export const POSCartItemPanelTotals = ({ onSetTotals }: Props) => {
  const { carrito, setCarrito, setShowCheckout } = usePOSContext();
  const { data: bcvRate } = useBCVRateQuery();
  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  useEffect(() => {
    onSetTotals(total, bcvRate?.promedio || 0);
  }, [total])

  const handleCheckout = () => {
    setShowCheckout(true);
  };
  const clearCart = () => {
    setCarrito([]);
  };

  return (
    <div className="border-t border-border p-4 space-y-3 font-[Roboto] basis-5/9">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Total</span>
        <div className="text-right">
          <span className="text-2xl font-bold text-foreground block">
            Bs. {(total * (bcvRate?.promedio || 0)).toFixed(2)}
          </span>
          <span className="text-sm font-semibold text-muted-foreground block">
            ${total.toFixed(2)}
          </span>
        </div>
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