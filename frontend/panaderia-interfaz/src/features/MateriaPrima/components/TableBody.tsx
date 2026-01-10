import { DoubleSpinner } from "@/assets";

import type { MateriaPrimaListServer } from "@/features/MateriaPrima/types/types";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";

import { TableRows } from "./TableRows";

type TableBody = {
  currentPageData: MateriaPrimaListServer[];
  isMateriaPrimaListFetching: Boolean;
}

export const TableBody = ({ currentPageData, isMateriaPrimaListFetching }: TableBody) => {
  console.log(currentPageData, isMateriaPrimaListFetching);
  const {
    listaMateriaPrimaFiltered,
    filteredApplied,
    listaMateriaPrimaFilteredInputSearch,
    MPFilteredInputSearchApplied,
    inputfilterDoubleApplied,
  } = useMateriaPrimaContext();


  // Get display data considering filters
  const getDisplayData = (): MateriaPrimaListServer[] | null => {
    if (inputfilterDoubleApplied) {
      return listaMateriaPrimaFiltered.length > 0
        ? listaMateriaPrimaFiltered
        : null;
    }

    if (MPFilteredInputSearchApplied) {
      return listaMateriaPrimaFilteredInputSearch.length > 0
        ? listaMateriaPrimaFilteredInputSearch
        : null;
    }

    if (filteredApplied) {
      return listaMateriaPrimaFiltered.length > 0
        ? listaMateriaPrimaFiltered
        : null;
    }

    // If no filters applied, return current page data
    return currentPageData.length > 0 ? currentPageData : null;
  };

  const displayData = getDisplayData()?.sort((a, b) => a.id - b.id);

  const NoDataMessage = () => (
    <div className="flex justify-center min-h-[80%] items-center font-bold text-2xl text-gray-700">
      No hay datos Registrados
    </div>
  );

  return (
    <>
      {isMateriaPrimaListFetching ? (
        <div className="flex justify-center h-full font-bold text-2xl text-black items-center">
          <img src={DoubleSpinner} alt="Cargando..." className="size-28" />
          <span className="ml-2">Cargando...</span>
        </div>
      ) : displayData ? (
        <TableRows data={displayData} />
      ) : (
        <NoDataMessage />
      )}
    </>
  );
};
