import { TubeSpinner } from "@/assets";

import { PITableBody } from "./PITableBody";
import { PITableHeader } from "./PITableHeader";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";
import { useGetProductosIntermedios } from "../hooks/queries/queries";

export default function ProductosIntermediosLista() {
  const { isLoadingDetalles } = useProductosIntermediosContext();
  const { isFetching } = useGetProductosIntermedios();

  return (
    <>
      <div className="relative mx-8 border border-gray-200 rounded-md min-h-[80%]">
        <PITableHeader
          headers={[
            "ID",
            "Nombre",
            "SKU",
            "Stock",
            "Punto de reorden",
            "Categoria",
            "Fecha de creación",
          ]}
        />
        <PITableBody />
        {isLoadingDetalles && !isFetching ? (
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
