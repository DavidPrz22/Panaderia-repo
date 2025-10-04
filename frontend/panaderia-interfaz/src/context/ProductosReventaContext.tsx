import { createContext, useContext, useState } from "react";
import type {
  CategoriaProductosReventa,
  childrenProp,
  Proveedor,
  UnidadesDeMedida,
} from "@/features/ProductosReventa/types/types";

type ProductosReventaContextType = {
  showProductosReventaForm: boolean;
  setShowProductosReventaForm: (value: boolean) => void;
  showProductosReventaDetalles: boolean;
  setShowProductosReventaDetalles: (value: boolean) => void;
  updateRegistro: boolean;
  setUpdateRegistro: (value: boolean) => void;
  registroDelete: boolean;
  setRegistroDelete: (value: boolean) => void;
  productoReventaId: number | null;
  setProductoReventaId: (value: number | null) => void;
  unidadesMedida: UnidadesDeMedida[];
  setUnidadesMedida: (value: UnidadesDeMedida[]) => void;
  categoriasProductosReventa: CategoriaProductosReventa[];
  setCategoriasProductosReventa: (value: CategoriaProductosReventa[]) => void;
  proveedores: Proveedor[];
  setProveedores: (value: Proveedor[]) => void;
  isLoadingDetalles: boolean;
  setIsLoadingDetalles: (value: boolean) => void;
  enabledDetalles: boolean;
  setEnabledDetalles: (value: boolean) => void;
  // Search & filters for productos reventa list
  productosReventaSearchTerm: string;
  setProductosReventaSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategoriasReventa: string[];
  setSelectedCategoriasReventa: React.Dispatch<React.SetStateAction<string[]>>;
  showPRFiltersPanel: boolean;
  setShowPRFiltersPanel: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductosReventaContext =
  createContext<ProductosReventaContextType | null>(null);

export const ProductosReventaProvider = ({ children }: childrenProp) => {
  const [showProductosReventaForm, setShowProductosReventaForm] =
    useState(false);
  const [showProductosReventaDetalles, setShowProductosReventaDetalles] =
    useState(false);
  const [updateRegistro, setUpdateRegistro] = useState(false);
  const [registroDelete, setRegistroDelete] = useState(false);

  const [productoReventaId, setProductoReventaId] = useState<number | null>(
    null
  );
  const [enabledDetalles, setEnabledDetalles] = useState(false);

  const [unidadesMedida, setUnidadesMedida] = useState<UnidadesDeMedida[]>([]);
  const [categoriasProductosReventa, setCategoriasProductosReventa] =
    useState<CategoriaProductosReventa[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const [isLoadingDetalles, setIsLoadingDetalles] = useState(false);

  // Search & filters state
  const [productosReventaSearchTerm, setProductosReventaSearchTerm] = useState("");
  const [selectedCategoriasReventa, setSelectedCategoriasReventa] = useState<string[]>([]);
  const [showPRFiltersPanel, setShowPRFiltersPanel] = useState(false);

  return (
    <ProductosReventaContext.Provider
      value={{
        showProductosReventaForm,
        setShowProductosReventaForm,
        showProductosReventaDetalles,
        setShowProductosReventaDetalles,
        updateRegistro,
        setUpdateRegistro,
        registroDelete,
        setRegistroDelete,
        productoReventaId,
        setProductoReventaId,
        unidadesMedida,
        setUnidadesMedida,
        categoriasProductosReventa,
        setCategoriasProductosReventa,
        proveedores,
        setProveedores,
        isLoadingDetalles,
        setIsLoadingDetalles,
        enabledDetalles,
        setEnabledDetalles,
        productosReventaSearchTerm,
        setProductosReventaSearchTerm,
        selectedCategoriasReventa,
        setSelectedCategoriasReventa,
        showPRFiltersPanel,
        setShowPRFiltersPanel,
      }}
    >
      {children}
    </ProductosReventaContext.Provider>
  );
};

export const useProductosReventaContext = () => {
  const context = useContext(ProductosReventaContext);
  if (!context)
    throw new Error("Component must be within ProductosReventaProvider");
  return context;
};