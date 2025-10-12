import type { LotesProductosFinales, receta_relacionada, recetasSearchItem } from "@/features/ProductosFinales/types/types";
import { createContext, useContext, useState, useRef } from "react";
import type { CategoriaProductoFinal } from "@/features/ProductosFinales/types/types";
import type { UnidadesDeMedida } from "@/features/ProductosFinales/types/types";
import type { ProductoFinalDetalles } from "@/features/ProductosFinales/types/types";

type ProductosFinalesContextType = {
  showProductoDetalles: boolean;
  setShowProductoDetalles: (show: boolean) => void;
  productoId: number | null;
  setProductoId: (id: number | null) => void;
  showProductoForm: boolean;
  setShowProductoForm: (show: boolean) => void;
  updateRegistro: boolean;
  setUpdateRegistro: (update: boolean) => void;
  registroDelete: boolean | null;
  setRegistroDelete: (registroDelete: boolean | null) => void;
  searchListRecetaListRef: React.RefObject<HTMLInputElement | null>;
  searchListRecetaList: receta_relacionada[];
  setSearchListRecetaList: (recetaList: receta_relacionada[]) => void;
  isLoadingDetalles: boolean;
  setIsLoadingDetalles: (loading: boolean) => void;
  enabledProductoDetalles: boolean;
  setEnabledProductoDetalles: (enable: boolean) => void;
  unidadesMedida: UnidadesDeMedida[];
  setUnidadesMedida: (unidades: UnidadesDeMedida[]) => void;
  categoriasProductoFinal: CategoriaProductoFinal[];
  setCategoriasProductoFinal: (categorias: CategoriaProductoFinal[]) => void;
  searchList: recetasSearchItem[];
  setSearchList: (searchList: recetasSearchItem[]) => void;
  recetaSearchInputRef: React.RefObject<HTMLInputElement | null>;
  searchTimer: NodeJS.Timeout | null;
  setSearchTimer: (timer: NodeJS.Timeout | null) => void;
  productoDetalles: ProductoFinalDetalles | null;
  setProductoDetalles: (detalles: ProductoFinalDetalles | null) => void;
  deleteRecetaRelacionada: boolean;
  setDeleteRecetaRelacionada: (deleteReceta: boolean) => void;
  // Search & filter state for productos finales list
  productosFinalesSearchTerm: string;
  setProductosFinalesSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedUnidadesVenta: string[]; // store unidad_venta strings
  setSelectedUnidadesVenta: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategoriasProductoFinal: string[]; // store categoria strings
  setSelectedCategoriasProductoFinal: React.Dispatch<React.SetStateAction<string[]>>;
  showFiltersPanel: boolean;
  setShowFiltersPanel: React.Dispatch<React.SetStateAction<boolean>>;
  showLotesDetalles: boolean;
  setShowLotesDetalles: (value: boolean) => void;
  lotesProductosFinalesDetalles: LotesProductosFinales | null;
  setLotesProductosFinalesDetalles: (value: LotesProductosFinales | null) => void;
};

const ProductosFinalesContextProvider = createContext<ProductosFinalesContextType | null>(null);

export const useProductosFinalesContext = () => {
  const context = useContext(ProductosFinalesContextProvider);
  if (!context) {
    throw new Error("useProductosFinalesContext must be used within a ProductosFinalesProvider");
  }
  return context;
};

export const ProductosFinalesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showProductoDetalles, setShowProductoDetalles] = useState(false);
  const [showProductoForm, setShowProductoForm] = useState(false);
  const [productoId, setProductoId] = useState<number | null>(null);
  const [updateRegistro, setUpdateRegistro] = useState(false);
  const [registroDelete, setRegistroDelete] = useState<boolean | null>(null);
  const [showLotesDetalles, setShowLotesDetalles] = useState(false);
  const [lotesProductosFinalesDetalles, setLotesProductosFinalesDetalles] = useState<LotesProductosFinales | null>(null);

  const searchListRecetaListRef = useRef<HTMLInputElement | null>(null);
  const [searchListRecetaList, setSearchListRecetaList] = useState<receta_relacionada[]>(
    [],
  );

  const [searchList, setSearchList] = useState<recetasSearchItem[]>([]);
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
  
  const recetaSearchInputRef = useRef<HTMLInputElement | null>(null);
  const [productoDetalles, setProductoDetalles] = useState<ProductoFinalDetalles | null>(null);
  
  const [isLoadingDetalles, setIsLoadingDetalles] =
    useState<boolean>(false);

  const [enabledProductoDetalles, setEnabledProductoDetalles] =
    useState<boolean>(false);

  const [unidadesMedida, setUnidadesMedida] = useState<UnidadesDeMedida[]>([]);
  const [categoriasProductoFinal, setCategoriasProductoFinal] =
    useState<CategoriaProductoFinal[]>([]);

  const [deleteRecetaRelacionada, setDeleteRecetaRelacionada] =
    useState<boolean>(false);

  // Search & filters state
  const [productosFinalesSearchTerm, setProductosFinalesSearchTerm] = useState<string>("");
  const [selectedUnidadesVenta, setSelectedUnidadesVenta] = useState<string[]>([]);
  const [selectedCategoriasProductoFinal, setSelectedCategoriasProductoFinal] = useState<string[]>([]);
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);

  return (
    <ProductosFinalesContextProvider.Provider
      value={{
        showProductoDetalles,
        setShowProductoDetalles,
        productoId,
        setProductoId,
        showProductoForm,
        setShowProductoForm,
        updateRegistro,
        setUpdateRegistro,
        registroDelete,
        setRegistroDelete,
        isLoadingDetalles,
        setIsLoadingDetalles,
        enabledProductoDetalles,
        setEnabledProductoDetalles,
        searchListRecetaListRef,
        searchListRecetaList,
        setSearchListRecetaList,
        unidadesMedida,
        setUnidadesMedida,
        categoriasProductoFinal,
        setCategoriasProductoFinal,
        searchList,
        setSearchList,
        recetaSearchInputRef,
        searchTimer,
        setSearchTimer,
        productoDetalles,
        setProductoDetalles,
        deleteRecetaRelacionada,
        setDeleteRecetaRelacionada,
        productosFinalesSearchTerm,
        setProductosFinalesSearchTerm,
        selectedUnidadesVenta,
        setSelectedUnidadesVenta,
        selectedCategoriasProductoFinal,
        setSelectedCategoriasProductoFinal,
        showFiltersPanel,
        setShowFiltersPanel,
        showLotesDetalles,
        setShowLotesDetalles,
        lotesProductosFinalesDetalles,
        setLotesProductosFinalesDetalles,
      }}
    >
      {children}
    </ProductosFinalesContextProvider.Provider>
  );
};
