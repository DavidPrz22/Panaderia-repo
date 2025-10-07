import { TubeSpinner } from "@/assets";

import { PRTableBody } from "./PRTableBody";
import { PRTableHeader } from "./PRTableHeader";
import { useGetProductosReventaDetalles } from "../hooks/queries/queries";
import { useProductosReventaContext } from "@/context/ProductosReventaContext";
export default function ProductosReventaLista() {
  
  const { productoReventaId } = useProductosReventaContext();


  const { isLoading } = useGetProductosReventaDetalles(productoReventaId!);


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
            "Unidad de inventario",
            "Fecha de creación",
          ]}
        />
        <PRTableBody />
        {isLoading ? (
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