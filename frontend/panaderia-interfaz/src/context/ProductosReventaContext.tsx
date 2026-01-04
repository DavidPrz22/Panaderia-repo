import { createContext, useContext, useState } from "react";
import type {
  CategoriaProductosReventa,
  childrenProp,
  LotesProductosReventa,
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
  enabledDetalles: boolean;
  setEnabledDetalles: (value: boolean) => void;
  // Search & filters for productos reventa list
  productosReventaSearchTerm: string;
  setProductosReventaSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategoriasReventa: string[];
  setSelectedCategoriasReventa: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUnidadesInventario: string[];
  setSelectedUnidadesInventario: React.Dispatch<React.SetStateAction<string[]>>;
  showPRFiltersPanel: boolean;
  setShowPRFiltersPanel: React.Dispatch<React.SetStateAction<boolean>>;
  bajoStockFilter: boolean;
  setBajoStockFilter: (value: boolean) => void;
  agotadosFilter: boolean;
  setAgotadosFilter: (value: boolean) => void;
  // Lot management
  showPRLotesForm: boolean;
  setShowPRLotesForm: (value: boolean) => void;
  showPRLotesDetalles: boolean;
  setShowPRLotesDetalles: (value: boolean) => void;
  lotesProductosReventaDetalles: LotesProductosReventa | null;
  setLotesProductosReventaDetalles: (value: LotesProductosReventa | null) => void;
  updateLoteRegistro: boolean;
  setUpdateLoteRegistro: (value: boolean) => void;
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

  // Search & filters state
  const [productosReventaSearchTerm, setProductosReventaSearchTerm] = useState("");
  const [selectedCategoriasReventa, setSelectedCategoriasReventa] = useState<string[]>([]);
  const [selectedUnidadesInventario, setSelectedUnidadesInventario] = useState<string[]>([]);
  const [showPRFiltersPanel, setShowPRFiltersPanel] = useState(false);
  const [bajoStockFilter, setBajoStockFilter] = useState(false);
  const [agotadosFilter, setAgotadosFilter] = useState(false);

  // Lot management state
  const [showPRLotesForm, setShowPRLotesForm] = useState(false);
  const [showPRLotesDetalles, setShowPRLotesDetalles] = useState(false);
  const [lotesProductosReventaDetalles, setLotesProductosReventaDetalles] = useState<LotesProductosReventa | null>(null);
  const [updateLoteRegistro, setUpdateLoteRegistro] = useState(false);

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
        enabledDetalles,
        setEnabledDetalles,
        productosReventaSearchTerm,
        setProductosReventaSearchTerm,
        selectedCategoriasReventa,
        setSelectedCategoriasReventa,
        selectedUnidadesInventario,
        setSelectedUnidadesInventario,
        showPRFiltersPanel,
        setShowPRFiltersPanel,
        bajoStockFilter,
        setBajoStockFilter,
        agotadosFilter,
        setAgotadosFilter,
        showPRLotesForm,
        setShowPRLotesForm,
        showPRLotesDetalles,
        setShowPRLotesDetalles,
        lotesProductosReventaDetalles,
        setLotesProductosReventaDetalles,
        updateLoteRegistro,
        setUpdateLoteRegistro,
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