import {
  getCategoriasProductosReventa,
  getLotesProductosReventa,
  getProductosReventa,
  getProductosReventaDetalles,
  getUnidadesMedida,
  getProveedores,
} from "../../api/api";
import type { LoteProductoReventaPagination } from "../../types/types";

export const unidadesMedidaQueryOptions = {
  queryKey: ["unidades-medida"],
  queryFn: getUnidadesMedida,
  staleTime: Infinity,
};

export const categoriasProductosReventaQueryOptions = {
  queryKey: ["categorias-productos-reventa"],
  queryFn: getCategoriasProductosReventa,
  staleTime: Infinity,
};

export const proveedoresQueryOptions = {
  queryKey: ["proveedores"],
  queryFn: getProveedores,
  staleTime: Infinity,
};

export const productosReventaQueryOptions = {
  queryKey: ["productos-reventa"],
  queryFn: getProductosReventa,
  staleTime: Infinity,
};


export const PRODUCTOS_REVENTA_KEY = ["productos-reventa"];
export const productosReventaDetallesQueryOptions = (id: number) => ({
  queryKey: ["productos-reventa-detalles", id],
  queryFn: () => getProductosReventaDetalles(id),
  staleTime: Infinity,
});

export const lotesProductosReventaQueryOptions = (producto_reventa_id?: number) => ({
  queryKey: ["lotes-productos-reventa-paginated", producto_reventa_id],
  queryFn: ({ pageParam }: { pageParam?: string | null }) =>
    getLotesProductosReventa({ pageParam, producto_reventa_id }),
  staleTime: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage: LoteProductoReventaPagination) => lastPage.next,
  getPreviousPageParam: (firstPage: LoteProductoReventaPagination) => firstPage.previous,
});
