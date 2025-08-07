import apiClient from '@/api/client';
import type { TRecetasFormSchema } from '../schemas/schemas';
import type { recetaDetallesItem, recetaItem } from '../types/types';

export const componentesRecetaSearch = async (search: string) => {
    try {
        const response = await apiClient.get(`/api/materiaprimasearch/search-materia-prima/?search=${search}`)
        return response.data
    } catch (error) {
        console.error('Error fetching componentes receta search:', error)
        throw error
    }
}

export const registerReceta = async (data: TRecetasFormSchema) => {
    try {
        const response = await apiClient.post('/api/recetas-detalles/', data)
        return response.data
    } catch (error) {
        console.error('Error registering receta:', error)
        throw error
    }
}

export const getRecetas = async () : Promise<recetaItem[]> => {
    try {
        const response = await apiClient.get('/api/recetas/')
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching recetas:', error)
        throw error
    }
}

export const getRecetaDetalles = async (id: number) : Promise<recetaDetallesItem> => {
    try {
        const response = await apiClient.get(`/api/recetas/${id}/get_receta_detalles/`)
        return response.data
    } catch (error) {
        console.error('Error fetching receta detalles:', error)
        throw error
    }
}