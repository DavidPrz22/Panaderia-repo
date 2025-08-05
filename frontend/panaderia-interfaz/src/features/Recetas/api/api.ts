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