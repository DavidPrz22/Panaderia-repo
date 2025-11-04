import type { LotesProductosReventa } from "../types/types";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useProductosReventaContext } from "@/context/ProductosReventaContext";

export const PRLotesBody = ({ data, isLoading }: { data: LotesProductosReventa[], isLoading: boolean }) => {
    const { setLotesProductosReventaDetalles, setShowPRLotesDetalles } = useProductosReventaContext();
    if (isLoading) {
        return (
            <div className="rounded-b-lg">
                <PendingTubeSpinner
                    size={28}
                    extraClass="bg-white opacity-50 w-full h-full"
                />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="rounded-b-lg">
                <div className="p-4 grid grid-cols-6 border-t border-gray-300">
                    <div className="col-span-6 text-center text-gray-500">No hay datos</div>
                </div>
            </div>
        );
    }

    // Sort data: DISPONIBLE first, then by fecha_caducidad ascending (closest to expire first)
    const sortedData = [...data].sort((a, b) => {
        // First, prioritize DISPONIBLE estado
        if (a.estado === "DISPONIBLE" && b.estado !== "DISPONIBLE") return -1;
        if (a.estado !== "DISPONIBLE" && b.estado === "DISPONIBLE") return 1;

        // If both have same estado priority, sort by fecha_caducidad ascending
        const dateA = new Date(a.fecha_caducidad);
        const dateB = new Date(b.fecha_caducidad);
        return dateA.getTime() - dateB.getTime();
    });

    const handleRowClick = (item: LotesProductosReventa) => {
        setLotesProductosReventaDetalles(item);
        setShowPRLotesDetalles(true);
    };

    return (
        <div className="rounded-b-lg">
            {sortedData.map((item) => (
                <div
                    key={`${item.fecha_recepcion}-${item.fecha_caducidad}`}
                    onClick={() => handleRowClick(item)}
                    className="p-4 grid grid-cols-6 border-t border-gray-300 hover:bg-gray-100 cursor-pointer font-[Roboto] text-sm"
                >
                    <div>{item.cantidad_recibida}</div>
                    <div>{item.stock_actual_lote}</div>
                    <div>{item.fecha_caducidad}</div>
                    <div>{item.fecha_recepcion}</div>
                    <div>${item.coste_unitario_lote_usd}</div>
                    <div className="font-medium">{item.estado}</div>
                </div>
            ))}
        </div>
    );
};