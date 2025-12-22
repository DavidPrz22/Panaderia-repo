import { ScrollArea } from "@/components/ui/scroll-area";
import { usePOSContext } from "@/context/POSContext";

export function ProductsSummary() {
  const { carrito } = usePOSContext();

  // Calculate total from carrito
  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  const taxAmount = total * 0.16;
  const totalWithTax = total * 1.16;

  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-5 pt-2 shadow-card border border-border">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Resumen del Pedido</h2>

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {carrito.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {item.cantidad} × ${item.precio.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold text-foreground">
                ${item.subtotal.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>IVA (16%)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="my-2" />
        <div className="flex justify-between text-xl font-bold text-foreground mb-9">
          <span>Total</span>
          <span>${totalWithTax.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
