import { ScrollArea } from "@/components/ui/scroll-area";
import { usePOSContext } from "@/context/POSContext";
import { useBCVRateQuery } from "@/features/PuntoDeVenta/hooks/queries/queries";

export function ProductsSummary() {
  const { carrito } = usePOSContext();
  const { data: bcvRate } = useBCVRateQuery();
  const rate = bcvRate?.promedio || 0;

  // Calculate total from carrito
  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const taxAmount = total * 0.16;
  const totalWithTax = total * 1.16;

  const totalBs = total * rate;
  const taxAmountBs = taxAmount * rate;
  const totalWithTaxBs = totalWithTax * rate;

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-5 pt-2 shadow-card border border-border">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Resumen del Pedido</h2>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4 font-[Roboto]">
          {carrito.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.nombre}</p>
                <p className="text-xs text-muted-foreground">
                  {item.cantidad} × Bs. {(item.precio * rate).toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  Bs. {(item.subtotal * rate).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <div className="text-right">
            <span className="block font-medium text-foreground">Bs. {totalBs.toFixed(2)}</span>
            <span className="block text-xs">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>IVA (16%)</span>
          <div className="text-right">
            <span className="block font-medium text-foreground">Bs. {taxAmountBs.toFixed(2)}</span>
            <span className="block text-xs">${taxAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="my-2" />
        <div className="flex justify-between items-end text-foreground mb-9">
          <span className="text-lg font-semibold">Total</span>
          <div className="text-right">
            <span className="block text-2xl font-bold">Bs. {totalWithTaxBs.toFixed(2)}</span>
            <span className="block text-sm font-semibold text-muted-foreground">${totalWithTax.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
