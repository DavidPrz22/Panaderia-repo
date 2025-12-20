import { CategoryFilter } from "./POSCategoryFilter.tsx";
import { useState } from "react";
import { POSProductPanelSearch } from "./POSProductPanelSearch.tsx";
import { POSProductPanelTypeSelect } from "./POSProductPanelTypeSelect.tsx";
import { POSProductPanelGrid } from "./POSProductPanelGrid.tsx";


export const POSProductPanel = () => {
    const [productType, setProductType] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [products, setProducts] = useState<[]>([]);
    const [currentCategories, setCurrentCategories] = useState<[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<[]>([]);
    
    return (
        <div className="flex flex-1 flex-col p-6">
          {/* Search bar */}
          <POSProductPanelSearch />    

          {/* Type selector and category filters */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <POSProductPanelTypeSelect />
            <div className="h-6 w-px bg-border" />
            <CategoryFilter />
          </div>

          {/* Products grid */}
          <POSProductPanelGrid />
        </div>
    )
}
