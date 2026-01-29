import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteProductoFinal,
  registerProductoFinal,
  updateProductoFinal,
  getRecetasSearch,
  removeRecetaRelacionada,
  changeEstadoLoteProductosFinales,
  deleteLoteProductoElaborado,
} from "../../api/api";
import type { TProductoFinalSchema } from "../../schemas/schemas";

import {
  productosFinalesQueryOptions,
  productoFinalDetallesQueryOptions,
  lotesProductosFinalesQueryOptions,
} from "../queries/productosFinalesQueryOptions";

import { finalesSearchOptions } from "@/features/Production/hooks/queries/ProductionQueryOptions";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

export const useCreateProductoFinal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TProductoFinalSchema) => registerProductoFinal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productosFinalesQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: finalesSearchOptions.queryKey,
      })
    },
  });
};

export const useUpdateProductoFinal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      producto,
    }: {
      id: number;
      producto: TProductoFinalSchema;
    }) => updateProductoFinal(id, producto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: productosFinalesQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: productoFinalDetallesQueryOptions(id).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: finalesSearchOptions.queryKey,
      })
    },
  });
};

export const useDeleteProductoFinal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProductoFinal(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({
        queryKey: productosFinalesQueryOptions.queryKey,
      });
      queryClient.removeQueries({
        queryKey: productoFinalDetallesQueryOptions(id).queryKey,
      });
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

export const useChangeEstadoLoteProductosFinales = () => {
  const queryClient = useQueryClient();
  const { productoId } = useProductosFinalesContext();
  return useMutation({
    mutationFn: (id: number) => changeEstadoLoteProductosFinales(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: lotesProductosFinalesQueryOptions(productoId!).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: productosFinalesQueryOptions.queryKey,
      });
    },
  });
};

export const useDeleteLoteProductoElaboradoMutation = (
  productoId: number | undefined,
  handleClose: () => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deleteLoteProductoElaborado(id);
    },
    onSuccess: async () => {
      if (productoId) {
        await queryClient.invalidateQueries({
          queryKey: lotesProductosFinalesQueryOptions(productoId).queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: productoFinalDetallesQueryOptions(productoId).queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: productosFinalesQueryOptions.queryKey
        });
        handleClose();
      }
    },
  });
};