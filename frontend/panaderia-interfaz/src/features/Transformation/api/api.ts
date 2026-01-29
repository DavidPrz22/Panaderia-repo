import apiClient from "@/api/client";
import type { AxiosError } from "axios";
import type { searchResponse, searchTerm } from "../types/types";

// Interfaz para la respuesta de la transformación
interface TransformacionResponse {
    id: number;
    nombre_transformacion: string;
    cantidad_origen: number;
    cantidad_destino: number;
    fecha_creacion: string;
    activo: boolean;
}

export const createTransformacion = async (data: {
    nombre_transformacion: string;
    cantidad_origen: number;
    cantidad_destino: number;
    fecha_creacion: Date;
    activo: boolean;
}): Promise<TransformacionResponse> => {
    try {
        const response = await apiClient.post('/api/transformacion/', data, {
            headers: { 'Content-Type': 'application/json' }
        });

        // Verifica que la respuesta tenga datos
        if (!response.data) {
            throw new Error('La respuesta del servidor está vacía');
        }

        console.log("Transformación creada:", response.data);
        return response.data;

    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string; errors?: string[] }>;
        const errorMessage = axiosError.response?.data?.detail ||
            axiosError.message || 'Error creando transformación';

        console.error("Error al crear transformación:", errorMessage);
        throw new Error(errorMessage);
    }
};

export const getTransformaciones = async (data?: {
    nombre_transformacion?: string;
    cantidad_origen?: number;
    cantidad_destino?: number;
    fecha_creacion?: Date;
    activo?: boolean;
}): Promise<TransformacionResponse[]> => {
    try {
        const response = await apiClient.get('/api/transformacion/', {
            params: data
        });
        console.log("Respuesta de API:", response.data); // Para debugging
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error obteniendo transformaciones:", axiosError.response?.data || axiosError.message);
        throw new Error("Error obteniendo transformaciones");
    }
};

export const updateTransformacion = async (id: number, data: {
    nombre_transformacion?: string;
    cantidad_origen?: number;
    cantidad_destino?: number;
    fecha_creacion?: Date;
    activo?: boolean;
}): Promise<TransformacionResponse> => {
    try {
        const response = await apiClient.put(`/api/transformacion/${id}/`, data, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string; errors?: string[] }>;
        const errorMessage = axiosError.response?.data?.detail ||
            axiosError.message || 'Error actualizando transformación';
        console.error("Error al actualizar transformación:", errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteTransformacion = async (id: number): Promise<void> => {
    try {
        await apiClient.delete(`/api/transformacion/${id}/`);
        console.log("Transformación eliminada:", id);
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const errorMessage = axiosError.response?.data?.detail ||
            axiosError.message || 'Error eliminando transformación';
        console.error("Error al eliminar transformación:", errorMessage);
        throw new Error(errorMessage);
    }
};

export const searchTransformaciones = async (params: searchTerm): Promise<searchResponse> => {
    try {
        console.log('🌐 disparando petición de transformaciones con query:', params.query);
        const response = await apiClient.get(`/api/transformacion/`, {
            params: { search: params.query, limit: params.limit }
        });
        // Adaptar la respuesta al formato searchResponse
        const adaptedResults = response.data.map((t: TransformacionResponse) => ({
            id: t.id,
            nombre_producto: t.nombre_transformacion, // Usamos nombre_producto para mantener la consistencia
        }));
        return { results: adaptedResults };
    } catch (error) {
        const axiosError = error as AxiosError<{ detail?: string }>;
        const errorMessage = axiosError.response?.data?.detail ||
            axiosError.message || 'Error buscando transformaciones';
        console.error("Error al buscar transformaciones:", errorMessage);
        throw new Error(errorMessage);
    }
};

export const ejecutarTransformacion = async (data: {
    transformacion_id: number;
    producto_origen_id: number;
    producto_destino_id: number;
    cantidad?: number;
}): Promise<void> => {
    try {
        const response = await apiClient.post("/api/ejecutar-transformacion/", data);
        // Backend returns 201 Created or 200 OK
        if (response.status !== 200 && response.status !== 201) {
            throw new Error("Error al ejecutar la transformación");
        }
    } catch (error) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage = axiosError.response?.data?.error ||
            axiosError.message || 'Error al ejecutar la transformación';
        console.error("Error al ejecutar transformación:", errorMessage);
        throw new Error(errorMessage);
    }
};

export const searchProducts = async (query: string, type: 'origen' | 'destino') => {
    try {
        const response = await apiClient.get('/api/productosfinales/search/', {
            params: { q: query, type }
        });
        return response.data;
    } catch (error) {
        console.error('Error in searchProducts:', error);
        throw error;
    }
};