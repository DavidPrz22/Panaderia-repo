import { useQueries, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  productoFinalDetallesQueryOptions,
  productosFinalesQueryOptions,
  unidadesMedidaQueryOptions,
  categoriasProductoFinalQueryOptions,
  lotesProductosFinalesQueryOptions,
} from "./productosFinalesQueryOptions";

export const useGetProductosFinales = () => {
  return useQuery(productosFinalesQueryOptions());
};

export const useProductoFinalDetalles = (id: number) => {
  return useQuery({
    ...productoFinalDetallesQueryOptions(id),
    enabled: !!id,
  });
};

export const useGetParametros = () => {
  return useQueries({
    queries: [unidadesMedidaQueryOptions, categoriasProductoFinalQueryOptions],
  });
};


export const useGetLotesProductosFinales = (id: number) => {
  return useInfiniteQuery(lotesProductosFinalesQueryOptions(id));
};