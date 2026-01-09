import { useQueries, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  productosReventaDetallesQueryOptions,
  productosReventaQueryOptions,
  unidadesMedidaQueryOptions,
  categoriasProductosReventaQueryOptions,
  proveedoresQueryOptions,
  lotesProductosReventaQueryOptions,
} from "./queryOptions";

export const useGetParametros = () => {
  return useQueries({
    queries: [
      unidadesMedidaQueryOptions,
      categoriasProductosReventaQueryOptions,
      proveedoresQueryOptions,
    ],
  });
};

export const useGetProductosReventa = () => {
  return useInfiniteQuery(productosReventaQueryOptions);
};

export const useGetProductosReventaDetalles = (id: number) => {
  return useQuery({
    ...productosReventaDetallesQueryOptions(id),
    enabled: !!id,
  });
};

export const useGetLotesProductosReventa = (id: number) => {
  return useInfiniteQuery(lotesProductosReventaQueryOptions(id));
};
