import type { LotesProductosIntermedios } from "../types/types";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export const PILotesBody = ({ data, isLoading }: { data: LotesProductosIntermedios[], isLoading: boolean }) => {
    const { setShowLotesDetalles, setLotesProductosIntermediosDetalles } = useProductosIntermediosContext();

    const handleOnClick = (item: LotesProductosIntermedios) => {
        setShowLotesDetalles(true);
        setLotesProductosIntermediosDetalles(item);
    }
    
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

    return (
        <div className="rounded-b-lg">
            {sortedData.map((item) => (
                <div 
                    key={`${item.fecha_produccion}-${item.fecha_caducidad}`}
                    className="p-4 grid grid-cols-6 border-t border-gray-300 hover:bg-gray-100 cursor-pointer font-[Roboto] text-sm"
                    onClick={() => handleOnClick(item)}
                >
                    <div>{item.cantidad_inicial_lote}</div>
                    <div>{item.stock_actual_lote}</div>
                    <div>{item.fecha_caducidad}</div>
                    <div>{item.fecha_produccion}</div>
                    <div>{item.coste_total_lote_usd}</div>
                    <div className="font-medium">{item.estado}</div>
                </div>
            ))}
        </div>
    );
};