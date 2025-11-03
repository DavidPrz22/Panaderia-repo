import { useGetProductosReventa } from "../hooks/queries/queries";
import { PRTableRows } from "./PRTableRows";
import { PendingTubeSpinner } from "./PendingTubeSpinner";

export const PRTableBody = () => {
  const { data: productosReventa, isFetching } = useGetProductosReventa();
  const displayData = productosReventa || [];

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
        <PRTableRows data={displayData} />
      ) : (
        <NoDataMessage />
      )}
    </>
  );
};