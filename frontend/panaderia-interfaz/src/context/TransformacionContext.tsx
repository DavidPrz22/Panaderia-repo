import { createContext, useContext, useState, type ReactNode } from 'react';
import type { searchResponse, Transformacion } from '@/features/Transformation/types/types';
import { useRef } from 'react';

export type TransformacionForm = {
    nombre_transformacion: string;
    cantidad_origen: number;
    cantidad_destino: number;
    activo: boolean;
    fecha_creacion?: Date;
};



type TransformacionContextType = {
        productsOrigenRef: React.RefObject<HTMLInputElement | null>;
        isOpen: boolean; 
        setIsOpen: (isOpen: boolean) => void;
        isRegistroOpen: boolean;
        setIsRegistroOpen: (isRegistroOpen: boolean) => void;
        nombre: string;
        setNombre: (nombre: string) => void;
        cantidadOrigen: string;
        setCantidadOrigen: (cantidadOrigen: string) => void;
        cantidadDestino: string;
        setCantidadDestino: (cantidadDestino: string) => void;
        loading: boolean;
        setLoading: (loading: boolean) => void;
        error: string | null;   
        setError: (error: string | null) => void;
        success: boolean;
        setSuccess: (success: boolean) => void;
        transformacion: Transformacion[];
        setTransformacion: (transformacion: Transformacion[]) => void;
        editingTransformacion: Transformacion | null;
        setEditingTransformacion: (transformacion: Transformacion | null) => void;
        formData: TransformacionForm | undefined; 
        setFormData: React.Dispatch<React.SetStateAction<TransformacionForm | undefined>>;
        suggestions: searchResponse; // ✅ Tipo específico en lugar de any[]
        setSuggestions: React.Dispatch<React.SetStateAction<searchResponse>>;
        showSuggestions: boolean;
        setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
        searchQuery: string | null;
        setSearchQuery: (searchQuery: string | null) => void;
        selectedTransf: boolean;
        setSelectedTransf: (selectedTransf: boolean) => void;
        isFocusedTransf: boolean;
        setIsFocusedTransf: (isFocusedTransf: boolean) => void;
        mostrarSearch: boolean;
        setMostrarSearch: (mostrarSearch: boolean) => void;
        productId: number | null;
        setProductId: (productId: number | null) => void;
    };

export const TransformacionContextProvider = createContext<TransformacionContextType | null>(null);

export function TransformacionProvider({ children }: { children: ReactNode }) {
    const productsOrigenRef = useRef<HTMLInputElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isRegistroOpen, setIsRegistroOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [cantidadOrigen, setCantidadOrigen] = useState('');
    const [cantidadDestino, setCantidadDestino] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [transformacion, setTransformacion] = useState<Transformacion[]>([]);
    const [editingTransformacion, setEditingTransformacion] = useState<Transformacion | null>(null);
    const [formData, setFormData] = useState<TransformacionForm | undefined>(undefined);
    const [suggestions, setSuggestions] = useState<searchResponse>({ results: [] }); // ✅ Tipo específico
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [selectedTransf, setSelectedTransf] = useState<boolean>(false);
    const [isFocusedTransf, setIsFocusedTransf] = useState<boolean>(false);
    const [mostrarSearch, setMostrarSearch] = useState<boolean>(false);
    const [productId, setProductId] = useState<number | null>(null);
    


return (
    <TransformacionContextProvider.Provider
        value={{
            productsOrigenRef,
            isOpen,
            setIsOpen,
            isRegistroOpen,
            setIsRegistroOpen,
            nombre,
            setNombre,
            cantidadOrigen,
            setCantidadOrigen,
            cantidadDestino,
            setCantidadDestino,
            loading,
            setLoading,
            error,
            setError,
            success,
            setSuccess,
            transformacion,
            setTransformacion,
            editingTransformacion,
            setEditingTransformacion,
            formData,
            setFormData,
            suggestions,
            setSuggestions,
            showSuggestions,
            setShowSuggestions,
            searchQuery,
            setSearchQuery,
            selectedTransf, 
            setSelectedTransf,
            isFocusedTransf,
            setIsFocusedTransf,
            mostrarSearch,
            setMostrarSearch,
            productId,
            setProductId,
            
        }}
        >
            {children}
        </TransformacionContextProvider.Provider>
    );
};
        
export function useTransformacionContext() {
    const context = useContext(TransformacionContextProvider);
    if (!context) {
        throw new Error('Component must be used within a TransformacionProvider');
    }
    return context;
}
