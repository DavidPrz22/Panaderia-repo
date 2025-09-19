import { createContext, useContext, useRef, useState } from "react";
import { type childrenProp } from "../features/MateriaPrima/types/types";

type AppContextType = {
  // Global UI state
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  // Global loading state
  isGlobalLoading: boolean;
  setIsGlobalLoading: (value: boolean) => void;
  // Global error state
  globalError: string | null;
  setGlobalError: (value: string | null) => void;
  // Selected module
  selectedModule: string | null;
  setSelectedModule: (value: string | null) => void;
  // Dropdown card
  isOpenDropdownCard: boolean;
  setIsOpenDropdownCard: (value: boolean) => void;
  // Ref card
  refCard: React.RefObject<HTMLDivElement | null>;
  refDropdownCard: React.RefObject<HTMLDivElement | null>;
};

const AppContextProvider = createContext<AppContextType | null>(null);

export function AppProvider({ children }: childrenProp) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const [isOpenDropdownCard, setIsOpenDropdownCard] = useState(false);
  const refCard = useRef<HTMLDivElement | null>(null);
  const refDropdownCard = useRef<HTMLDivElement | null>(null);
  return (
    <AppContextProvider.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        isGlobalLoading,
        setIsGlobalLoading,
        globalError,
        setGlobalError,
        selectedModule,
        setSelectedModule,
        isOpenDropdownCard,
        setIsOpenDropdownCard,
        refCard,
        refDropdownCard,
      }}
    >
      {children}
    </AppContextProvider.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContextProvider);
  if (!context) throw new Error("Component must be within AppProvider");
  return context;
}
