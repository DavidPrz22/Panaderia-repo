import { TubeSpinner } from "@/assets";

import { PRTableBody } from "./PRTableBody";
import { PRTableHeader } from "./PRTableHeader";

export default function ProductosReventaLista({
  isLoadingDetalles,
}: {
  isLoadingDetalles: boolean;
}) {
  return (
    <>
      <div className="relative mx-8 border border-gray-200 rounded-md min-h-[80%]">
        <PRTableHeader
          headers={[
            "ID",
            "Nombre",
            "SKU",
            "Stock",
            "Precio Venta",
            "Categoría",
            "Marca",
            "Fecha de creación",
          ]}
        />
        <PRTableBody />
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