import { createContext, useContext, useState } from "react";
  
  type DashBoardContextType = {
    showNotificaciones: boolean;
    setShowNotificaciones: (show: boolean) => void;
  };
  
  const DashBoardContext = createContext<DashBoardContextType | null>(null);
  
  export const useDashBoardContext = () => {
    const context = useContext(DashBoardContext);
    if (!context) {
      throw new Error("useDashBoardContext must be used within a DashBoardProvider");
    }
    return context;
  };
  
  export const DashBoardProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const [showNotificaciones, setShowNotificaciones] = useState(false);
    return (
      <DashBoardContext.Provider
        value={{
          showNotificaciones,
          setShowNotificaciones,
        }}
      >
        {children}
      </DashBoardContext.Provider>
    );
  };
  