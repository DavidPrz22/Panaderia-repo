// import { useEffect } from "react";
// import { DoubleSpinner } from "@/assets";

import { RecetasTablerows } from "./RecetasTablerows";
import { useRecetasQuery } from "../hooks/queries/queries";
import type { recetaItem } from "../types/types";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { NoDataMessage } from "./NoDataMessage";

import { useRecetasContext } from "@/context/RecetasContext";

export const RecetasTableBody = () => {
  const { data: recetas, isFetching } = useRecetasQuery();
  const { recetaUnicaFiltro, recetaCompuestaFiltro, fechaSeleccionadaFiltro, searchTermFilter} = useRecetasContext();



  const getFilteredData = () => {
    let displayData: recetaItem[] = recetas || [];

    if (searchTermFilter) {
      displayData = displayData.filter((data)=> {
        if (data.nombre.toLowerCase().includes(searchTermFilter.toLowerCase()))
          return true
      })
    }

    if (recetaUnicaFiltro) { 
      displayData = displayData.filter((receta) => !receta.esCompuesta)
    }

    if (recetaCompuestaFiltro) { 
      displayData = displayData.filter((receta) => receta.esCompuesta)
    }

    if (fechaSeleccionadaFiltro) {
      displayData = displayData.filter((data)=> {
        if (data.fecha_creacion >= fechaSeleccionadaFiltro.from && data.fecha_creacion <= fechaSeleccionadaFiltro.to)
          return true
      })
    }

    return displayData
  }

  return (
    <>
      {isFetching ? (
        <PendingTubeSpinner
          size={28}
          extraClass="absolute bg-white opacity-50 h-full w-full"
        />
      ) : getFilteredData().length > 0 ? (
        <RecetasTablerows data={getFilteredData()} />
      ) : (
        <NoDataMessage />
      )}
    </>
  );
};
