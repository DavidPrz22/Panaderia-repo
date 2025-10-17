import { useMutation } from "@tanstack/react-query";
import { getOrdenProductosSearch, createOrden } from "../../api/api";
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
    return useMutation({
    mutationFn: (data: TOrderSchema) => createOrden(data),
    onSuccess: (data) => {
        console.log(data);
    },
    onError: (error) => {
        console.error("Error creating orden:", error);
    },
  });
};