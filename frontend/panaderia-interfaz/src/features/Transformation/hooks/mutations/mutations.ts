import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ejecutarTransformacion, createTransformacion, updateTransformacion, deleteTransformacion } from "../../api/api";
import { toast } from "sonner";

export const useEjecutarTransformacionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ejecutarTransformacion,
        onSuccess: () => {
            toast.success("Transformación ejecutada correctamente.");
            // Invalidar transformaciones y stocks
            queryClient.invalidateQueries({ queryKey: ["transformaciones"] });
            queryClient.invalidateQueries({ queryKey: ["productosFinalesSearch"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Error al ejecutar la transformación.");
        },
    });
};

export const useCreateTransformacionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTransformacion,
        onSuccess: () => {
            toast.success("Transformación creada correctamente.");
            queryClient.invalidateQueries({ queryKey: ["transformaciones"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Error al crear la transformación.");
        },
    });
};

export const useUpdateTransformacionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => updateTransformacion(id, data),
        onSuccess: () => {
            toast.success("Transformación actualizada correctamente.");
            queryClient.invalidateQueries({ queryKey: ["transformaciones"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Error al actualizar la transformación.");
        },
    });
};

export const useDeleteTransformacionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTransformacion,
        onSuccess: () => {
            toast.success("Transformación eliminada correctamente.");
            queryClient.invalidateQueries({ queryKey: ["transformaciones"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Error al eliminar la transformación.");
        },
    });
};
