import {
  fetchCategoriasMateriaPrima,
  fetchUnidadesMedida,
  handleMateriaPrimaList,
  handleMateriaPrimaListPK,
  handleProveedores,
  handleLotesMateriaPrimaLotes,
  getLotesMateriaPrima,
} from "@/features/MateriaPrima/api/api";
import type { LoteMateriaPrimaPagination } from "../../types/types";

export const createUnidadesQueryOptions = () => {
  return {
    queryKey: ["unidadesMedidaMateriaPrima"],
    queryFn: () => fetchUnidadesMedida(),
    staleTime: Infinity,
  };
};

export const createCategoriasQueryOptions = () => {
  return {
    queryKey: ["categoriasMateriaPrima"],
    queryFn: () => fetchCategoriasMateriaPrima(),
    staleTime: Infinity,
  };
};

export const createMateriaPrimaListQueryOptions = () => {
  return {
    queryKey: ["materiaPrimaList"],
    queryFn: () => handleMateriaPrimaList(),
    staleTime: Infinity,
  };
};
export const MATERIA_PRIMA_PK_KEY = "materiaPrimaListPK";

export const createMateriaPrimaListPKQueryOptions = (pk: number | null) => {
  if (!pk) {
    throw new Error("pk is required");
  }
  return {
    queryKey: [MATERIA_PRIMA_PK_KEY, pk],
    queryFn: () => handleMateriaPrimaListPK(pk),
    staleTime: Infinity,
  };
};

export const createProveedoresQueryOptions = () => {
  return {
    queryKey: ["proveedores"],
    queryFn: () => handleProveedores(),
    staleTime: Infinity,
  };
};

export const createLotesMateriaPrimaQueryOptions = (pk: number) => {
  return {
    queryKey: ["lotesMateriaPrima", pk],
    queryFn: () => {
      const data = handleLotesMateriaPrimaLotes(pk);
      return data;
    },
    staleTime: Infinity,
  };
};


export const lotesMateriaPrimaQueryOptions = (materia_prima_id?: number) => ({
  queryKey: ["lotes-materia-prima-paginated", materia_prima_id],
  queryFn: ({ pageParam }: { pageParam?: string | null }) =>
    getLotesMateriaPrima({ pageParam, materia_prima_id }),
  staleTime: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage: LoteMateriaPrimaPagination) => lastPage.next,
  getPreviousPageParam: (firstPage: LoteMateriaPrimaPagination) => firstPage.previous,
});
