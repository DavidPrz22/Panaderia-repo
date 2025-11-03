import {
  getRecetaComponentes,
  searchProductosFinales,
  searchProductosIntermedios,
} from "../../api/api";

export const finalesSearchOptions = {
  queryKey: ["productosFinalesSearch"],
  queryFn: searchProductosFinales,
  staleTime: Infinity,
};

export const intermediosSearchOptions = {
  queryKey: ["productosIntermediosSearch"],
  queryFn: searchProductosIntermedios,
  staleTime: Infinity,
};

export const componentsProductionOptions = (id: number) => {
  return {
    queryKey: ["componentesProduccion", id],
    queryFn: () => getRecetaComponentes(id),
    staleTime: Infinity,
  };
};
