import React, { createContext, useContext  } from "react";
import type { ComponentesLista, ProductionType, componentesRecetaProducto, componentesSearchItem, componentesSearchList } from "@/features/Production/types/types";
import { useState, useRef } from "react";

type ProductionContextType = {
    productType: ProductionType | null;
    setProductType: (value: ProductionType | null) => void;
    productSearchRef: React.RefObject<HTMLInputElement | null>;
    isFocused: boolean;
    setIsFocused: (value: boolean) => void;
    searchQuery: string | null;
    setSearchQuery: (value: string | null) => void;
    productionComponentes: componentesRecetaProducto | null;
    setProductionComponentes: (value: componentesRecetaProducto | null) => void;
    productoId: number | null;
    setProductoId: (value: number | null) => void;
    showSearch: boolean;
    setShowSearch: (value: boolean) => void;
    showProductionRegistros: boolean;
    setShowProductionRegistros: (value: boolean) => void;
    isClosingModal: boolean;
    setIsClosingModal: (value: boolean) => void;
    insufficientStock: ComponentesLista | null;
    setInsufficientStock: (value: ComponentesLista | null) => void;
    showNewComponentModal: boolean;
    setShowNewComponentModal: (value: boolean) => void;
    componentSearchList: componentesSearchList[];
    setComponentSearchList: (value: componentesSearchList[]) => void;
    newComponentSelected: componentesSearchItem | null;
    setNewComponentSelected: (value: componentesSearchItem | null) => void;
    showComponentSearch: boolean;
    setShowComponentSearch: (value: boolean) => void;
};

const ProductionContextProvider = createContext<ProductionContextType | null>(null);

export function ProductionProvider({ children }: { children: React.ReactNode }) {

  const [productType, setProductType] = useState<ProductionType | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [productionComponentes, setProductionComponentes] = useState<componentesRecetaProducto | null>(null);
  const [productoId, setProductoId] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const productSearchRef = useRef<HTMLInputElement | null>(null);
  const [insufficientStock, setInsufficientStock] = useState<ComponentesLista | null>(null);
  const [showProductionRegistros, setShowProductionRegistros] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [showNewComponentModal, setShowNewComponentModal] = useState<boolean>(false);
  const [componentSearchList, setComponentSearchList] = useState<componentesSearchList[]>([]);
  const [newComponentSelected, setNewComponentSelected] = useState<componentesSearchItem | null>(null);
  const [showComponentSearch, setShowComponentSearch] = useState<boolean>(false);

  return (
    <ProductionContextProvider.Provider value={{
      productType,
      setProductType,
      productSearchRef,
      isFocused,
      setIsFocused,
      searchQuery,
      setSearchQuery,
      productionComponentes,
      setProductionComponentes,
      productoId,
      setProductoId,
      showSearch,
      setShowSearch,
      showProductionRegistros,
      setShowProductionRegistros,
      isClosingModal,
      setIsClosingModal,
      insufficientStock,
      setInsufficientStock,
      showNewComponentModal,
      setShowNewComponentModal,
      componentSearchList,
      setComponentSearchList,
      newComponentSelected,
      setNewComponentSelected,
      showComponentSearch,
      setShowComponentSearch,
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
