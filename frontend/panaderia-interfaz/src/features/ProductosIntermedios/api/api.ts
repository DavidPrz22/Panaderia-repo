import apiClient from "@/api/client";
import type { TProductosIntermediosSchema } from "../schemas/schema";
import type {
  CategoriaProductoIntermedio,
  ProductosIntermedios,
  ProductosIntermediosDetalles,
  recetasSearchItem,
  LotesProductosIntermedios,
  UnidadesDeMedida,
  LoteProductoIntermedioPagination,
} from "../types/types";

export const createProductoIntermedio = async (
  productoIntermedio: TProductosIntermediosSchema,
) => {
  const response = await apiClient.post(
    "/productos-intermedios/",
    productoIntermedio,
  );
  return response.data;
};

export const getRecetasSearch = async (
  search: string,
): Promise<recetasSearchItem[]> => {
  try {
    const response = await apiClient.get(
      `/api/recetas-search/list_recetas/?search=${search}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getUnidadesMedida = async (): Promise<UnidadesDeMedida[]> => {
  try {
    const response = await apiClient.get("/api/unidades-medida/");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCategoriasProductoIntermedio = async (): Promise<
  CategoriaProductoIntermedio[]
> => {
  try {
    const response = await apiClient.get(
      "/api/categorias-producto-intermedio/",
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createProductosIntermedios = async (
  data: TProductosIntermediosSchema,
) => {
  try {
    const response = await apiClient.post("/api/productosintermedios/", data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getProductosIntermedios = async (): Promise<
  ProductosIntermedios[]
> => {
  try {
    const response = await apiClient.get("/api/productosintermedios/");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getProductosIntermediosDetalles = async (
  id: number,
): Promise<ProductosIntermediosDetalles | null> => {
  try {
    const response = await apiClient.get(
      `/api/productosintermedios-detalles/${id}/`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateProductoIntermedio = async (
  id: number,
  data: TProductosIntermediosSchema,
) => {
  try {
    const response = await apiClient.put(
      `/api/productosintermedios/${id}/`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteProductoIntermedio = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/productosintermedios/${id}/`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeRecetaRelacionada = async (id: number) => {
  try {
    const response = await apiClient.post(
      `/api/productoselaborados/${id}/clear-receta-relacionada/`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getLotesProductosIntermedios = async ({
  pageParam,
  producto_intermedio_id,
}: {
  pageParam?: string | null;
  producto_intermedio_id?: number;
} = {}): Promise<LoteProductoIntermedioPagination> => {
  try {
    let url = pageParam || "/api/lotes-productos-elaborados/";
    if (!pageParam && producto_intermedio_id) {
      url += `?producto_elaborado=${producto_intermedio_id}`;
    }
    const response = await apiClient.get(url);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const changeEstadoLoteProductosIntermedios = async (id: number) => {
  try {
    const response = await apiClient.get(`/api/lotes-productos-elaborados/${id}/change-estado-lote/`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteLoteProductoElaborado = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/lotes-productos-elaborados/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lote producto elaborado:", error);
    throw error;
  }
};