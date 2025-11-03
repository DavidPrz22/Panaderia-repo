import { useMemo } from "react";
import { PFLotesHeader } from "./PFLotesHeader";
import { PFLotesBody } from "./PFLotesBody";
import { useGetLotesProductosFinales } from "../hooks/queries/queries";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

export const PFLotesTable = () => {
    const { productoId } = useProductosFinalesContext();
    const { data: lotesProductosIntermedios, isFetching: isFetchingLotesProductosIntermedios } = useGetLotesProductosFinales(productoId!);

    const sortedLotes = useMemo(() => {
        if (!lotesProductosIntermedios) return [];

        return [...lotesProductosIntermedios].sort((a, b) => {
            const estadoPriorityA = a.estado === "DISPONIBLE" ? 0 : 1;
            const estadoPriorityB = b.estado === "DISPONIBLE" ? 0 : 1;

            if (estadoPriorityA !== estadoPriorityB) {
                return estadoPriorityA - estadoPriorityB;
            }

            const fechaCaducidadA = new Date(a.fecha_caducidad);
            const fechaCaducidadB = new Date(b.fecha_caducidad);

            return fechaCaducidadA.getTime() - fechaCaducidadB.getTime();
        });
    }, [lotesProductosIntermedios]);

    return (
        <>
            <div className="w-full border border-gray-300 rounded-lg bg-white">
                <PFLotesHeader />
                <PFLotesBody data={sortedLotes} isLoading={isFetchingLotesProductosIntermedios} />
            </div>
        </>
    );
};