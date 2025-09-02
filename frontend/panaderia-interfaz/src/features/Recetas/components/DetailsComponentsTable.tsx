import { DetailsTableElement } from "./DetailsTableElement";
import { useRecetasContext } from "@/context/RecetasContext";

export const DetailsComponentsTable = () => {
  const { recetaDetalles } = useRecetasContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-blue-700 font-[Roboto]">
        Componentes de la receta:
      </div>
      <div className="flex flex-col min-w-[650px] w-[50%] border border-gray-300 border-b-0 border-r-0 rounded-md">
        <div className="grid grid-cols-[1fr_1fr_0.5fr_0.5fr]">
          <DetailsTableElement
            header="Componente"
            data={recetaDetalles!.componentes}
            attribute="nombre"
          />
          <DetailsTableElement
            header="Tipo de componente"
            data={recetaDetalles!.componentes}
            attribute="tipo"
          />
          <DetailsTableElement
            header="Cantidad"
            data={recetaDetalles!.componentes}
            attribute="cantidad"
          />
          <DetailsTableElement
            header="Unidad"
            data={recetaDetalles!.componentes}
            attribute="unidad_medida"
          />
        </div>
      </div>
    </div>
  );
};
