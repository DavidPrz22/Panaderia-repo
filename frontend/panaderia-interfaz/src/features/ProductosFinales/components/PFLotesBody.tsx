import type { LotesProductosFinales } from "../types/types";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

export const PFLotesBody = ({ data, isLoading }: { data: LotesProductosFinales[], isLoading: boolean }) => {
    
    const { setShowLotesDetalles, setLotesProductosFinalesDetalles } = useProductosFinalesContext();

    const handleOnClick = (item: LotesProductosFinales) => {
        setShowLotesDetalles(true);
        setLotesProductosFinalesDetalles(item);
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

    return (
        <div className="rounded-b-lg">
            {data.map((item) => (
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