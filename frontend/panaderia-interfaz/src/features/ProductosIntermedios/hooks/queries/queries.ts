import { useQueries, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  productosIntermediosDetallesQueryOptions,
  productosIntermediosQueryOptions,
  unidadesMedidaQueryOptions,
} from "./queryOptions";
import { categoriasProductoIntermedioQueryOptions } from "./queryOptions";
import { lotesProductosIntermediosQueryOptions } from "./queryOptions";

export const useGetParametros = () => {
  return useQueries({
    queries: [
      unidadesMedidaQueryOptions,
      categoriasProductoIntermedioQueryOptions,
    ],
  });
};

export const useGetProductosIntermedios = () => {
  return useInfiniteQuery(productosIntermediosQueryOptions);
};

export const useGetProductosIntermediosDetalles = (id: number) => {
  return useQuery({
    ...productosIntermediosDetallesQueryOptions(id),
    enabled: !!id,
  });
};

export const useGetLotesProductosIntermedios = (id: number) => {
  return useInfiniteQuery(lotesProductosIntermediosQueryOptions(id));
};