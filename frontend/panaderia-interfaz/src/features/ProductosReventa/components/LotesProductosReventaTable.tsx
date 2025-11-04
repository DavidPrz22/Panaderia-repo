import { PRLotesHeader } from "./PRLotesHeader";
import { PRLotesBody } from "./PRLotesBody";
import { useGetLotesProductosReventa } from "../hooks/queries/queries";
import { useProductosReventaContext } from "@/context/ProductosReventaContext";

export const LotesProductosReventaTable = () => {
    const { productoReventaId } = useProductosReventaContext();
    const { data: lotesProductosReventa, isFetching: isFetchingLotesProductosReventa } = useGetLotesProductosReventa(productoReventaId!);

    return (
        <>
            <div className="w-full border border-gray-300 rounded-lg bg-white">
                <PRLotesHeader />
                <PRLotesBody data={lotesProductosReventa || []} isLoading={isFetchingLotesProductosReventa} />
            </div>
        </>
    );
};