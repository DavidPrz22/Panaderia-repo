import apiClient from "@/api/client";
import type { TProductosIntermediosSchema } from "../schemas/schema";
import type {
  CategoriaProductoIntermedio,
  ProductosIntermedios,
  ProductosIntermediosDetalles,
  recetasSearchItem,
  UnidadesDeMedida,
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
