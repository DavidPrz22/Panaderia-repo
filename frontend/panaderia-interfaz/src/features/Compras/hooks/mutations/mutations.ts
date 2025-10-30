import { useMutation, useQueryClient } from "@tanstack/react-query";
import { searchProductosOC, createOrdenCompra } from "../../api/api";
import type { TOrdenCompraSchema } from "../../schemas/schemas";
import { ordenesCompraTableQueryOptions } from "../queries/queryOptions";

export const useProductosSearchMutation = () => {
    return useMutation({
        mutationFn: (params: string) => searchProductosOC(params)
    })
}

export const useCreateOCMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: TOrdenCompraSchema) => createOrdenCompra(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ordenesCompraTableQueryOptions.queryKey });
        },
        onError: (error) => {
            console.error("Error creating orden compra:", error);
        },
    })

}