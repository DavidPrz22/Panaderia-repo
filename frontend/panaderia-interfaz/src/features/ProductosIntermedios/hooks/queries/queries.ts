import { useQueries, useQuery } from "@tanstack/react-query";
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
  return useQuery(productosIntermediosQueryOptions);
};

export const useGetProductosIntermediosDetalles = (id: number) => {
  return useQuery({
    ...productosIntermediosDetallesQueryOptions(id),
    enabled: !!id,
  });
};

export const useGetLotesProductosIntermedios = (id: number) => {
  return useQuery(lotesProductosIntermediosQueryOptions(id));
};