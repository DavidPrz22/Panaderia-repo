import apiClient from "@/api/client";
import type { TProductosReventaSchema } from "../schemas/schema";
import type {
  CategoriaProductosReventa,
  ProductosReventa,
  ProductosReventaDetalles,
  UnidadesDeMedida,
  Proveedor,
} from "../types/types";

export const getUnidadesMedida = async (): Promise<UnidadesDeMedida[]> => {
  try {
    const response = await apiClient.get("/api/unidades-medida/");
    return response.data;
  } catch (error) {
    console.error("Error fetching unidades de medida:", error);
    return [];
  }
};

export const getCategoriasProductosReventa = async (): Promise<
  CategoriaProductosReventa[]
> => {
  try {
    const response = await apiClient.get("/api/categorias-productos-reventa/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categorias productos reventa:", error);
    return [];
  }
};

export const getProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await apiClient.get("/api/proveedores/");
    return response.data;
  } catch (error) {
    console.error("Error fetching proveedores:", error);
    return [];
  }
};

export const getProductosReventa = async (): Promise<ProductosReventa[]> => {
  try {
    const response = await apiClient.get("/api/productosreventa/");
    return response.data;
  } catch (error) {
    console.error("Error fetching productos reventa:", error);
    return [];
  }
};

export const getProductosReventaDetalles = async (
  id: number,
): Promise<ProductosReventaDetalles | null> => {
  try {
    const response = await apiClient.get(`/api/productosreventa-detalles/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching producto reventa detalles:", error);
    return null;
  }
};

export const createProductosReventa = async (
  data: TProductosReventaSchema,
) => {
  try {
    const response = await apiClient.post("/api/productosreventa/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating producto reventa:", error);
    throw error;
  }
};

export const updateProductosReventa = async (
  id: number,
  data: TProductosReventaSchema,
) => {
  try {
    const response = await apiClient.put(`/api/productosreventa/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating producto reventa:", error);
    throw error;
  }
};

export const deleteProductosReventa = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/productosreventa/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting producto reventa:", error);
    throw error;
  }
};
