import { getRecetaDetalles, getRecetas } from "../../api/api";

export const recetasQueryOptions = {
  queryKey: ["recetas"],
  queryFn: getRecetas,
  staleTime: Infinity,
};

export const recetasDetallesQueryOptions = (id: number) => {
  return {
    queryKey: ["recetasDetalles", id],
    queryFn: () => getRecetaDetalles(id),
    staleTime: Infinity,
  };
};
