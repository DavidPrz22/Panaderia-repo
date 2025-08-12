import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProductosIntermedios, getRecetasSearch } from "../../api/api";
import type { TProductosIntermediosSchema } from "../../schemas/schema";

export const useGetRecetasSearchMutation = () => {
    return useMutation({
        mutationFn: (search: string) => getRecetasSearch(search),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });
};  

export const useCreateProductosIntermediosMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TProductosIntermediosSchema) => createProductosIntermedios(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["productos-intermedios"] });
        },
        onError: (error) => {
            console.log(error);
        },
    });
};