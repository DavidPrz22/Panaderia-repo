import React, { createContext, useContext  } from "react";
import type { ComponentesLista, ProductionType, componentesRecetaProducto, componentesSearchList, newComponentItem, searchItem } from "@/features/Production/types/types";
import { useState, useRef } from "react";

type ProductionContextType = {
    productType: ProductionType | null;
    setProductType: (value: ProductionType | null) => void;
    selectedProduct: searchItem | null;
    setSelectedProduct: (value: searchItem | null) => void;
    productionComponentes: componentesRecetaProducto | null;
    setProductionComponentes: (value: componentesRecetaProducto | null) => void;
    productoId: number | null;
    setProductoId: (value: number | null) => void;
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
    newComponentSelected: newComponentItem | null;
    setNewComponentSelected: (value: newComponentItem | null) => void;
    showComponentSearch: boolean;
    setShowComponentSearch: (value: boolean) => void;
    invalidCantidadError: boolean | null;
    setInvalidCantidadError: (value: boolean | null) => void;
    componentesBaseProduccion: ComponentesLista;
    setComponentesBaseProduccion: React.Dispatch<React.SetStateAction<ComponentesLista>>;
    showToast: boolean;
    setShowToast: (value: boolean) => void;
    toastMessage: string;
    setToastMessage: (value: string) => void;
    productUnitRef: React.RefObject<HTMLDivElement | null>;
    medidaFisica: "UNIDAD" | "PESO" | "VOLUMEN" | null;
    setMedidaFisica: (value: "UNIDAD" | "PESO" | "VOLUMEN" | null) => void;
    esPorUnidad: boolean | null;
    setEsPorUnidad: (value: boolean | null) => void;
    detailPage: number;
    setDetailPage: (value: number) => void;
};

const ProductionContextProvider = createContext<ProductionContextType | null>(null);

export function ProductionProvider({ children }: { children: React.ReactNode }) {

  const [productType, setProductType] = useState<ProductionType | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<searchItem | null>(null);
  const [productionComponentes, setProductionComponentes] = useState<componentesRecetaProducto | null>(null);
  const [productoId, setProductoId] = useState<number | null>(null);
  
  const [insufficientStock, setInsufficientStock] = useState<ComponentesLista | null>(null);
  const [showProductionRegistros, setShowProductionRegistros] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [showNewComponentModal, setShowNewComponentModal] = useState<boolean>(false);
  const [componentSearchList, setComponentSearchList] = useState<componentesSearchList[]>([]);
  const [newComponentSelected, setNewComponentSelected] = useState<newComponentItem | null>(null);
  const [showComponentSearch, setShowComponentSearch] = useState<boolean>(false);
  const [invalidCantidadError, setInvalidCantidadError] = useState<boolean | null>(null);
  const [componentesBaseProduccion, setComponentesBaseProduccion] = useState<ComponentesLista>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const productUnitRef = useRef<HTMLDivElement | null>(null);
  const [medidaFisica, setMedidaFisica] = useState<"UNIDAD" | "PESO" | "VOLUMEN" | null>(null);
  const [esPorUnidad, setEsPorUnidad] = useState<boolean | null>(null);
  const [detailPage, setDetailPage] = useState<number>(1);
  return (
    <ProductionContextProvider.Provider value={{
      productType,
      setProductType,
      selectedProduct,
      setSelectedProduct,
      productionComponentes,
      setProductionComponentes,
      productoId,
      setProductoId,
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
      invalidCantidadError,
      setInvalidCantidadError,
      componentesBaseProduccion,
      setComponentesBaseProduccion,
      showToast,
      setShowToast,
      toastMessage,
      setToastMessage,
      productUnitRef,
      medidaFisica,
      setMedidaFisica,
      esPorUnidad,
      setEsPorUnidad,
      detailPage,
      setDetailPage,
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
