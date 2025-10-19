import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdenProductosSearch, createOrden, updateOrden } from "../../api/api";
import type { TOrderSchema } from "../../schema/schema";

export const useProductosPedidoSearchMutation = () => {
    return useMutation({
    mutationFn: (search: string) => getOrdenProductosSearch(search),
    onSuccess: (data) => {
        console.log(data);
    },
    onError: (error) => {
        console.error("Error fetching orden productos search:", error);
    },
  });
};

export const useCreateOrdenMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (data: TOrderSchema) => createOrden(data),
    onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ["ordenes-table"] });
    },
    onError: (error) => {
        console.error("Error creating orden:", error);
    },
  });
};

export const useUpdateOrdenMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TOrderSchema }) => updateOrden(id, data),
    onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries({ queryKey: ["ordenes-table"] });
        queryClient.invalidateQueries({ queryKey: ["ordenes-detalles"] });
    },
    onError: (error) => {
        console.error("Error updating orden:", error);
    },
  });
};