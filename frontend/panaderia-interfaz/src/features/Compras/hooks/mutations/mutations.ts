import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  searchProductosOC,
  createOrdenCompra,
  marcarEnviadaOC,
  crearRecepcionOC,
  registrarPago,
  updateOrdenCompra,
  enviarEmailOC,
} from "../../api/api";
import type { TEmailSchema, TOrdenCompraSchema, TPagoSchema, TRecepcionFormSchema } from "../../schemas/schemas";
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

export const useUpdateOCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TOrdenCompraSchema }) => updateOrdenCompra(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ordenesCompraTableQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ordenesCompraDetallesQueryOptions(id).queryKey,
      });
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

export const useCrearRecepcionOCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: TRecepcionFormSchema) => crearRecepcionOC(params),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: ordenesCompraTableQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ordenesCompraDetallesQueryOptions(params.orden_compra_id).queryKey,
      });
    },
    onError: (error) => {
      console.error("Error creating reception:", error);
    },
  });
};

export const useRegistrarPagoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: TPagoSchema) => registrarPago(params),
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: ordenesCompraTableQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ordenesCompraDetallesQueryOptions(params.orden_compra_asociada).queryKey,
      });
    },
  });
};

export const useEnviarEmailOCMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id, params}: {id: number, params: TEmailSchema}) => enviarEmailOC(id, params),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ordenesCompraTableQueryOptions.queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: ordenesCompraDetallesQueryOptions(id).queryKey,
      });
    },
  });
};