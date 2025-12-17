import { useMutation } from "@tanstack/react-query";
import type { TAperturaCaja } from "../../schemas/schemas";
import { aperturaCaja } from "../../api/api";
import { toast } from 'sonner'
import { useQueryClient } from "@tanstack/react-query";
import { isActiveCajaOptions } from "../queries/options";

export const useAperturaCajaMutation = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TAperturaCaja) => aperturaCaja(data),
        onSuccess: () => {
            toast.success("Caja abierta exitosamente");
            queryClient.invalidateQueries({ queryKey: isActiveCajaOptions.queryKey })
        },
        onError: (error) => {
            toast.error("Error al abrir la caja");
        }
    });
}