import { Minus, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CarritoItem } from "../types/types";

interface CartItemProps {
  item: CarritoItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {


  const handleQuantityChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      onUpdateQuantity(item.id, num);
    }
  };

  const increment = () => onUpdateQuantity(item.id, item.cantidad! + 1);
  const decrement = () => {
    if (item.cantidad! > 1) {
      onUpdateQuantity(item.id, item.cantidad! - 1);
    }
  };

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 animate-scale-in">
      <div className="flex-1 min-w-0 font-[Roboto]">
        <h4 className="font-medium text-sm text-card-foreground truncate">
          {item.nombre}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          ${item.precio.toFixed(2)} c/u
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={decrement}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        
        <Input
          type="number"
          value={item.cantidad}
          onChange={(e) => handleQuantityChange(e.target.value)}
          className="h-7 w-12 text-center text-sm px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min={1}
        />
        
        <button
          onClick={increment}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
