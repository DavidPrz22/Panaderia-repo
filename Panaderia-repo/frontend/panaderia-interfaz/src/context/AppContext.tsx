import { createContext, useContext, useState, useRef } from "react";
import { 
        type childrenProp, 
        type LoteMateriaPrimaFormResponse, 
        type MateriaPrimaListServer,
        type MateriaPrimaList
    } from "../lib/types";

type contextType = {
    showMateriaprimaForm: boolean;
    setShowMateriaprimaForm: (value: boolean) => void;
    showMateriaprimaDetalles: boolean;
    setShowMateriaprimaDetalles: (value: boolean) => void;
    materiaprimaDetalles: MateriaPrimaListServer | null;
    setMateriaprimaDetalles: (value: MateriaPrimaListServer | null) => void;
    materiaprimaId: number | null;
    setMateriaprimaId: (value: number | null) => void;
    registroDelete: boolean | null;
    setRegistroDelete: (value: boolean | null) => void;
    updateRegistro: boolean | null;
    setUpdateRegistro: (value: boolean | null) => void;
    lotesForm: LoteMateriaPrimaFormResponse[];
    setLotesForm: (value: LoteMateriaPrimaFormResponse[]) => void;
    showLotesForm: boolean;
    setShowLotesForm: (value: boolean) => void;
    lotesMateriaPrimaDetalles: LoteMateriaPrimaFormResponse | null;
    setLotesMateriaPrimaDetalles: (value: LoteMateriaPrimaFormResponse | null) => void;
    showLotesMateriaPrimaDetalles: boolean;
    setShowLotesMateriaPrimaDetalles: (value: boolean) => void;
    listaMateriaPrimaCached: MateriaPrimaList[];
    setListaMateriaPrimaCached: (value: MateriaPrimaList[]) => void;
    listaMateriaPrimaFilteredInputSearch: MateriaPrimaList[];
    setListaMateriaPrimaFilteredInputSearch: (value: MateriaPrimaList[]) => void;
    listaMateriaPrimaFiltered: MateriaPrimaList[];
    setListaMateriaPrimaFiltered: (value: MateriaPrimaList[]) => void;
    filteredApplied: boolean;
    setFilteredApplied: (value: boolean) => void;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
    MPFilteredInputSearchApplied: boolean;
    setMPFilteredInputSearchApplied: (value: boolean) => void;
    inputfilterDoubleApplied: boolean | null;
    setInputfilterDoubleApplied: (value: boolean | null) => void;
}

const AppContextProvider = createContext<contextType|null>(null)

export default function AppContext({children} : childrenProp) {

    const [showMateriaprimaForm, setShowMateriaprimaForm] = useState(false);
    const [showMateriaprimaDetalles, setShowMateriaprimaDetalles] = useState(false);
    const [showLotesForm, setShowLotesForm] = useState(false);
    const [showLotesMateriaPrimaDetalles, setShowLotesMateriaPrimaDetalles] = useState(false);
    
    const [listaMateriaPrimaCached, setListaMateriaPrimaCached] = useState<MateriaPrimaList[]>([]);
    const [listaMateriaPrimaFiltered, setListaMateriaPrimaFiltered] = useState<MateriaPrimaList[]>([]);
    const [filteredApplied, setFilteredApplied] = useState<boolean>(false); 

    const [listaMateriaPrimaFilteredInputSearch, setListaMateriaPrimaFilteredInputSearch] = useState<MateriaPrimaList[]>([]);
    const [MPFilteredInputSearchApplied, setMPFilteredInputSearchApplied] = useState<boolean>(false);

    const [inputfilterDoubleApplied, setInputfilterDoubleApplied] = useState<boolean|null>(null); // busqueda y filtro, luego el resultado se filtra por busqueda
    
    const [materiaprimaDetalles, setMateriaprimaDetalles] = useState<MateriaPrimaListServer | null>(null);
    const [materiaprimaId, setMateriaprimaId] = useState<number | null>(null);

    const [registroDelete, setRegistroDelete] = useState<boolean | null>(null);
    const [updateRegistro, setUpdateRegistro] = useState<boolean | null>(null);
    
    const [lotesForm, setLotesForm] = useState<LoteMateriaPrimaFormResponse[]>([]);
    const [lotesMateriaPrimaDetalles, setLotesMateriaPrimaDetalles] = useState<LoteMateriaPrimaFormResponse | null>(null);

    const searchInputRef = useRef<HTMLInputElement | null>(null); 

    return (
        <AppContextProvider 
        value={{
            showMateriaprimaForm, setShowMateriaprimaForm,
            showMateriaprimaDetalles, setShowMateriaprimaDetalles,
            materiaprimaDetalles, setMateriaprimaDetalles,
            materiaprimaId, setMateriaprimaId,
            registroDelete, setRegistroDelete,
            updateRegistro, setUpdateRegistro,
            showLotesForm, setShowLotesForm,
            lotesForm, setLotesForm,
            lotesMateriaPrimaDetalles, setLotesMateriaPrimaDetalles,
            showLotesMateriaPrimaDetalles, setShowLotesMateriaPrimaDetalles,
            listaMateriaPrimaCached, setListaMateriaPrimaCached,
            listaMateriaPrimaFilteredInputSearch, setListaMateriaPrimaFilteredInputSearch,
            listaMateriaPrimaFiltered, setListaMateriaPrimaFiltered,
            filteredApplied, setFilteredApplied,
            searchInputRef,
            MPFilteredInputSearchApplied, setMPFilteredInputSearchApplied,
            inputfilterDoubleApplied, setInputfilterDoubleApplied,
            }}>
            {children}
        </AppContextProvider>
    )
}

export function useAppContext(){

    const context = useContext(AppContextProvider);
    if (!context) throw new Error("Component must be within AppContextProvider Children")
    return context;
}
