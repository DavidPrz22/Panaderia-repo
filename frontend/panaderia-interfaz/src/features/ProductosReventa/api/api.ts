import apiClient from "@/api/client";
import type { TProductosReventaSchema, TLoteProductosReventaSchema } from "../schemas/schema";
import type {
  CategoriaProductosReventa,
  ProductosReventa,
  ProductosReventaDetalles,
  LotesProductosReventa,
  UnidadesDeMedida,
  Proveedor,
  LoteProductoReventaPagination,
  ProductosReventaPagination,
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
    const response = await apiClient.get("/api/compras/proveedores/");
    return response.data;
  } catch (error) {
    console.error("Error fetching proveedores:", error);
    return [];
  }
};

export const getProductosReventa = async ({
  pageParam
}: {
  pageParam?: string | null
} = {}): Promise<ProductosReventaPagination> => {
  try {
    const url = pageParam || "/api/productosreventa/";
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching productos reventa:", error);
    throw error;
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

export const getLotesProductosReventa = async ({
  pageParam,
  producto_reventa_id,
}: {
  pageParam?: string | null;
  producto_reventa_id?: number;
} = {}): Promise<LoteProductoReventaPagination> => {
  try {
    let url = pageParam || "/api/lotes-productos-reventa/";
    if (!pageParam && producto_reventa_id) {
      url += `?producto_reventa=${producto_reventa_id}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching lotes productos reventa:", error);
    throw error;
  }
};

export const createLoteProductosReventa = async (
  data: Omit<TLoteProductosReventaSchema, 'fecha_recepcion' | 'fecha_caducidad'> & {
    fecha_recepcion: string;
    fecha_caducidad: string;
    producto_reventa: number;
    stock_actual_lote: number;
    detalle_oc: null;
  },
) => {
  try {
    const response = await apiClient.post("/api/lotes-productos-reventa/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating lote productos reventa:", error);
    throw error;
  }
};

export const updateLoteProductosReventa = async (
  id: number,
  data: Omit<TLoteProductosReventaSchema, 'fecha_recepcion' | 'fecha_caducidad'> & {
    fecha_recepcion: string;
    fecha_caducidad: string;
    producto_reventa: number;
    stock_actual_lote: number;
    detalle_oc: null;
  },
) => {
  try {
    const response = await apiClient.put(`/api/lotes-productos-reventa/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating lote productos reventa:", error);
    throw error;
  }
};

export const deleteLoteProductosReventa = async (id: number) => {
  try {
    const response = await apiClient.delete(`/api/lotes-productos-reventa/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting lote productos reventa:", error);
    throw error;
  }
};

export const changeEstadoLoteProductosReventa = async (id: number) => {
  try {
    const response = await apiClient.get(`/api/lotes-productos-reventa/${id}/change-estado-lote/`);
    return response.data;
  } catch (error) {
    console.error("Error changing estado lote productos reventa:", error);
    return null;
  }
};


export const uploadCSV = async (file: string) => {
  try {
    const response = await apiClient.post(`/api/productosreventa/register-csv/`, { file: file });
    return response.data;
  } catch (error) {
    console.error("Error uploading CSV:", error);
    throw error;
  }
}