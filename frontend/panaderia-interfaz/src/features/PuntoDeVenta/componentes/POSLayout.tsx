import { useState, useMemo } from "react";
import { Search, User, ShoppingBag, Trash2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard, type Product } from "./POSProductCard";
import { CartItem } from "./POSCartItem.tsx";
import { CategoryFilter } from "./POSCategoryFilter.tsx";
import { useToast } from "@/features/PuntoDeVenta/hooks/use-toast";
import { POSCartPanel } from "./POSCartPanel";
// import { CheckoutScreen } from "./checkout/POSCheckoutScreen.tsx";
import { useCategoriasQuery, useProductosQuery } from "../hooks/queries/queries";
// Mock data
const mockProducts: Product[] = [
  { id: "1", name: "Pan Integral Artesanal", category: "Panadería", sku: "PAN-001", type: "final", price: 45.00, stock: 24 },
  { id: "2", name: "Croissant de Mantequilla", category: "Panadería", sku: "PAN-002", type: "final", price: 35.00, stock: 18 },
  { id: "3", name: "Galletas de Avena", category: "Galletas", sku: "GAL-001", type: "final", price: 28.00, stock: 32 },
  { id: "4", name: "Harina de Trigo 1kg", category: "Ingredientes", sku: "ING-001", type: "reventa", price: 22.50, stock: 50 },
  { id: "5", name: "Azúcar Morena 500g", category: "Ingredientes", sku: "ING-002", type: "reventa", price: 18.00, stock: 45 },
  { id: "6", name: "Pastel de Chocolate", category: "Pasteles", sku: "PAS-001", type: "final", price: 280.00, stock: 5 },
  { id: "7", name: "Pastel de Tres Leches", category: "Pasteles", sku: "PAS-002", type: "final", price: 320.00, stock: 3 },
  { id: "8", name: "Empanada de Carne", category: "Salados", sku: "SAL-001", type: "final", price: 25.00, stock: 40 },
  { id: "9", name: "Queso Manchego 250g", category: "Lácteos", sku: "LAC-001", type: "reventa", price: 75.00, stock: 12 },
  { id: "10", name: "Mantequilla Sin Sal 200g", category: "Lácteos", sku: "LAC-002", type: "reventa", price: 45.00, stock: 20 },
  { id: "11", name: "Baguette Tradicional", category: "Panadería", sku: "PAN-003", type: "final", price: 32.00, stock: 15 },
  { id: "12", name: "Dona Glaseada", category: "Donas", sku: "DON-001", type: "final", price: 22.00, stock: 28 },
];

const mockClients = [
  { id: "1", name: "Público General" },
  { id: "2", name: "Juan Pérez" },
  { id: "3", name: "María García" },
  { id: "4", name: "Restaurante El Buen Sabor" },
  { id: "5", name: "Cafetería Central" },
];

const categoriesByType = {
  all: ["Panadería", "Galletas", "Pasteles", "Salados", "Donas", "Ingredientes", "Lácteos"],
  final: ["Panadería", "Galletas", "Pasteles", "Salados", "Donas"],
  reventa: ["Ingredientes", "Lácteos"],
};

export function POSLayout() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [productType, setProductType] = useState<"all" | "final" | "reventa">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState("1");
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const currentCategories = categoriesByType[productType];

  const { data: categorias } = useCategoriasQuery();
  const { data: productos } = useProductosQuery();

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesType = productType === "all" || product.type === productType;
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesCategory && matchesSearch;
    });
  }, [productType, selectedCategory, search]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({
      title: "Producto agregado",
      description: `${product.name} añadido al carrito`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    toast({
      title: "Carrito limpiado",
      description: "Se han eliminado todos los productos",
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos para continuar",
        variant: "destructive",
      });
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    setCart([]);
    setShowCheckout(false);
  };

  if (showCheckout) {
    return (
      // <CheckoutScreen
      //   items={cart}
      //   total={total}
      //   onBack={() => setShowCheckout(false)}
      //   onComplete={handleCheckoutComplete}
      // />
      <div>Checkout</div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">

      {/* Main content */}
      <div className="flex flex-1">
        {/* Cart Panel - Left side */}
        <div className="flex w-80 flex-col border-r border-border bg-card">
          {/* Client selector */}
          <div className="border-b border-border p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <User className="h-4 w-4" />
              Cliente
            </label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-auto p-4 scrollbar-thin">
            <div className="mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                Productos ({itemCount})
              </span>
            </div>

            {cart.length === 0 ? (
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
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Total and actions */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-foreground">
                ${total.toFixed(2)}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-12 text-base font-semibold"
              disabled={cart.length === 0}
            >
              Ir a Cobrar
            </Button>

            <Button
              onClick={clearCart}
              variant="outline"
              className="w-full"
              disabled={cart.length === 0}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Limpiar Orden
            </Button>
          </div>
        </div>

        {/* Products Panel - Right side */}
        <div className="flex flex-1 flex-col p-6">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos por nombre o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pl-10 text-base bg-card"
            />
          </div>

          {/* Type selector and category filters */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <Select
              value={productType}
              onValueChange={(value: "all" | "final" | "reventa") => {
                setProductType(value);
                setSelectedCategory(null);
              }}
            >
              <SelectTrigger className="w-48 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Productos</SelectItem>
                <SelectItem value="final">Producto Final</SelectItem>
                <SelectItem value="reventa">Producto de Reventa</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border" />

            <CategoryFilter
              categories={currentCategories}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {/* Products grid */}
          <div className="flex-1 overflow-auto scrollbar-thin">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No se encontraron productos
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  
}
