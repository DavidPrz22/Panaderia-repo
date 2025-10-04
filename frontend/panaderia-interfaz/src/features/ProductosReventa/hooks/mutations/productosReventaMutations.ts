import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductosReventa,
  deleteProductosReventa,
  updateProductosReventa,
} from "../../api/api";
import type { TProductosReventaSchema } from "../../schemas/schema";
import {
  productosReventaDetallesQueryOptions,
  productosReventaQueryOptions,
} from "../queries/queryOptions";

export const useCreateProductosReventaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TProductosReventaSchema) => createProductosReventa(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productosReventaQueryOptions.queryKey,
      });
    },
    onError: (error) => {
      console.error("Error creating producto reventa:", error);
    },
  });
};

export const useUpdateProductosReventaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: TProductosReventaSchema;
    }) => updateProductosReventa(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productosReventaQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: productosReventaDetallesQueryOptions(id).queryKey,
      });
    },
    onError: (error) => {
      console.error("Error updating producto reventa:", error);
    },
  });
};

export const useDeleteProductosReventaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductosReventa(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: productosReventaQueryOptions.queryKey,
      });
      queryClient.removeQueries({
        queryKey: productosReventaDetallesQueryOptions(id).queryKey,
      });
    },
    onError: (error) => {
      console.error("Error deleting producto reventa:", error);
    },
  });
};