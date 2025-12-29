import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { Producto } from '../types/types'
import { usePOSContext } from "@/context/POSContext";

interface ProductCardProps {
  product: Producto;
  onAdd: (product: Producto) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const isLowStock = product.stock <= 5;
  const { carrito, setCarrito } = usePOSContext();


  const handleAddProduct = (producto: Producto) => {
    const productoEnCarrito = carrito.find((item) => item.id === producto.id);
    if (productoEnCarrito) {
      const newCarrito = carrito.map((item) => {
        if (item.id === producto.id) {
          return {
            ...item,
            cantidad: item.cantidad + 1,
            subtotal: item.subtotal + producto.precio,
          };
        }
        return item;
      });
      setCarrito(newCarrito);
    } else {
      const newCarrito = [...carrito, { ...producto, cantidad: 1, subtotal: producto.precio, tipo: producto.tipo }];
      setCarrito(newCarrito)
    }
  }
  return (
    <div
      className="group font-[Roboto] relative flex flex-col rounded-lg border border-border p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/30 cursor-pointer animate-fade-in"
      onClick={() => handleAddProduct(product)}
    >
      {/* Type badge */}
      <span
        className={cn(
          "absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-medium",
          product.tipo === "final"
            ? "bg-(--pos-product-final)/15 text-(--pos-product-final)"
            : "bg-(--pos-product-reventa)/15 text-(--pos-product-reventa)"
        )}
      >
        {product.tipo === "final" ? "Final" : "Reventa"}
      </span>

      {/* Product info */}
      <h3 className="mt-1 font-semibold text-card-foreground line-clamp-2 pr-16">
        {product.nombre}
      </h3>

      <p className="mt-1 text-xs text-muted-foreground">{product.categoria}</p>

      <p className="mt-0.5 text-xs text-muted-foreground font-mono">
        SKU: {product.sku}
      </p>

      <div className="mt-auto pt-3 flex items-end justify-between">
        <div>
          <p className="text-lg font-bold text-card-foreground">
            ${product.precio.toFixed(2)}
          </p>
          <p
            className={cn(
              "text-xs font-medium",
              isLowStock ? "text-red-600" : "text-green-600"
            )}
          >
            {product.stock} en stock
          </p>
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:scale-110"
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
