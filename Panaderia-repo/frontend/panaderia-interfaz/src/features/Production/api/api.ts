import apiClient from "@/api/client";
import type { componentesRecetaProducto, searchItem } from "../types/types";

export const searchProductosIntermedios = async (): Promise<searchItem[]> => {
  try {
    const response = await apiClient.get(`/api/productosintermedios-search/`);
    return response.data;
  } catch (error) {
    console.error("Error searching Productos Intermedios:", error);
    throw error;
  }
};

export const searchProductosFinales = async (): Promise<searchItem[]> => {
  try {
    const response = await apiClient.get(`/api/productosfinales-search/`);
    return response.data;
  } catch (error) {
    console.error("Error searching Productos Finales:", error);
    throw error;
  }
};

export const getRecetaComponentes = async (
  producto_id: number,
): Promise<componentesRecetaProducto> => {
  try {
    const response = await apiClient.get(
      `/api/productoselaborados/${producto_id}/get-receta-producto/`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching receta componentes:", error);
    throw error;
  }
};
