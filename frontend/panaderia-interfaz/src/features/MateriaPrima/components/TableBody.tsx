import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createMateriaPrimaListQueryOptions } from "@/features/MateriaPrima/hooks/queries/materiaPrimaQueryOptions";
import { DoubleSpinner } from "@/assets";

import type { MateriaPrimaList } from "@/features/MateriaPrima/types/types";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";

import { TableRows } from "./TableRows";

export const TableBody = () => {
  const {
    listaMateriaPrimaCached,
    setListaMateriaPrimaCached,
    listaMateriaPrimaFiltered,
    filteredApplied,
    listaMateriaPrimaFilteredInputSearch,
    MPFilteredInputSearchApplied,
    inputfilterDoubleApplied,
  } = useMateriaPrimaContext();

  const { data: materiaPrimaList, isFetching: isMateriaPrimaListFetching } =
    useQuery(createMateriaPrimaListQueryOptions());

  useEffect(() => {
    if (materiaPrimaList) {
      setListaMateriaPrimaCached(materiaPrimaList);
    }
  }, [materiaPrimaList, setListaMateriaPrimaCached]);

  const getDisplayData = (): MateriaPrimaList[] | null => {
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

    return listaMateriaPrimaCached.length > 0 ? listaMateriaPrimaCached : null;
  };

  const displayData = getDisplayData()?.sort((a, b) => a.id - b.id);

  const NoDataMessage = () => (
    <div className="flex justify-center h-full items-center font-bold text-2xl text-gray-700">
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
