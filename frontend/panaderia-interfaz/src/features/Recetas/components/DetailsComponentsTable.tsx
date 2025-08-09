

import { DetailsTableElement } from "./DetailsTableElement";
import { useRecetasContext } from "@/context/RecetasContext";

export const DetailsComponentsTable = () => {
  const { recetaDetalles } = useRecetasContext();

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold text-blue-700 font-[Roboto]">Componentes de la receta:</div>
      <div className="flex flex-col min-w-[650px] w-[50%] border border-gray-300 rounded-md">
        <div className="grid grid-cols-2">
          <DetailsTableElement
            header="Componente"
            data={recetaDetalles!.componentes}
            attribute="nombre"
            right={true}
          />
          <DetailsTableElement
            header="Tipo de componente"
            data={recetaDetalles!.componentes}
            attribute="tipo"
          />
        </div>
      </div>
    </div>
  );
};
