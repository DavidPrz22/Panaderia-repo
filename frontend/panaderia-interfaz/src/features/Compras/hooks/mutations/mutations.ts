import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchProductosOC,
  createOrdenCompra,
  marcarEnviadaOC,
} from "../../api/api";
import type { TOrdenCompraSchema } from "../../schemas/schemas";
import { ordenesCompraTableQueryOptions } from "../queries/queryOptions";
import { ordenesCompraDetallesQueryOptions } from "@/features/Compras/hooks/queries/queryOptions";

export const useProductosSearchMutation = () => {
  return useMutation({
    mutationFn: (params: string) => searchProductosOC(params),
  });
};

export const useCreateOCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: TOrdenCompraSchema) => createOrdenCompra(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ordenesCompraTableQueryOptions.queryKey,
      });
    },
    onError: (error) => {
      console.error("Error creating orden compra:", error);
    },
  });
};

export const useMarcarEnviadaOCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => marcarEnviadaOC(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ordenesCompraTableQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ordenesCompraDetallesQueryOptions(id).queryKey,
      });
    },
    onError: (error) => {
      console.error("Error marking order as sent:", error);
    },
  });
};
