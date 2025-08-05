import { TubeSpinner } from "@/assets";
import { RecetasTableHeader } from "./RecetasTableHeader";
import { RecetasTableBody } from "./RecetasTableBody";


export default function RecetasLista({isLoadingDetalles}: {isLoadingDetalles: boolean}) {

  return (
    <>
        <div className="relative mx-8 border border-gray-200 rounded-md min-h-[80%]">
          <RecetasTableHeader
            headers={[
              "ID",
              "Nombre",
              "SKU",
              "Precio Promedio",
              "Stock",
              "Categoria",
              "Punto de reorden",
              "Fecha de creación",
            ]}
          />
          <RecetasTableBody />
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