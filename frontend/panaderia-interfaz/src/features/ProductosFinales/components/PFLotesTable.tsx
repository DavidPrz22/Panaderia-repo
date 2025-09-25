import { PFLotesHeader } from "./PFLotesHeader";
import { PFLotesBody } from "./PFLotesBody";
import { useGetLotesProductosFinales } from "../hooks/queries/queries";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

export const PFLotesTable = () => {
    const { productoId } = useProductosFinalesContext();
    const { data: lotesProductosIntermedios, isFetching: isFetchingLotesProductosIntermedios } = useGetLotesProductosFinales(productoId!);

    return (
        <>
            <div className="w-full border border-gray-300 rounded-lg bg-white">
                <PFLotesHeader />
                <PFLotesBody data={lotesProductosIntermedios || []} isLoading={isFetchingLotesProductosIntermedios} />
            </div>
        </>
    );
};