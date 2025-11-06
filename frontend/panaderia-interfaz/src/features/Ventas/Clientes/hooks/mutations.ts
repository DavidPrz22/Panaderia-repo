import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCliente, updateCliente } from "../api/api";
import clientesQueryOptions from "./ClientesQueries";
import type { TClientesInput } from "../schemas/schemas";

export const useUpdateCliente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: TClientesInput }) => updateCliente(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(clientesQueryOptions);
        },
    });
};

export const useDeleteCliente = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteCliente(id),
        onSuccess: () => {
            queryClient.invalidateQueries(clientesQueryOptions);
        },
    });
};
