import React, { createContext, useContext  } from "react";
import type { ProductionType } from "@/features/Production/types/types";
import { useState, useRef } from "react";
type ProductionContextType = {
    productType: ProductionType | null;
    setProductType: (value: ProductionType | null) => void;
    productSearchRef: React.RefObject<HTMLInputElement | null>;
    isFocused: boolean;
    setIsFocused: (value: boolean) => void;
    searchQuery: string | null;
    setSearchQuery: (value: string | null) => void;
};

const ProductionContextProvider = createContext<ProductionContextType | null>(null);

export function ProductionProvider({ children }: { children: React.ReactNode }) {

  const [productType, setProductType] = useState<ProductionType | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const productSearchRef = useRef<HTMLInputElement | null>(null);
  
  return (
    <ProductionContextProvider.Provider value={{
      productType,
      setProductType,
      productSearchRef,
      isFocused,
      setIsFocused,
      searchQuery,
      setSearchQuery
    }}>
        {children}
    </ProductionContextProvider.Provider>
    );
}

export function useProductionContext() {
  const context = useContext(ProductionContextProvider);
  if (!context)
    throw new Error("Component must be within ProductionProvider");
  return context;
}
