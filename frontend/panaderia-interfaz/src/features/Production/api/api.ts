import apiClient from "@/api/client";
import type {
  componentesRecetaProducto,
  componentesSearchList,
  ProductionDetails,
  searchItem,
} from "../types/types";
import type { TProductionFormData } from "../schemas/schemas";

export const searchProductosIntermedios = async (): Promise<searchItem[]> => {
  try {
    const response = await apiClient.get(`/api/productosintermedios-search/`);
    console.log(response.data);
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching receta componentes:", error);
    throw error;
  }
};

export const createProduction = async (data: TProductionFormData) => {
  try {
    const response = await apiClient.post(`/api/produccion/`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating production:", error);
    throw error;
  }
};

export const componentesRecetaSearch = async (
  search: string,
): Promise<componentesSearchList[]> => {
  const stock = true;
  try {
    const response = await apiClient.get("/api/componentes-search/", {
      params: {
        search,
        stock,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching componentes receta search:", error);
    throw error;
  }
};

type ProductionDetailsResponse = {
  data: ProductionDetails[];
  page: number;
  total_count: number;
  total_pages: number;
}
export const getProductionDetails = async (page: number): Promise<ProductionDetailsResponse> => {
  try {
    const response = await apiClient.get(`/api/produccion-detalles/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching production details:", error);
    throw error;
  }
};