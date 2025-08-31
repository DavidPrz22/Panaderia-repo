import React, { createContext, useContext  } from "react";

type ProductionContextType = {
    
};

const ProductionContextProvider = createContext<ProductionContextType | null>(null);

export function ProductionProvider({ children }: { children: React.ReactNode }) {

    return (
    <ProductionContextProvider.Provider value={{}}>
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
