import { createContext, useContext, useState } from "react";

type ReportView = "menu" | "materias-primas" | "productos-finales" | "productos-intermedios" | "productos-reventa" | "ventas";

type ReportesContextType = {
    currentView: ReportView;
    setCurrentView: (view: ReportView) => void;
};

const ReportesContext = createContext<ReportesContextType | null>(null);

export const useReportesContext = () => {
    const context = useContext(ReportesContext);
    if (!context) {
        throw new Error("useReportesContext must be used within a ReportesProvider");
    }
    return context;
};

export const ReportesProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentView, setCurrentView] = useState<ReportView>("menu");

    return (
        <ReportesContext.Provider value={{ currentView, setCurrentView }}>
            {children}
        </ReportesContext.Provider>
    );
};
