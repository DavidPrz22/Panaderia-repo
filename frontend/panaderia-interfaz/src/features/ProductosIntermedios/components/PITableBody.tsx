// import { useEffect } from "react";
// import { DoubleSpinner } from "@/assets";

import { useGetProductosIntermedios } from "../hooks/queries/queries";
import { PITableRows } from "./PITableRows";
import { PendingTubeSpinner } from "./PendingTubeSpinner";

export const PITableBody = () => {
  const { data: productosIntermedios, isFetching } =
    useGetProductosIntermedios();
  const displayData = productosIntermedios || [];

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
        <PITableRows data={displayData} />
      ) : (
        <NoDataMessage />
      )}
    </>
  );
};
