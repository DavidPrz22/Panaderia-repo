import { TubeSpinner } from "@/assets";

import { TableBody } from "@/features/MateriaPrima/components/TableBody";
import { TableHeader } from "@/features/MateriaPrima/components/TableHeader";

export default function MateriaPrimaLista({
  isLoadingDetalles,
}: {
  isLoadingDetalles: boolean;
}) {
  return (
    <>
      <div className="relative mx-8 border border-gray-200 rounded-md min-h-[80%]">
        <TableHeader
          headers={[
            "Id",
            "Nombre",
            "Unidad de medida",
            "Categoria",
            "Cantidad",
            "Punto de reorden",
            "Fecha de creación",
          ]}
        />
        <TableBody />
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
