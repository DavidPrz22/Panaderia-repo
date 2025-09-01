import apiClient from "@/api/client";
import type { searchItem } from "../types/types";

export const searchProductosIntermedios = async () : Promise<searchItem[]> => {
    try {
        const response = await apiClient.get(`/api/productosintermedios-search/`);
        return response.data;
    } catch (error) {
        console.error("Error searching Productos Intermedios:", error);
        throw error;
    }
};

export const searchProductosFinales = async() : Promise<searchItem[]> => {
    try {
        const response = await apiClient.get(`/api/productosfinales-search/`);
        return response.data;
    } catch (error) {
        console.error("Error searching Productos Finales:", error);
        throw error;
    }
};
