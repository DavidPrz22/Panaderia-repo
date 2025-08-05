import { createContext, useContext, useState } from "react";
import type { childrenProp } from "@/features/ProductosIntermedios/types/types";

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
};

const ProductosIntermediosContext = createContext<ProductosIntermediosContextType | null>(null);

export const ProductosIntermediosProvider = ({ children }: childrenProp) => {

    const [showProductosIntermediosForm, setShowProductosIntermediosForm] = useState(false);
    const [showProductosIntermediosDetalles, setShowProductosIntermediosDetalles] = useState(false);
    const [updateRegistro, setUpdateRegistro] = useState(false);
    const [registroDelete, setRegistroDelete] = useState(false);
    const [productoIntermedioId, setProductoIntermedioId] = useState<number | null>(null);
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
  }}>{children}</ProductosIntermediosContext.Provider>;
};

export const useProductosIntermediosContext = () => {
    const context = useContext(ProductosIntermediosContext);
    if (!context) throw new Error ('Component must be within ProductosIntermediosProvider');
    return context;
};