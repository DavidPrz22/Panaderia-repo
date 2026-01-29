import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  recetasDetallesQueryOptions,
  recetasQueryOptions,
} from "./RecetasQueryOptions";

export const useRecetasQuery = () => {
  return useInfiniteQuery(recetasQueryOptions);
};

export const useRecetaDetallesQuery = (id: number) => {
  return useQuery({
    ...recetasDetallesQueryOptions(id),
    enabled: !!id,
  });
};
