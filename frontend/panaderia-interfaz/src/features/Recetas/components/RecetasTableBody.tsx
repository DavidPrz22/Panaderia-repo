import { RecetasTablerows } from "./RecetasTablerows";
import { useRecetasQuery } from "../hooks/queries/queries";
import type { recetaItem } from "../types/types";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { NoDataMessage } from "./NoDataMessage";
import { useRecetasContext } from "@/context/RecetasContext";
import { useEffect, useMemo, useReducer } from "react";
import { Paginator } from "@/components/Paginator";

type PaginatorActions = "next" | "previous" | "base";

export const RecetasTableBody = () => {
  const {
    data: recetasPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useRecetasQuery();

  const {
    recetaUnicaFiltro,
    recetaCompuestaFiltro,
    fechaSeleccionadaFiltro,
    searchTermFilter,
    currentPage,
    setCurrentPage
  } = useRecetasContext();

  // Handle pagination state with reducer for complex logic
  const [page, dispatch] = useReducer(
    (state: number, action: { type: PaginatorActions; payload?: number }) => {
      switch (action.type) {
        case "next":
          if (recetasPagination) {
            if (state < (recetasPagination.pages?.length || 0) - 1) return state + 1;
            if (hasNextPage) fetchNextPage();
            return state + 1;
          }
          return state;
        case "previous":
          return Math.max(0, state - 1);
        case "base":
          const targetPage = action.payload ?? 0;
          // Check if we need to fetch more pages
          if (targetPage >= (recetasPagination?.pages?.length || 0) && hasNextPage) {
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
    const resultCount = recetasPagination?.pages?.[0]?.count || 0;
    const entriesPerPage = 15;
    return Math.ceil(resultCount / entriesPerPage);
  }, [recetasPagination]);

  // Get current page data
  const currentPageData = recetasPagination?.pages[page]?.results || [];

  const getFilteredData = () => {
    let displayData: recetaItem[] = currentPageData;

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

  const anyFilterActive = searchTermFilter || recetaUnicaFiltro || recetaCompuestaFiltro || fechaSeleccionadaFiltro;

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
      {/* Show paginator only if there are multiple pages and no active filters */}
      {!anyFilterActive && pagesCount > 1 && (
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
