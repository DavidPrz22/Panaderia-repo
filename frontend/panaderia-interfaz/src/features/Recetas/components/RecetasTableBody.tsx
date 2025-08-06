// import { useEffect } from "react";
// import { DoubleSpinner } from "@/assets";

import { RecetasTablerows } from "./RecetasTablerows";
import { useRecetasQuery } from "../hooks/queries/queries";
import type { recetaItem } from "../types/types";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { NoDataMessage } from "./NoDataMessage";

export const RecetasTableBody = () => {
    const { data: recetas, isFetching } = useRecetasQuery();
    const displayData: recetaItem[] = recetas || [];

  return (
    <>
      { isFetching ? (
        <PendingTubeSpinner size={28} extraClass="absolute bg-white opacity-50 h-full w-full" />
      ) : displayData.length > 0 ? (
        <RecetasTablerows data={displayData} />
      ) : (
          <NoDataMessage />
      )}
    </>
  );
};
