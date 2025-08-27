import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductoFinal, registerProductoFinal, updateProductoFinal, getRecetasSearch, removeRecetaRelacionada } from "../../api/api";
import type { TProductoFinalSchema } from "../../schemas/schemas";

import { productosFinalesQueryOptions , productoFinalDetallesQueryOptions } from "../queries/productosFinalesQueryOptions";

export const useCreateProductoFinal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TProductoFinalSchema) =>
      registerProductoFinal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosFinalesQueryOptions().queryKey });
    },
  });
};

export const useUpdateProductoFinal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, producto}: { id: number; producto: TProductoFinalSchema }) =>
      updateProductoFinal(id, producto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productosFinalesQueryOptions().queryKey  });
      queryClient.invalidateQueries({ queryKey: productoFinalDetallesQueryOptions(id).queryKey  });
    },
  });
};

export const useDeleteProductoFinal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductoFinal(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: productosFinalesQueryOptions().queryKey  });
      queryClient.removeQueries({ queryKey: productoFinalDetallesQueryOptions(id).queryKey  });
    },
  });
};


export const useGetRecetasSearchMutation = () => {
  return useMutation({
    mutationFn: (search: string) => getRecetasSearch(search),
  });
};

export const useRemoveRecetaRelacionadaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => removeRecetaRelacionada(id),
    onSuccess: async (_, id) => {

      queryClient.invalidateQueries({
        queryKey: productoFinalDetallesQueryOptions(id).queryKey,
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};