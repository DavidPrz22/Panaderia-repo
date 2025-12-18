import { Package } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "./POSProductCard";
import { CategoryFilter } from "./POSCategoryFilter.tsx";
import { useState } from "react";
import { POSProductPanelSearch } from "./POSProductPanelSearch.tsx";
import { POSProductPanelTypeSelect } from "./POSProductPanelTypeSelect.tsx";

export type POSProductPanelProps = {
    
}

export const POSProductPanel = () => {
    const [productType, setProductType] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [currentCategories, setCurrentCategories] = useState<Category[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const { data: categorias } = useCategoriasQuery();
    
    const addToCart = (product: Product) => {
        console.log(product);
    }

    return (
        <div className="flex flex-1 flex-col p-6">
          {/* Search bar */}
          <POSProductPanelSearch />    

          {/* Type selector and category filters */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <POSProductPanelTypeSelect />
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
    )
}
