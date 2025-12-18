import { CartItem } from "./POSCartItem.tsx";
import { ShoppingBag } from "lucide-react";
import { usePOSContext } from "@/context/POSContext";

export const POSCartPanelCartItems = () => {

    const { carrito, setCarrito } = usePOSContext();

    const itemCount = carrito.reduce((total, item) => total + item.cantidad, 0);

    const updateQuantity = (id: number, quantity: number) => {
      const updatedCart = carrito.map((item) =>
        item.id === id ? { ...item, cantidad: quantity } : item
      );
      setCarrito(updatedCart);
    };

    const removeFromCart = (id: number) => {
      const updatedCart = carrito.filter((item) => item.id !== id);
      setCarrito(updatedCart);
    };

    return (
        <div className="flex-1 overflow-auto p-4 scrollbar-thin">
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Productos ({itemCount})
              </span>
            </div>

            {carrito.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">
                  El carrito está vacío
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Selecciona productos para agregar
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {carrito.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity)}
                    onRemove={(id) => removeFromCart(id)}
                  />
                ))}
              </div>
            )}
          </div>
    )
}