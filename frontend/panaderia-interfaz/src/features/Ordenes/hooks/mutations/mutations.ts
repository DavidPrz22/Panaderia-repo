import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdenProductosSearch, createOrden, updateOrden, updateOrdenStatus, registerPaymentReference, cancelOrden } from "../../api/api";
import type { TOrderSchema } from "../../schema/schema";
import { ordenesDetallesQueryOptions, ordenesTableQueryOptions } from "../queries/queryOptions";

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
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (data: TOrderSchema) => createOrden(data),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ordenesTableQueryOptions.queryKey });
    },
    onError: (error) => {
        console.error("Error creating orden:", error);
    },
  });
};

export const useUpdateOrdenMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TOrderSchema }) => updateOrden(id, data),
    onSuccess: (_, {id}) => {
        queryClient.invalidateQueries({ queryKey: ordenesTableQueryOptions.queryKey });
        queryClient.invalidateQueries({ queryKey: ordenesDetallesQueryOptions(id).queryKey });
    },
    onError: (error) => {
        console.error("Error updating orden:", error);
    },
  });
};

export const useUpdateOrdenStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) => updateOrdenStatus(id, estado),
    onSuccess: (_, {id}) => {
        queryClient.invalidateQueries({ queryKey: ordenesTableQueryOptions.queryKey });
        queryClient.invalidateQueries({ queryKey: ordenesDetallesQueryOptions(id).queryKey });
    },
    onError: (error) => {
        console.error("Error updating orden:", error);
    },
  });
};

export const useCancelOrdenMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: (id: number) => cancelOrden(id),
    onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: ordenesTableQueryOptions.queryKey });
        queryClient.invalidateQueries({ queryKey: ordenesDetallesQueryOptions(id).queryKey });
    },
    onError: (error) => {
        console.error("Error canceling orden:", error);
    },
  });
};

export const useRegisterPaymentReferenceMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: ({ id, referencia_pago }: { id: number; referencia_pago: string }) => registerPaymentReference(id, referencia_pago),
    onSuccess: (_, {id}) => {
        queryClient.invalidateQueries({ queryKey: ordenesTableQueryOptions.queryKey });
        queryClient.invalidateQueries({ queryKey: ordenesDetallesQueryOptions(id).queryKey });
    },
    onError: (error) => {
        console.error("Error registering payment reference:", error);
    },
  });
};