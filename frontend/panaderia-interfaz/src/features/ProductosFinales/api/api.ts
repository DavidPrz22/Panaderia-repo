import apiClient from "@/api/client";
import type {
  CategoriaProductoFinal,
  ProductoFinalDetalles,
  ProductosFinalesList,
  recetasSearchItem,
  ProductosFinalesPagination,
} from "../types/types";

import type { TProductoFinalSchema } from "../schemas/schemas";
import type { UnidadesDeMedida, LotesProductosFinales, LoteProductoFinalPagination } from "../types/types";

export const getProductosFinales = async ({
  pageParam
}: {
  pageParam?: string | null
} = {}): Promise<ProductosFinalesPagination> => {
  try {
    const url = pageParam || "/api/productosfinales/";
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching productos finales:", error);
    throw error;
  }
};

export const getProductoFinalDetalles = async (
  id: number,
): Promise<ProductoFinalDetalles> => {
  try {
    const response = await apiClient.get(
      `/api/productosfinales-detalles/${id}/`,
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching producto elaborado:", error);
    throw error;
  }
};

export const registerProductoFinal = async (data: TProductoFinalSchema) => {
  try {
    const response = await apiClient.post("/api/productosfinales/", data);
    return response.data;
  } catch (error) {
    console.error("Error registering producto elaborado:", error);
    throw error;
  }
};

export const updateProductoFinal = async (
  id: number,
  data: TProductoFinalSchema,
) => {
  try {
    const response = await apiClient.put(`/api/productosfinales/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating producto final:", error);
    throw error;
  }
};

export const deleteProductoFinal = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/productosfinales/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting producto final:", error);
    throw error;
  }
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
    console.error("Error searching recetas:", error);
    throw error;
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

export const getCategoriasProductoFinal = async (): Promise<
  CategoriaProductoFinal[]
> => {
  try {
    const response = await apiClient.get("/api/categorias-producto-final/");
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
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

export const deleteLoteProductoElaborado = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/lotes-productos-elaborados/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lote producto elaborado:", error);
    throw error;
  }
};


export const getLotesProductosFinales = async ({
  pageParam,
  producto_final_id,
}: {
  pageParam?: string | null;
  producto_final_id?: number;
} = {}): Promise<LoteProductoFinalPagination> => {
  try {
    let url = pageParam || "/api/lotes-productos-elaborados/";
    if (!pageParam && producto_final_id) {
      url += `?producto_elaborado=${producto_final_id}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const changeEstadoLoteProductosFinales = async (id: number) => {
  try {
    const response = await apiClient.get(`/api/lotes-productos-elaborados/${id}/change-estado-lote/`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};