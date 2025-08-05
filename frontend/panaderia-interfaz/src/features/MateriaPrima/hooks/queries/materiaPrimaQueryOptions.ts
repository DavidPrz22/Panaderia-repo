import {
  fetchCategoriasMateriaPrima,
  fetchUnidadesMedida,
  handleMateriaPrimaList,
  handleMateriaPrimaListPK,
  handleProveedores,
  handleLotesMateriaPrimaLotes,
} from "@/features/MateriaPrima/api/api";

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

export const createMateriaPrimaListPKQueryOptions = (pk: number | null) => {
  if (!pk) {
    throw new Error("pk is required");
  }
  return {
    queryKey: ["materiaPrimaListPK", pk],
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
