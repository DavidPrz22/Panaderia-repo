// import { useEffect } from "react";
// import { DoubleSpinner } from "@/assets";

import { useGetProductosIntermedios } from "../hooks/queries/queries";
import { PITableRows } from "./PITableRows";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export const PITableBody = () => {
  const { data: productosIntermedios, isFetching } = useGetProductosIntermedios();
  const {
    productosIntermediosSearchTerm,
    selectedUnidadesProduccion,
    selectedCategoriasIntermedio,
    agotadosFilter,
    bajoStockFilter,
    setSelectedUnidadesProduccion,
    setSelectedCategoriasIntermedio,
    setProductosIntermediosSearchTerm,
    setBajoStockFilter,
    setAgotadosFilter,
  } = useProductosIntermediosContext();

  let displayData = productosIntermedios || [];

  if (productosIntermediosSearchTerm) {
    const term = productosIntermediosSearchTerm.toLowerCase();
    displayData = displayData.filter(
      (p) =>
        p.nombre_producto.toLowerCase().includes(term) ||
        p.SKU.toLowerCase().includes(term) ||
        (p.categoria_nombre || "").toLowerCase().includes(term) ||
        (p.unidad_produccion_producto || "").toLowerCase().includes(term),
    );
  }
  if (selectedUnidadesProduccion.length > 0) {
    displayData = displayData.filter((p) =>
      selectedUnidadesProduccion.includes(p.unidad_produccion_producto),
    );
  }
  if (selectedCategoriasIntermedio.length > 0) {
    displayData = displayData.filter((p) =>
      selectedCategoriasIntermedio.includes(p.categoria_nombre),
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
    productosIntermediosSearchTerm.length > 0 ||
    selectedUnidadesProduccion.length > 0 ||
    selectedCategoriasIntermedio.length > 0 ||
    agotadosFilter ||
    bajoStockFilter;

  const clearFilters = () => {
    setProductosIntermediosSearchTerm("");
    setSelectedUnidadesProduccion([]);
    setSelectedCategoriasIntermedio([]);
    setBajoStockFilter(false);
    setAgotadosFilter(false);
  };

  const EmptyState = () => {
    if (!productosIntermedios || productosIntermedios.length === 0) {
      return (
        <div className="flex flex-col gap-2 justify-center h-full items-center text-center text-gray-600 py-16">
          <p className="font-semibold text-lg">No hay datos registrados</p>
          <p className="text-sm text-gray-500 max-w-sm">
            Registra un producto intermedio para comenzar.
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
        <PITableRows data={displayData} />
      ) : (
        <EmptyState />
      )}
    </>
  );
};
