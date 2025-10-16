import { useMutation } from "@tanstack/react-query";
import { getOrdenProductosSearch } from "../../api/api";

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