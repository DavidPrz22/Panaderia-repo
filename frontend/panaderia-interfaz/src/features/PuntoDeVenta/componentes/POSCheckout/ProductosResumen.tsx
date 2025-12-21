import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductsSummaryProps {
  items: CartProduct[];
  total: number;
}

export function ProductsSummary({ items, total }: ProductsSummaryProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-card p-6 shadow-card">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Resumen del Pedido</h2>
      
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-semibold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>IVA (16%)</span>
          <span>${(total * 0.16).toFixed(2)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between text-xl font-bold text-foreground">
          <span>Total</span>
          <span>${(total * 1.16).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
