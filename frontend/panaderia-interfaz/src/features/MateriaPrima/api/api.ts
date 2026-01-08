import apiClient from "../../../api/client";
import type { AxiosError } from "axios";
import {
  type UnidadMedida,
  type CategoriaMateriaPrima,
  type LoteMateriaPrimaFormSumit,
  type MateriaPrimaListServer,
  type LoteMateriaPrimaFormResponse,
  type MateriaPrimaList,
  type Proveedor,
  type LoteMateriaPrimaPagination,
} from "../types/types";

import type { TMateriaPrimaSchema } from "../schemas/schemas";

// UNIDADES DE MEDIDA API CALL
export const fetchUnidadesMedida = async (): Promise<UnidadMedida[]> => {
  try {
    const response = await apiClient.get("/api/unidades-medida/");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to fetch unidades medida",
    );
  }
};

// CATEGORIAS DE MATERIA PRIMA API CALL
export const fetchCategoriasMateriaPrima = async (): Promise<
  CategoriaMateriaPrima[]
> => {
  try {
    const response = await apiClient.get("/api/categorias-materiaprima/");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to fetch categorias",
    );
  }
};

// API CALL FOR MATERIA PRIMA to create/update materia prima
export const handleCreateUpdateMateriaPrima = async (
  data: TMateriaPrimaSchema,
  id?: number,
) => {
  const isUpdate = id !== undefined;
  const url = isUpdate ? `/api/materiaprima/${id}/` : "/api/materiaprima/";
  const method = isUpdate ? "put" : "post";

  try {
    const response = await apiClient[method](url, data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, string[]>>;
    if (axiosError.response) {
      return {
        errorData: axiosError.response.data,
        status: axiosError.response.status,
        failed: true,
      };
    }
    throw error;
  }
};

// API CALL FOR MATERIA PRIMA LIST
export const handleMateriaPrimaList = async (): Promise<MateriaPrimaList[]> => {
  try {
    const response = await apiClient.get("/api/materiaprima/");
    const dataResponse = response.data;

    const mappedData: MateriaPrimaList[] = dataResponse.map(
      (item: MateriaPrimaListServer) => ({
        id: item.id,
        name: item.nombre,
        unit: item.unidad_medida_base_detail.nombre_completo,
        category: item.categoria_detail.nombre_categoria,
        quantity: item.stock_actual,
        reorderPoint: item.punto_reorden,
        creationDate: item.fecha_creacion_registro,
      }),
    );

    return mappedData;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to fetch materia prima list",
    );
  }
};

// API CALL FOR MATERIA PRIMA LIST PK
export const handleMateriaPrimaListPK = async (
  pk: number,
): Promise<MateriaPrimaListServer> => {
  try {
    const response = await apiClient.get(`/api/materiaprima/${pk}/`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to fetch materia prima",
    );
  }
};

// API CALL FOR DELETE MATERIA PRIMA
export const handleDeleteMateriaPrima = async (pk: number) => {
  try {
    const response = await apiClient.delete(`/api/materiaprima/${pk}/`);

    if (response.status === 204) {
      return { success: true };
    }
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to delete materia prima",
    );
  }
};

// API CALL FOR LOTES MATERIA PRIMA LIST
export const handleLotesMateriaPrimaLotes = async (
  pk: number,
): Promise<{ lotes: LoteMateriaPrimaFormResponse[]; success: boolean }> => {
  try {
    const response = await apiClient.get(
      `/api/lotesmateriaprima/?materia_prima=${pk}`,
    );
    const dataResponse = response.data;
    console.log("Lotes fetched:", dataResponse);
    if (dataResponse.length > 0) {
      return { lotes: dataResponse, success: true };
    }
    return { lotes: [], success: false };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to fetch lotes",
    );
  }
};

// API CALL FOR CREATE LOTE MATERIA PRIMA
export const handleCreateUpdateLoteMateriaPrima = async (
  data: LoteMateriaPrimaFormSumit,
  id?: number,
): Promise<{ lotes: LoteMateriaPrimaFormResponse; success: boolean }> => {
  const isUpdate = id !== undefined;
  const url = isUpdate
    ? `/api/lotesmateriaprima/${id}/`
    : "/api/lotesmateriaprima/";
  const method = isUpdate ? "put" : "post";

  // Format dates to YYYY-MM-DD
  const formattedData = {
    ...data,
    fecha_recepcion: data.fecha_recepcion.toISOString().split("T")[0],
    fecha_caducidad: data.fecha_caducidad.toISOString().split("T")[0],
  };

  try {
    const response = await apiClient[method](url, formattedData);
    return { lotes: response.data, success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to create/update lote",
    );
  }
};

// API CALL FOR PROVEEDORES
export const handleProveedores = async (): Promise<Proveedor[]> => {
  try {
    const response = await apiClient.get("/api/compras/proveedores/");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to fetch proveedores",
    );
  }
};

// API CALL FOR DELETE LOTE MATERIA PRIMA
export const handleDeleteLoteMateriaPrima = async (pk: number | undefined) => {
  if (!pk) {
    return { success: false };
  }

  try {
    await apiClient.delete(`/api/lotesmateriaprima/${pk}/`);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to delete lote",
    );
  }
};

// API CALL FOR ACTIVATE LOTE MATERIA PRIMA
export const handleActivateLoteMateriaPrima = async (
  pk: number | undefined,
) => {
  if (!pk) {
    return { success: false };
  }

  try {
    await apiClient.put(`/api/lotesmateriaprima/${pk}/activar/`);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to activate lote",
    );
  }
};


export const handleInactivateLoteMateriaPrima = async (
  pk: number | undefined,
) => {
  if (!pk) {
    return { success: false };
  }

  try {
    await apiClient.put(`/api/lotesmateriaprima/${pk}/inactivar/`);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to inactivate lote",
    );
  }
};

export const uploadCSV = async (Base64File: string): Promise<{ status: number, message: string }> => {
  try {
    const response = await apiClient.post('/api/materiaprima/register-csv/', { file: Base64File });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to upload CSV",
    );
  }
}

export const getLotesMateriaPrima = async ({
  pageParam,
  materia_prima_id,
}: {
  pageParam?: string | null;
  materia_prima_id?: number;
} = {}): Promise<LoteMateriaPrimaPagination> => {
  try {
    let url = pageParam || "/api/lotesmateriaprima/";
    if (!pageParam && materia_prima_id) {
      url += `?materia_prima=${materia_prima_id}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    throw new Error(
      axiosError.response?.data?.detail || "Failed to fetch lotes materia prima",
    );
  }
};