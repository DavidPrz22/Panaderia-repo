import { useGetProductosReventa } from "../hooks/queries/queries";
import { PRTableRows } from "./PRTableRows";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useProductosReventaContext } from "@/context/ProductosReventaContext";

export const PRTableBody = () => {
  const { data: productosReventa, isFetching } = useGetProductosReventa();
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
  } = useProductosReventaContext();

  let displayData = productosReventa || [];

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
    if (!productosReventa || productosReventa.length === 0) {
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
    </>
  );
};