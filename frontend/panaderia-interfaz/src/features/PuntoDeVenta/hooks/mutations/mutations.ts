import { useMutation } from "@tanstack/react-query";
import type { TAperturaCaja, TVenta } from "../../schemas/schemas";
import { aperturaCaja, createVenta, cerrarCaja, type TCierreCaja } from "../../api/api";
import { toast } from 'sonner'
import { useQueryClient } from "@tanstack/react-query";
import { isActiveCajaOptions, productosQueryOptions } from "../queries/options";

export const useAperturaCajaMutation = () => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TAperturaCaja) => aperturaCaja(data),
        onSuccess: () => {
            toast.success("Caja abierta exitosamente");
            queryClient.invalidateQueries({ queryKey: isActiveCajaOptions.queryKey })
        },
        onError: () => {
            toast.error("Error al abrir la caja");
        }
    });
}

export const useCreateVentaMutation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: TVenta) => createVenta(data),
        onSuccess: () => {
            toast.success("Venta creada exitosamente");
            queryClient.invalidateQueries({ queryKey: productosQueryOptions.queryKey })
        },
        onError: () => {
            toast.error("Error al crear la venta");
        }
    });
}

export const useCerrarCajaMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: TCierreCaja) => cerrarCaja(data),
        onSuccess: () => {
            toast.success("Caja cerrada exitosamente");
            queryClient.invalidateQueries({ queryKey: isActiveCajaOptions.queryKey })
        },
        onError: () => {
            toast.error("Error al cerrar la caja");
        }
    });
}