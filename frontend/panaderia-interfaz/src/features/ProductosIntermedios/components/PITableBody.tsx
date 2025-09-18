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
    setSelectedUnidadesProduccion,
    setSelectedCategoriasIntermedio,
    setProductosIntermediosSearchTerm,
  } = useProductosIntermediosContext();

  let displayData = productosIntermedios || [];

  if (productosIntermediosSearchTerm) {
    const raw = productosIntermediosSearchTerm.trim();
    if (raw.length > 0) {
      const normalize = (s: string) =>
        s
          .toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
      const term = normalize(raw);
      displayData = displayData.filter((p) => {
        const nombre = normalize(p.nombre_producto);
        const sku = normalize(p.SKU);
        return nombre.includes(term) || sku.includes(term);
      });
    }
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

  const anyFilterActive =
    productosIntermediosSearchTerm.length > 0 ||
    selectedUnidadesProduccion.length > 0 ||
    selectedCategoriasIntermedio.length > 0;

  const clearFilters = () => {
    setProductosIntermediosSearchTerm("");
    setSelectedUnidadesProduccion([]);
    setSelectedCategoriasIntermedio([]);
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
