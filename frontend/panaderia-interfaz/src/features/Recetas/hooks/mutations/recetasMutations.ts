import { useMutation, useQueryClient } from "@tanstack/react-query";
import { componentesRecetaSearch, registerReceta } from "../../api/api";
import { useRecetasContext } from "@/context/RecetasContext";
import type { TRecetasFormSchema } from "../../schemas/schemas";
import { recetasQueryOptions } from "../queries/RecetasQueryOptions";

export const useComponentesRecetaSearchMutation = () => {
    const { setSearchListItems } = useRecetasContext();
    return useMutation({
        mutationFn: (search: string) => componentesRecetaSearch(search),
        onSuccess: (data) => {
            setSearchListItems(data)
        },
        onError: (error) => {
            console.error('Error fetching componentes receta search:', error)
        }
    })
}

export const useRegisterRecetaMutation = () => {    
    const { setComponentesListadosReceta } = useRecetasContext();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TRecetasFormSchema) => registerReceta(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: recetasQueryOptions.queryKey });
            setComponentesListadosReceta([]);
        }
    })
}

// export const useRecetaDetallesMutation = () => {
//     return useMutation({
//         mutationFn: (id: number) => getRecetaDetalles(id),
//         onSuccess: (data) => {
//             console.log(data)
//         }
//     })
// }   