import {
  getCategoriasProductoIntermedio,
  getLotesProductosIntermedios,
  getProductosIntermedios,
  getProductosIntermediosDetalles,
  getUnidadesMedida,
} from "../../api/api";
import type { LoteProductoIntermedioPagination } from "../../types/types";

export const unidadesMedidaQueryOptions = {
  queryKey: ["unidades-medida"],
  queryFn: getUnidadesMedida,
  staleTime: Infinity,
};

export const categoriasProductoIntermedioQueryOptions = {
  queryKey: ["categorias-producto-intermedio"],
  queryFn: getCategoriasProductoIntermedio,
  staleTime: Infinity,
};

export const productosIntermediosQueryOptions = {
  queryKey: ["productos-intermedios"],
  queryFn: getProductosIntermedios,
  staleTime: Infinity,
};

export const productosIntermediosDetallesQueryOptions = (id: number) => ({
  queryKey: ["productos-intermedios-detalles", id],
  queryFn: () => getProductosIntermediosDetalles(id),
  staleTime: Infinity,
});

export const lotesProductosIntermediosQueryOptions = (producto_intermedio_id?: number) => ({
  queryKey: ["lotes-productos-intermedios-paginated", producto_intermedio_id],
  queryFn: ({ pageParam }: { pageParam?: string | null }) =>
    getLotesProductosIntermedios({ pageParam, producto_intermedio_id }),
  staleTime: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage: LoteProductoIntermedioPagination) => lastPage.next,
  getPreviousPageParam: (firstPage: LoteProductoIntermedioPagination) => firstPage.previous,
});