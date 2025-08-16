import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductosIntermedios,
  getRecetasSearch,
  removeRecetaRelacionada,
  deleteProductoIntermedio,
} from "../../api/api";
import type { TProductosIntermediosSchema } from "../../schemas/schema";
import {
  productosIntermediosDetallesQueryOptions,
  productosIntermediosQueryOptions,
} from "../queries/queryOptions";

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
