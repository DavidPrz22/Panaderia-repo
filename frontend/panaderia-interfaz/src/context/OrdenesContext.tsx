import type { Orden } from "@/features/Ordenes/types/types";
import { createContext, useContext, useState } from "react";
  
  type OrdenesContextType = {
    ordenes: Orden[];
    setOrdenes: (ordenes: Orden[]) => void;
    ordenSeleccionadaId: number | null;
    setOrdenSeleccionadaId: (id: number | null) => void;
    showOrdenDetalles: boolean;
    setShowOrdenDetalles: (show: boolean) => void;
  };
  
  const OrdenesContext = createContext<OrdenesContextType | null>(null);
  
  export const useOrdenesContext = () => {
    const context = useContext(OrdenesContext);
    if (!context) {
      throw new Error("useOrdenesContext must be used within a OrdenesProvider");
    }
    return context;
  };
  
  export const OrdenesProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [ordenSeleccionadaId, setOrdenSeleccionadaId] = useState<number | null>(null);
    const [showOrdenDetalles, setShowOrdenDetalles] = useState(false);
    return (
      <OrdenesContext.Provider
        value={{
          ordenes,
          setOrdenes,
          ordenSeleccionadaId,
          setOrdenSeleccionadaId,
          showOrdenDetalles,
          setShowOrdenDetalles,
        }}
      >
        {children}
      </OrdenesContext.Provider>
    );
  };
  