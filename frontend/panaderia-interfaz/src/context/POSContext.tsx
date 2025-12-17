import { createContext, useContext, useState } from "react";

type POSContextType = {
    POSEnabled: boolean;
    setPOSEnabled: (value: boolean) => void;
    openPOS: boolean;
    setOpenPOS: (value: boolean) => void;
};

const POSContextProvider = createContext<POSContextType | null>(null);

export function POSProvider({ children }: { children: React.ReactNode }) {

  const [POSEnabled, setPOSEnabled] = useState<boolean>(false);
  const [openPOS, setOpenPOS] = useState<boolean>(false);
  return (
    <POSContextProvider.Provider value={{
      POSEnabled,
      setPOSEnabled,
      openPOS,
      setOpenPOS,
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
