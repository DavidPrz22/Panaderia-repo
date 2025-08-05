import apiClient from '@/api/client';
import type { TRecetasFormSchema } from '../schemas/schemas';

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
        const response = await apiClient.post('/api/recetas/', data)
        return response.data
    } catch (error) {
        console.error('Error registering receta:', error)
        throw error
    }
}

export const getRecetas = async () => {
    try {
        const response = await apiClient.get('/api/recetas-detalles/')
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error('Error fetching recetas:', error)
        throw error
    }
}

export const getRecetaDetalles = async (id: number) => {
    try {
        const response = await apiClient.get(`/api/recetas-detalles/${id}/get_receta_detalles/`)
        return response.data
    } catch (error) {
        console.error('Error fetching receta detalles:', error)
        throw error
    }
}