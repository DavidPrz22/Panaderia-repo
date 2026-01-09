import { useEffect, useMemo, useReducer } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createMateriaPrimaListQueryOptions } from "@/features/MateriaPrima/hooks/queries/materiaPrimaQueryOptions";
import { DoubleSpinner } from "@/assets";
import { Paginator } from "@/components/Paginator";

import type { MateriaPrimaList } from "@/features/MateriaPrima/types/types";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";

import { TableRows } from "./TableRows";

type PaginatorActions = "next" | "previous" | "base";

export const TableBody = () => {
  const {
    listaMateriaPrimaCached,
    setListaMateriaPrimaCached,
    listaMateriaPrimaFiltered,
    filteredApplied,
    listaMateriaPrimaFilteredInputSearch,
    MPFilteredInputSearchApplied,
    inputfilterDoubleApplied,
    currentPage,
    setCurrentPage,
  } = useMateriaPrimaContext();

  const {
    data: materiaPrimaPagination,
    fetchNextPage,
    hasNextPage,
    isFetching: isMateriaPrimaListFetching,
  } = useInfiniteQuery(createMateriaPrimaListQueryOptions());

  // Update cached list when pagination data changes
  useEffect(() => {
    if (materiaPrimaPagination?.pages[0]) {
      const allResults = materiaPrimaPagination.pages.flatMap(page => page.results);
      setListaMateriaPrimaCached(allResults);
    }
  }, [materiaPrimaPagination, setListaMateriaPrimaCached]);

  // Handle pagination state with reducer for complex logic
  const [page, dispatch] = useReducer(
    (state: number, action: { type: PaginatorActions; payload?: number }) => {
      switch (action.type) {
        case "next":
          if (materiaPrimaPagination) {
            if (state < (materiaPrimaPagination.pages?.length || 0) - 1) return state + 1;
            if (hasNextPage) fetchNextPage();
            return state + 1;
          }
          return state;
        case "previous":
          return Math.max(0, state - 1);
        case "base":
          const targetPage = action.payload ?? 0;
          // Check if we need to fetch more pages
          if (targetPage >= (materiaPrimaPagination?.pages?.length || 0) && hasNextPage) {
            fetchNextPage();
          }
          return targetPage;
        default:
          return state;
      }
    },
    currentPage
  );

  // Update context page when local page changes
  useEffect(() => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  }, [page, currentPage, setCurrentPage]);

  // Calculate total pages
  const pagesCount = useMemo(() => {
    const resultCount = materiaPrimaPagination?.pages?.[0]?.count || 0;
    const entriesPerPage = 15;
    return Math.ceil(resultCount / entriesPerPage);
  }, [materiaPrimaPagination]);

  // Get current page data
  const currentPageData = materiaPrimaPagination?.pages[page]?.results || [];

  // Get display data considering filters
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

    // If no filters applied, return current page data
    return currentPageData.length > 0 ? currentPageData : null;
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
      {/* Show paginator only if there are multiple pages and no active filters */}
      {!filteredApplied && !MPFilteredInputSearchApplied && !inputfilterDoubleApplied && pagesCount > 1 && (
        <div className="mt-4 flex justify-center">
          <Paginator
            previousPage={page > 0}
            nextPage={hasNextPage || page < pagesCount - 1}
            pages={Array.from({ length: pagesCount }, (_, i) => i)}
            currentPage={page}
            onClickPrev={() => dispatch({ type: "previous" })}
            onClickPage={(p) => dispatch({ type: "base", payload: p })}
            onClickNext={() => dispatch({ type: "next" })}
          />
        </div>
      )}
    </>
  );
};
