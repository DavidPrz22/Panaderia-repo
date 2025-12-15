import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProductosReventa,
  deleteProductosReventa,
  updateProductosReventa,
  createLoteProductosReventa,
  updateLoteProductosReventa,
  deleteLoteProductosReventa,
  changeEstadoLoteProductosReventa,
  uploadCSV
} from "../../api/api";
import type { TProductosReventaSchema, TLoteProductosReventaSchema } from "../../schemas/schema";
import {
  productosReventaDetallesQueryOptions,
  productosReventaQueryOptions,
  lotesProductosReventaQueryOptions,
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

export const useCreateUpdateLoteProductosReventaMutation = (
  productoReventaId: number | undefined,
  onSubmitSuccess: () => void,
  reset: () => void,
  isUpdate: boolean,
  loteId?: number,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<TLoteProductosReventaSchema, 'fecha_recepcion' | 'fecha_caducidad'> & {
      fecha_recepcion: string;
      fecha_caducidad: string;
      producto_reventa: number;
      stock_actual_lote: number;
      detalle_oc: null;
    }) => {
      if (isUpdate && loteId) {
        return updateLoteProductosReventa(loteId, data);
      } else {
        return createLoteProductosReventa(data);
      }
    },
    onSuccess: async () => {
      if (productoReventaId) {
        await queryClient.invalidateQueries({
          queryKey: lotesProductosReventaQueryOptions(productoReventaId).queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: productosReventaDetallesQueryOptions(productoReventaId).queryKey,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: productosReventaQueryOptions.queryKey,
      });
      onSubmitSuccess();
      reset();
    },
    onError: (error) => {
      console.error("Error creating/updating lote productos reventa:", error);
    },
  });
};

export const useDeleteLoteProductosReventaMutation = (productoReventaId: number | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteLoteProductosReventa(id),
    onSuccess: async () => {
      if (productoReventaId) {
        await queryClient.invalidateQueries({
          queryKey: lotesProductosReventaQueryOptions(productoReventaId).queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: productosReventaDetallesQueryOptions(productoReventaId).queryKey,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: productosReventaQueryOptions.queryKey,
      });
    },
    onError: (error) => {
      console.error("Error deleting lote productos reventa:", error);
    },
  });
};

export const useChangeEstadoLoteProductosReventa = (productoReventaId: number | null | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => changeEstadoLoteProductosReventa(id),
    onSuccess: async () => {
      if (productoReventaId) {
        await queryClient.invalidateQueries({
          queryKey: lotesProductosReventaQueryOptions(productoReventaId).queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: productosReventaDetallesQueryOptions(productoReventaId).queryKey,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: productosReventaQueryOptions.queryKey,
      });
    },
    onError: (error) => {
      console.error("Error changing estado lote productos reventa:", error);
    },
  });
};


export const useUploadCSVProductosReventaMuatation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: string) => uploadCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productosReventaQueryOptions.queryKey,
      });
    },
    onError: (error) => {
      console.error("Error uploading CSV:", error);
    },
  });
}