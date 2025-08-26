import { useQueries, useQuery } from "@tanstack/react-query";
import {
  productoFinalDetallesQueryOptions,
  productosFinalesQueryOptions,
  unidadesMedidaQueryOptions,
  categoriasProductoFinalQueryOptions,
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
    queries: [
      unidadesMedidaQueryOptions,
      categoriasProductoFinalQueryOptions,
    ],
  });
};