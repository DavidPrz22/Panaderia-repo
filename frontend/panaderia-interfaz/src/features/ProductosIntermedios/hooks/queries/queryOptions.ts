import {
  getCategoriasProductoIntermedio,
  getLotesProductosIntermedios,
  getProductosIntermedios,
  getProductosIntermediosDetalles,
  getUnidadesMedida,
} from "../../api/api";

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

export const lotesProductosIntermediosQueryOptions = (id: number) => ({
  queryKey: ["lotes-productos-intermedios", id],
  queryFn: () => getLotesProductosIntermedios(id),
  staleTime: Infinity,
});