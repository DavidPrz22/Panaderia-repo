// import { useEffect } from "react";
// import { DoubleSpinner } from "@/assets";

import { RecetasTablerows } from "./RecetasTablerows";
import { useRecetasQuery } from "../hooks/queries/queries";
import type { recetaItem } from "../types/types";

export const RecetasTableBody = () => {
    const { data: recetas } = useRecetasQuery();
    const displayData: recetaItem[] = recetas || [];

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
