import { CartItem } from "./POSCartItem.tsx";
import { ShoppingBag } from "lucide-react";
import { usePOSContext } from "@/context/POSContext";
import type { WatchSetValue } from "../types/types.ts";
import { useEffect } from "react";

export const POSCartPanelCartItems = ({watch, setValue}: WatchSetValue) => {

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

    const handleCarritoUpdate = () => {
      const venta_detalles = carrito.map((item) => {
        return {
          producto_elaborado_id: item.tipo === 'final' ? item.id : null,
          producto_reventa_id: item.tipo === 'reventa' ? item.id : null,
          cantidad: item.cantidad,
          precio_unitario_usd: item.precio,
          subtotal_linea_usd: item.subtotal,
          precio_unitario_ves: Math.round((item.precio * watch!('tasa_cambio_aplicada')) * 100) / 100,
          subtotal_linea_ves: Math.round((item.subtotal * watch!('tasa_cambio_aplicada')) * 100) / 100,
        }
      })

      setValue!('venta_detalles', venta_detalles);
    }
    
    useEffect(() => {
      handleCarritoUpdate();
    }, [carrito])

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
                {carrito.map((item, index) => (
                  <CartItem
                    key={index}
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