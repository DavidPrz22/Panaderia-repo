import { useGetProductosReventa } from "../hooks/queries/queries";
import { PRTableRows } from "./PRTableRows";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useProductosReventaContext } from "@/context/ProductosReventaContext";
import { useEffect, useMemo, useReducer } from "react";
import { Paginator } from "@/components/Paginator";

type PaginatorActions = "next" | "previous" | "base";

export const PRTableBody = () => {
  const {
    data: productosPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useGetProductosReventa();

  const {
    productosReventaSearchTerm,
    selectedCategoriasReventa,
    selectedUnidadesInventario,
    agotadosFilter,
    bajoStockFilter,
    setProductosReventaSearchTerm,
    setSelectedCategoriasReventa,
    setSelectedUnidadesInventario,
    setBajoStockFilter,
    setAgotadosFilter,
    currentPage,
    setCurrentPage,
  } = useProductosReventaContext();

  // Handle pagination state with reducer for complex logic
  const [page, dispatch] = useReducer(
    (state: number, action: { type: PaginatorActions; payload?: number }) => {
      switch (action.type) {
        case "next":
          if (productosPagination) {
            if (state < (productosPagination.pages?.length || 0) - 1) return state + 1;
            if (hasNextPage) fetchNextPage();
            return state + 1;
          }
          return state;
        case "previous":
          return Math.max(0, state - 1);
        case "base":
          const targetPage = action.payload ?? 0;
          // Check if we need to fetch more pages
          if (targetPage >= (productosPagination?.pages?.length || 0) && hasNextPage) {
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
    const resultCount = productosPagination?.pages?.[0]?.count || 0;
    const entriesPerPage = 15;
    return Math.ceil(resultCount / entriesPerPage);
  }, [productosPagination]);

  // Get current page data
  const currentPageData = productosPagination?.pages[page]?.results || [];

  // Apply filters to current page data
  let displayData = currentPageData;

  if (productosReventaSearchTerm) {
    const term = productosReventaSearchTerm.toLowerCase();
    displayData = displayData.filter(
      (p) =>
        p.nombre_producto.toLowerCase().includes(term) ||
        (p.SKU || "").toLowerCase().includes(term) ||
        (p.categoria_nombre || "").toLowerCase().includes(term) ||
        (p.unidad_base_inventario_nombre || "").toLowerCase().includes(term),
    );
  }

  if (selectedCategoriasReventa.length > 0) {
    displayData = displayData.filter((p) =>
      selectedCategoriasReventa.includes(p.categoria_nombre),
    );
  }

  if (selectedUnidadesInventario.length > 0) {
    displayData = displayData.filter((p) =>
      p.unidad_base_inventario_nombre && selectedUnidadesInventario.includes(p.unidad_base_inventario_nombre)
    );
  }

  if (agotadosFilter && bajoStockFilter) {
    displayData = displayData.filter((p) => Number(p.stock_actual) === 0 || Number(p.stock_actual) < Number(p.punto_reorden));
  }
  else if (agotadosFilter) {
    displayData = displayData.filter((p) => Number(p.stock_actual) === 0);
  } else if (bajoStockFilter) {
    displayData = displayData.filter((p) => Number(p.stock_actual) < Number(p.punto_reorden));
  }

  const anyFilterActive =
    productosReventaSearchTerm.length > 0 ||
    selectedCategoriasReventa.length > 0 ||
    selectedUnidadesInventario.length > 0 ||
    agotadosFilter ||
    bajoStockFilter;

  const clearFilters = () => {
    setProductosReventaSearchTerm("");
    setSelectedCategoriasReventa([]);
    setSelectedUnidadesInventario([]);
    setBajoStockFilter(false);
    setAgotadosFilter(false);
  };

  const EmptyState = () => {
    if (!productosPagination || productosPagination.pages[0]?.results?.length === 0) {
      return (
        <div className="flex flex-col gap-2 justify-center h-full items-center text-center text-gray-600 py-16">
          <p className="font-semibold text-lg">No hay datos registrados</p>
          <p className="text-sm text-gray-500 max-w-sm">
            Registra un producto de reventa para comenzar.
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-3 justify-center h-full items-center text-center text-gray-600 py-16">
        <p className="font-semibold text-lg">Sin resultados</p>
        <p className="text-sm text-gray-500 max-w-sm">
          No hay coincidencias con los filtros o la búsqueda aplicada.
        </p>
        {anyFilterActive && (
          <button
            onClick={clearFilters}
            className="text-xs px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  };

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
        <EmptyState />
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