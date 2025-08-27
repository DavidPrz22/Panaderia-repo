import apiClient from "@/api/client";
import type { CategoriaProductoFinal, ProductoFinalDetalles, ProductosFinalesList, recetasSearchItem } from "../types/types";
import type { TProductoFinalSchema } from "../schemas/schemas";
import type { receta_relacionada, UnidadesDeMedida } from "../types/types"; 

export const getProductosFinales = async (): Promise<ProductosFinalesList> => {
  try {
    const response = await apiClient.get("/api/productosfinales/");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching productos finales:", error);
    throw error;
  }
};

export const getProductoFinalDetalles = async (
  id: number
): Promise<ProductoFinalDetalles> => {
  try {
    const response = await apiClient.get(`/api/productosfinales-detalles/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching producto elaborado:", error);
    throw error;
  }
};

export const registerProductoFinal = async (
  data: TProductoFinalSchema
) => {
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
  data: TProductoFinalSchema
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
  search: string
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
    const response = await apiClient.get(
      "/api/categorias-producto-final/",
    );
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