import { TubeSpinner } from "@/assets";

import { PFTableBody } from "./PFTableBody";
import { PFTableHeader } from "./PFHeader";

export default function ProductosFinalesLista({
  isLoadingDetalles,
}: {
  isLoadingDetalles: boolean;
}) {
  return (
    <>
      <div className="relative mx-8 border border-gray-200 rounded-md min-h-[80%]">
        <PFTableHeader
          headers={[
            "ID",
            "Nombre",
            "SKU",
            "Unidad de Venta",
            "Precio (USD)",
            "Punto de reorden",
            "Stock",
            "Categoria"
          ]}
        />
        <PFTableBody />
        {isLoadingDetalles ? (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-50">
            <img src={TubeSpinner} alt="Cargando..." className="size-28" />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}