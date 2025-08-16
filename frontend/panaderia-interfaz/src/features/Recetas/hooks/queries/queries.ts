import { useQuery } from "@tanstack/react-query";
import {
  recetasDetallesQueryOptions,
  recetasQueryOptions,
} from "./RecetasQueryOptions";

export const useRecetasQuery = () => {
  return useQuery(recetasQueryOptions);
};

export const useRecetaDetallesQuery = (id: number) => {
  return useQuery({
    ...recetasDetallesQueryOptions(id),
    enabled: !!id,
  });
};
