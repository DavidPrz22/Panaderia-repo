import { createContext, useContext, useState } from "react";
import type { CarritoItem } from "../features/PuntoDeVenta/types/types";

type POSContextType = {
    POSEnabled: boolean;
    setPOSEnabled: (value: boolean) => void;
    openPOS: boolean;
    setOpenPOS: (value: boolean) => void;
    carrito: CarritoItem[];
    setCarrito: (value: CarritoItem[]) => void;
    search: string;
    setSearch: (value: string) => void;
    categoriaSeleccionada: string | null;
    setCategoriaSeleccionada: (value: string | null) => void;
    tipoProductoSeleccionado: string;
    setTipoProductoSeleccionado: (value: string) => void;
};

const POSContextProvider = createContext<POSContextType | null>(null);

export function POSProvider({ children }: { children: React.ReactNode }) {

  const [POSEnabled, setPOSEnabled] = useState<boolean>(false);
  const [openPOS, setOpenPOS] = useState<boolean>(false);
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [search, setSearch] = useState<string>("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [tipoProductoSeleccionado, setTipoProductoSeleccionado] = useState<string>("todos");
  
  return (
    <POSContextProvider.Provider value={{
      POSEnabled,
      setPOSEnabled,
      openPOS,
      setOpenPOS,
      carrito,
      setCarrito,
      search,
      setSearch,
      categoriaSeleccionada,
      setCategoriaSeleccionada,
      tipoProductoSeleccionado,
      setTipoProductoSeleccionado
      }}>
        {children}
    </POSContextProvider.Provider>
    );
}

export function usePOSContext() {
  const context = useContext(POSContextProvider);
  if (!context)
    throw new Error("Component must be within POSProvider");
  return context;
}
