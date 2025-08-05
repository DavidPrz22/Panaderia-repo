// import { useEffect } from "react";
// import { DoubleSpinner } from "@/assets";

import { RecetasTablerows } from "./RecetasTablerows";

export const RecetasTableBody = () => {

    const displayData: any[] = []

  const NoDataMessage = () => (
    <div className="flex justify-center h-full items-center font-bold text-2xl text-gray-700">
      No hay datos Registrados
    </div>
  );

  return (
    <>
      { displayData ? (
        <RecetasTablerows data={displayData} />
      ) : (
        <NoDataMessage />
      )}
    </>
  );
};
