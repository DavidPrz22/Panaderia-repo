import { useGetProductosFinales } from "../hooks/queries/queries";
import { PFTableRows } from "./PFTablerows";
import { PendingTubeSpinner } from "./PendingTubeSpinner";

export const PFTableBody = () => {
  const { data: productosFinales, isFetching } =
    useGetProductosFinales();
  const displayData = productosFinales || [];

  const NoDataMessage = () => (
    <div className="flex justify-center h-full items-center font-bold text-2xl text-gray-700">
      No hay datos Registrados
    </div>
  );

  return (
    <>
      {isFetching ? (
        <PendingTubeSpinner
          size={28}
          extraClass="absolute bg-white opacity-50 w-full h-full"
        />
      ) : displayData.length > 0 ? (
        <PFTableRows data={displayData} />
      ) : (
        <NoDataMessage />
      )}
    </>
  );
};
