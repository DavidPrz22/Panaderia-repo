import type { OrdenCompra } from "@/features/Compras/types/types";
import { createContext, useContext, useState } from "react";
  
  type ComprasContextType = {
    ordenCompra: OrdenCompra | null;
    setOrdenCompra: (ordenCompra: OrdenCompra | null) => void;
    compraSeleccionadaId: number | null;
    setCompraSeleccionadaId: (id: number | null) => void;
    showOrdenCompraDetalles: boolean;
    setShowOrdenCompraDetalles: (show: boolean) => void;
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
    const [ordenCompra, setOrdenCompra] = useState<OrdenCompra | null>(null);
    const [compraSeleccionadaId, setCompraSeleccionadaId] = useState<number | null>(null);
    const [showOrdenCompraDetalles, setShowOrdenCompraDetalles] = useState(false);
    const [showReferenciaPagoDialog, setShowReferenciaPagoDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    
    return (
      <ComprasContext.Provider
        value={{
          ordenCompra,
          setOrdenCompra,
          compraSeleccionadaId,
          setCompraSeleccionadaId,
          showOrdenCompraDetalles,
          setShowOrdenCompraDetalles,
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
  