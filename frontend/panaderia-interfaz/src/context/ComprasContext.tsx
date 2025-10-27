import type { Orden } from "@/features/Ordenes/types/types";
import { createContext, useContext, useState } from "react";
  
  type ComprasContextType = {
    compras: Orden[];
    setCompras: (compras: Orden[]) => void;
    compraSeleccionadaId: number | null;
    setCompraSeleccionadaId: (id: number | null) => void;
    showCompraDetalles: boolean;
    setShowCompraDetalles: (show: boolean) => void;
    showReferenciaPagoDialog: boolean;
    setShowReferenciaPagoDialog: (show: boolean) => void;
    showCancelDialog: boolean;
    setShowCancelDialog: (show: boolean) => void;
    showForm: boolean;
    setShowForm: (show: boolean) => void;
  };
  
  const ComprasContext = createContext<ComprasContextType | null>(null);
  
  export const useComprasContext = () => {
    const context = useContext(ComprasContext);
    if (!context) {
      throw new Error("useComprasContext must be used within a ComprasProvider");
    }
    return context;
  };
  
  export const ComprasProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [showForm, setShowForm] = useState(false);
    const [compras, setCompras] = useState<Orden[]>([]);
    const [compraSeleccionadaId, setCompraSeleccionadaId] = useState<number | null>(null);
    const [showCompraDetalles, setShowCompraDetalles] = useState(false);
    const [showReferenciaPagoDialog, setShowReferenciaPagoDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    
    return (
      <ComprasContext.Provider
        value={{
          compras,
          setCompras,
          compraSeleccionadaId,
          setCompraSeleccionadaId,
          showCompraDetalles,
          setShowCompraDetalles,
          showReferenciaPagoDialog,
          setShowReferenciaPagoDialog,
          showCancelDialog,
          setShowCancelDialog,
          showForm,
          setShowForm,
        }}
      >
        {children}
      </ComprasContext.Provider>
    );
  };
  