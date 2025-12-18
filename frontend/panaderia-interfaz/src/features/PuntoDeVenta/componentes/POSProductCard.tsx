import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  type: "final" | "reventa";
  price: number;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const isLowStock = product.stock <= 5;

  return (
    <div 
      className="group relative flex flex-col rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary/30 cursor-pointer animate-fade-in"
      onClick={() => onAdd(product)}
    >
      {/* Type badge */}
      <span
        className={cn(
          "absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium",
          product.type === "final"
            ? "bg-pos-product-final/15 text-pos-product-final"
            : "bg-pos-product-reventa/15 text-pos-product-reventa"
        )}
      >
        {product.type === "final" ? "Final" : "Reventa"}
      </span>

      {/* Product info */}
      <h3 className="mt-1 font-semibold text-card-foreground line-clamp-2 pr-16">
        {product.name}
      </h3>
      
      <p className="mt-1 text-xs text-muted-foreground">{product.category}</p>
      
      <p className="mt-0.5 text-xs text-muted-foreground font-mono">
        SKU: {product.sku}
      </p>

      <div className="mt-auto pt-3 flex items-end justify-between">
        <div>
          <p className="text-lg font-bold text-card-foreground">
            ${product.price.toFixed(2)}
          </p>
          <p
            className={cn(
              "text-xs font-medium",
              isLowStock ? "text-pos-stock-low" : "text-pos-stock-ok"
            )}
          >
            {product.stock} en stock
          </p>
        </div>
        
        <button 
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(product);
          }}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
