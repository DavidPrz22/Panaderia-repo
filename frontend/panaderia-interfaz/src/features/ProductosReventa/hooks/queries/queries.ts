import { useQueries, useQuery } from "@tanstack/react-query";
import {
  productosReventaDetallesQueryOptions,
  productosReventaQueryOptions,
  unidadesMedidaQueryOptions,
  categoriasProductosReventaQueryOptions,
  proveedoresQueryOptions,
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
  return useQuery(productosReventaQueryOptions);
};

export const useGetProductosReventaDetalles = (id: number) => {
  return useQuery({
    ...productosReventaDetallesQueryOptions(id),
    enabled: !!id,
  });
};
