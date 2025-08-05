import type { recetasSearchList } from "@/features/Recetas/types/types";
import { createContext, useContext, useState, useRef } from "react";
import type { componenteListadosReceta } from "@/features/Recetas/types/types";

type RecetasContextType = {
  showRecetasDetalles: boolean;
  setShowRecetasDetalles: (show: boolean) => void;
  recetaId: number | null;
  setRecetaId: (id: number | null) => void;
  showRecetasForm: boolean;
  setShowRecetasForm: (show: boolean) => void;
  updateRegistro: boolean;
  setUpdateRegistro: (update: boolean) => void;
  registroDelete: boolean | null;
  setRegistroDelete: (registroDelete: boolean | null) => void;
  searchListRecetasRef: React.RefObject<HTMLInputElement | null>;
  searchListActiveRecetas: boolean;
  setSearchListActiveRecetas: (active: boolean) => void;
  searchListItems: recetasSearchList[];
  setSearchListItems: (items: recetasSearchList[]) => void;
  timer: NodeJS.Timeout | null;
  setTimer: (timer: NodeJS.Timeout | null) => void;
  componentesListadosReceta: componenteListadosReceta[];
  setComponentesListadosReceta: (componentes: componenteListadosReceta[]) => void;
};

const RecetasContext = createContext<RecetasContextType | null>(null);

export const useRecetasContext = () => {
  const context = useContext(RecetasContext);
  if (!context) {
    throw new Error("useRecetasContext must be used within a RecetasProvider");
  }
  return context;
};

export const RecetasProvider = ({ children }: { children: React.ReactNode }) => {
  const [showRecetasDetalles, setShowRecetasDetalles] = useState(false);
  const [showRecetasForm, setShowRecetasForm] = useState(false);
  const [recetaId, setRecetaId] = useState<number | null>(null);
  const [updateRegistro, setUpdateRegistro] = useState(false);
  const [registroDelete, setRegistroDelete] = useState<boolean | null>(null);

  const searchListRecetasRef = useRef<HTMLInputElement | null>(null);
  const [searchListActiveRecetas, setSearchListActiveRecetas] = useState(false);

  const [searchListItems, setSearchListItems] = useState<recetasSearchList[]>([]);
  
  const [componentesListadosReceta, setComponentesListadosReceta] = useState<componenteListadosReceta[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);


  return <RecetasContext.Provider value={{ 
    showRecetasDetalles, setShowRecetasDetalles, 
    recetaId, setRecetaId,
    showRecetasForm, setShowRecetasForm,
    updateRegistro, setUpdateRegistro,
    registroDelete, setRegistroDelete,
    searchListRecetasRef,
    searchListActiveRecetas, setSearchListActiveRecetas,
    searchListItems, setSearchListItems,
    timer, setTimer,
    componentesListadosReceta, setComponentesListadosReceta,
  }}>{children}</RecetasContext.Provider>;
};