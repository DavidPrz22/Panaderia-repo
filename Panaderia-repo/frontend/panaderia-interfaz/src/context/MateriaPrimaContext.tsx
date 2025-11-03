import { createContext, useContext, useState, useRef } from "react";
import {
  type childrenProp,
  type LoteMateriaPrimaFormResponse,
  type MateriaPrimaListServer,
  type MateriaPrimaList,
  type CategoriaMateriaPrima,
  type UnidadMedida,
} from "../features/MateriaPrima/types/types";

type MateriaPrimaContextType = {
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
  setLotesMateriaPrimaDetalles: (
    value: LoteMateriaPrimaFormResponse | null,
  ) => void;
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
  isLoadingDetalles: boolean;
  setIsLoadingDetalles: (value: boolean) => void;
  isLoadingList: boolean;
  setIsLoadingList: (value: boolean) => void;
  shouldRefreshList: boolean;
  setShouldRefreshList: (value: boolean) => void;
  categoriasMateriaPrima: CategoriaMateriaPrima[];
  setCategoriasMateriaPrima: (value: CategoriaMateriaPrima[]) => void;
  unidadesMedida: UnidadMedida[];
  setUnidadesMedida: (value: UnidadMedida[]) => void;
};

const MateriaPrimaContextProvider =
  createContext<MateriaPrimaContextType | null>(null);

export function MateriaPrimaProvider({ children }: childrenProp) {
  const [categoriasMateriaPrima, setCategoriasMateriaPrima] = useState<
    CategoriaMateriaPrima[]
  >([]);
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);

  const [showMateriaprimaForm, setShowMateriaprimaForm] = useState(false);
  const [showMateriaprimaDetalles, setShowMateriaprimaDetalles] =
    useState(false);
  const [showLotesForm, setShowLotesForm] = useState(false);
  const [showLotesMateriaPrimaDetalles, setShowLotesMateriaPrimaDetalles] =
    useState(false);

  const [listaMateriaPrimaCached, setListaMateriaPrimaCached] = useState<
    MateriaPrimaList[]
  >([]);
  const [listaMateriaPrimaFiltered, setListaMateriaPrimaFiltered] = useState<
    MateriaPrimaList[]
  >([]);
  const [filteredApplied, setFilteredApplied] = useState<boolean>(false);

  const [
    listaMateriaPrimaFilteredInputSearch,
    setListaMateriaPrimaFilteredInputSearch,
  ] = useState<MateriaPrimaList[]>([]);
  const [MPFilteredInputSearchApplied, setMPFilteredInputSearchApplied] =
    useState<boolean>(false);

  const [inputfilterDoubleApplied, setInputfilterDoubleApplied] = useState<
    boolean | null
  >(null);

  const [materiaprimaDetalles, setMateriaprimaDetalles] =
    useState<MateriaPrimaListServer | null>(null);
  const [materiaprimaId, setMateriaprimaId] = useState<number | null>(null);

  const [registroDelete, setRegistroDelete] = useState<boolean | null>(null);
  const [updateRegistro, setUpdateRegistro] = useState<boolean | null>(null);

  const [lotesForm, setLotesForm] = useState<LoteMateriaPrimaFormResponse[]>(
    [],
  );
  const [lotesMateriaPrimaDetalles, setLotesMateriaPrimaDetalles] =
    useState<LoteMateriaPrimaFormResponse | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoadingDetalles, setIsLoadingDetalles] = useState<boolean>(false);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);

  const [shouldRefreshList, setShouldRefreshList] = useState<boolean>(false);

  return (
    <MateriaPrimaContextProvider.Provider
      value={{
        showMateriaprimaForm,
        setShowMateriaprimaForm,
        showMateriaprimaDetalles,
        setShowMateriaprimaDetalles,
        materiaprimaDetalles,
        setMateriaprimaDetalles,
        materiaprimaId,
        setMateriaprimaId,
        registroDelete,
        setRegistroDelete,
        updateRegistro,
        setUpdateRegistro,
        showLotesForm,
        setShowLotesForm,
        lotesForm,
        setLotesForm,
        lotesMateriaPrimaDetalles,
        setLotesMateriaPrimaDetalles,
        showLotesMateriaPrimaDetalles,
        setShowLotesMateriaPrimaDetalles,
        listaMateriaPrimaCached,
        setListaMateriaPrimaCached,
        listaMateriaPrimaFilteredInputSearch,
        setListaMateriaPrimaFilteredInputSearch,
        listaMateriaPrimaFiltered,
        setListaMateriaPrimaFiltered,
        filteredApplied,
        setFilteredApplied,
        searchInputRef,
        MPFilteredInputSearchApplied,
        setMPFilteredInputSearchApplied,
        inputfilterDoubleApplied,
        setInputfilterDoubleApplied,
        isLoadingDetalles,
        setIsLoadingDetalles,
        isLoadingList,
        setIsLoadingList,
        shouldRefreshList,
        setShouldRefreshList,
        categoriasMateriaPrima,
        setCategoriasMateriaPrima,
        unidadesMedida,
        setUnidadesMedida,
      }}
    >
      {children}
    </MateriaPrimaContextProvider.Provider>
  );
}

export function useMateriaPrimaContext() {
  const context = useContext(MateriaPrimaContextProvider);
  if (!context)
    throw new Error("Component must be within MateriaPrimaProvider");
  return context;
}
