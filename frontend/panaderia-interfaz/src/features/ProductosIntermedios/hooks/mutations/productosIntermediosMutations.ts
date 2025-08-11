import { useMutation } from "@tanstack/react-query";
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
    return useMutation({
        mutationFn: (data: TProductosIntermediosSchema) => createProductosIntermedios(data),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });
};