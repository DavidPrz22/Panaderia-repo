import { createContext, useContext, useRef, useState } from "react";
import type { CategoriaProductoIntermedio, childrenProp, ProductosIntermediosDetalles, recetasSearchItem, UnidadesDeMedida } from "@/features/ProductosIntermedios/types/types";

type ProductosIntermediosContextType = {
    showProductosIntermediosForm: boolean;
    setShowProductosIntermediosForm: (value: boolean) => void;
    showProductosIntermediosDetalles: boolean;
    setShowProductosIntermediosDetalles: (value: boolean) => void;
    updateRegistro: boolean;
    setUpdateRegistro: (value: boolean) => void;
    registroDelete: boolean;
    setRegistroDelete: (value: boolean) => void;
    productoIntermedioId: number | null;
    setProductoIntermedioId: (value: number | null) => void;
    searchList: recetasSearchItem[];
    setSearchList: (value: recetasSearchItem[]) => void;
    searchTimer: NodeJS.Timeout | null;
    setSearchTimer: (value: NodeJS.Timeout | null) => void;
    recetaSearchInputRef: React.RefObject<HTMLInputElement | null>;
    unidadesMedida: UnidadesDeMedida[];
    setUnidadesMedida: (value: UnidadesDeMedida[]) => void;
    categoriasProductoIntermedio: CategoriaProductoIntermedio[];
    setCategoriasProductoIntermedio: (value: CategoriaProductoIntermedio[]) => void;
    productoIntermediosDetalles: ProductosIntermediosDetalles | null;
    setProductoIntermediosDetalles: (value: ProductosIntermediosDetalles | null) => void;
    isLoadingDetalles: boolean;
    setIsLoadingDetalles: (value: boolean) => void;
    enabledDetalles: boolean;
    setEnabledDetalles: (value: boolean) => void;
};

const ProductosIntermediosContext = createContext<ProductosIntermediosContextType | null>(null);

export const ProductosIntermediosProvider = ({ children }: childrenProp) => {

    const [showProductosIntermediosForm, setShowProductosIntermediosForm] = useState(false);
    const [showProductosIntermediosDetalles, setShowProductosIntermediosDetalles] = useState(false);
    const [updateRegistro, setUpdateRegistro] = useState(false);
    const [registroDelete, setRegistroDelete] = useState(false);

    const [productoIntermedioId, setProductoIntermedioId] = useState<number | null>(null);
    const [enabledDetalles, setEnabledDetalles] = useState(false);
    const [searchList, setSearchList] = useState<recetasSearchItem[]>([]);
    const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

    const recetaSearchInputRef = useRef<HTMLInputElement | null>(null);

    const [unidadesMedida, setUnidadesMedida] = useState<UnidadesDeMedida[]>([]);
    const [categoriasProductoIntermedio, setCategoriasProductoIntermedio] = useState<CategoriaProductoIntermedio[]>([]);

    const [productoIntermediosDetalles, setProductoIntermediosDetalles] = useState<ProductosIntermediosDetalles | null>(null);
    
    const [isLoadingDetalles, setIsLoadingDetalles] = useState(false);

  return <ProductosIntermediosContext.Provider value={{
    showProductosIntermediosForm,
    setShowProductosIntermediosForm,
    showProductosIntermediosDetalles,
    setShowProductosIntermediosDetalles,
    updateRegistro,
    setUpdateRegistro,
    registroDelete,
    setRegistroDelete,
    productoIntermedioId,
    setProductoIntermedioId,
    searchList,
    setSearchList,
    searchTimer,
    setSearchTimer,
    recetaSearchInputRef,
    unidadesMedida,
    setUnidadesMedida,
    categoriasProductoIntermedio,
    setCategoriasProductoIntermedio,
    productoIntermediosDetalles,
    setProductoIntermediosDetalles,
    isLoadingDetalles,
    setIsLoadingDetalles,
    enabledDetalles,
    setEnabledDetalles
  }}>{children}</ProductosIntermediosContext.Provider>;
};

export const useProductosIntermediosContext = () => {
    const context = useContext(ProductosIntermediosContext);
    if (!context) throw new Error ('Component must be within ProductosIntermediosProvider');
    return context;
};