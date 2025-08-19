import apiClient from "@/api/client";
import type { TRecetasFormSchema } from "../schemas/schemas";
import type {
  recetaDetallesItem,
  recetaItem,
  recetaRelacionada,
  recetasSearchList,
} from "../types/types";

export const componentesRecetaSearch = async (
  search: string,
): Promise<recetasSearchList[]> => {
  try {
    const response = await apiClient.get(
      `/api/materiaprimasearch/search-materia-prima/?search=${search}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching componentes receta search:", error);
    throw error;
  }
};

export const registerReceta = async (data: TRecetasFormSchema) => {
  try {
    const response = await apiClient.post("/api/recetas/", data);
    return response.data;
  } catch (error) {
    console.error("Error registering receta:", error);
    throw error;
  }
};

export const getRecetas = async (): Promise<recetaItem[]> => {
  try {
    const response = await apiClient.get("/api/recetas/");
    return response.data;
  } catch (error) {
    console.error("Error fetching recetas:", error);
    throw error;
  }
};

export const getRecetaDetalles = async (
  id: number,
): Promise<recetaDetallesItem> => {
  try {
    const response = await apiClient.get(
      `/api/recetas/${id}/get_receta_detalles/`,
    );
    console.log(response.data, "response.data");
    return response.data;
  } catch (error) {
    console.error("Error fetching receta detalles:", error);
    throw error;
  }
};

export const updateReceta = async (
  recetaId: number,
  data: TRecetasFormSchema,
) => {
  try {
    const response = await apiClient.put(
      `/api/recetas/${recetaId}/update_receta/`,
      data,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating receta:", error);
    throw error;
  }
};

export const deleteReceta = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/recetas/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting receta:", error);
    throw error;
  }
};

export const getRecetasSearch = async (
  search: string,
): Promise<recetaRelacionada[]> => {
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