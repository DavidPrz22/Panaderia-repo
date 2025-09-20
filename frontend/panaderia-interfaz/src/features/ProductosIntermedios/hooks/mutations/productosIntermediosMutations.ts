import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductosIntermedios,
  getRecetasSearch,
  removeRecetaRelacionada,
  deleteProductoIntermedio,
  updateProductoIntermedio,
} from "../../api/api";
import type { TProductosIntermediosSchema } from "../../schemas/schema";
import {
  productosIntermediosDetallesQueryOptions,
  productosIntermediosQueryOptions,
} from "../queries/queryOptions";

export const useGetRecetasSearchMutation = () => {
  return useMutation({
    mutationFn: (search: string) => getRecetasSearch(search),
  });
};

export const useCreateProductosIntermediosMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TProductosIntermediosSchema) =>
      createProductosIntermedios(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productosIntermediosQueryOptions.queryKey,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useRemoveRecetaRelacionadaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeRecetaRelacionada(id),
    onSuccess: async (_, id) => {
      console.log(id);
      queryClient.invalidateQueries({
        queryKey: productosIntermediosDetallesQueryOptions(id).queryKey,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteProductoIntermedioMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductoIntermedio(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: productosIntermediosQueryOptions.queryKey,
      });
      queryClient.removeQueries({
        queryKey: productosIntermediosDetallesQueryOptions(id).queryKey,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateProductosIntermediosMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: TProductosIntermediosSchema;
    }) => updateProductoIntermedio(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productosIntermediosQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: productosIntermediosDetallesQueryOptions(id).queryKey,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
