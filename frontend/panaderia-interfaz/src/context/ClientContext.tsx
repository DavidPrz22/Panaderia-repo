import React, { createContext, useState } from "react";



type ClientContextType = {
    clients: any[];
    setClients: React.Dispatch<React.SetStateAction<any[]>>;
    open: boolean;
    setOpen: (open: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    success: boolean;
    setSuccess: (success: boolean) => void;
    clientToEdit: any | null;
    setClientToEdit: (client: any | null) => void;
};

export const ClientContextProvider = createContext<ClientContextType | null>(null);

export function ClientProvider({ children }: { children: React.ReactNode }) {
    const [clients, setClients] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<any | null>(null);

    return (
        <ClientContextProvider.Provider
            value={{
                clients,
                setClients,
                open,
                setOpen,
                loading,
                setLoading,
                error,
                setError,
                success,
                setSuccess,
                clientToEdit,
                setClientToEdit
            }}
        >
            {children}
        </ClientContextProvider.Provider>
    );
}

export function useClientContext() {
    const context = React.useContext(ClientContextProvider);
    if (!context) {
        throw new Error("useClientContext must be used within a ClientProvider");
    }
    return context;
}