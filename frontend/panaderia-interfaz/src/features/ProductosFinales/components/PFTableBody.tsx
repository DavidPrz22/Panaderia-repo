import { useGetProductosFinales } from "../hooks/queries/queries";
import { PFTableRows } from "./PFTablerows";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

export const PFTableBody = () => {
  const { data: productosFinales, isFetching } = useGetProductosFinales();
  const {
    productosFinalesSearchTerm,
    selectedUnidadesVenta,
    selectedCategoriasProductoFinal,
    setSelectedUnidadesVenta,
    setSelectedCategoriasProductoFinal,
    setProductosFinalesSearchTerm,
  } = useProductosFinalesContext();

  let displayData = productosFinales || [];

  if (productosFinalesSearchTerm) {
    const raw = productosFinalesSearchTerm.trim();
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

  if (selectedUnidadesVenta.length > 0) {
    displayData = displayData.filter((p) =>
      selectedUnidadesVenta.includes(p.unidad_venta),
    );
  }
  if (selectedCategoriasProductoFinal.length > 0) {
    displayData = displayData.filter((p) =>
      selectedCategoriasProductoFinal.includes(p.categoria),
    );
  }

  const anyFilterActive =
    productosFinalesSearchTerm.length > 0 ||
    selectedUnidadesVenta.length > 0 ||
    selectedCategoriasProductoFinal.length > 0;

  const handleClearFilters = () => {
    setProductosFinalesSearchTerm("");
    setSelectedUnidadesVenta([]);
    setSelectedCategoriasProductoFinal([]);
  };

  const EmptyState = () => {
    if (!productosFinales || productosFinales.length === 0) {
      return (
        <div className="flex flex-col gap-2 justify-center h-full items-center text-center text-gray-600 py-16">
          <p className="font-semibold text-lg">No hay datos registrados</p>
          <p className="text-sm text-gray-500 max-w-sm">
            Aún no se han cargado productos finales. Registra uno nuevo para comenzar.
          </p>
        </div>
      );
    }
    // There is base data, but filters/search produced zero results
    return (
      <div className="flex flex-col gap-3 justify-center h-full items-center text-center text-gray-600 py-16">
        <p className="font-semibold text-lg">Sin resultados</p>
        <p className="text-sm text-gray-500 max-w-sm">
          No hay coincidencias con los filtros o la búsqueda aplicada.
        </p>
        {anyFilterActive && (
          <button
            onClick={handleClearFilters}
            className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
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
        <PFTableRows data={displayData} />
      ) : (
        <EmptyState />
      )}
    </>
  );
};
