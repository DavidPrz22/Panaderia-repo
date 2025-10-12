import { PILotesHeader } from "./PILotesHeader";
import { PILotesBody } from "./PILotesBody";
import { useGetLotesProductosIntermedios } from "../hooks/queries/queries";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export const LotesProductosIntermediosTable = () => {
    const { productoIntermedioId } = useProductosIntermediosContext();
    const { data: lotesProductosIntermedios, isFetching: isFetchingLotesProductosIntermedios } = useGetLotesProductosIntermedios(productoIntermedioId!);

    return (
        <>
            <div className="w-full border border-gray-300 rounded-lg bg-white">
                <PILotesHeader />
                <PILotesBody data={lotesProductosIntermedios || []} isLoading={isFetchingLotesProductosIntermedios} />
            </div>
        </>
    );
};