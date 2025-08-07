import type { recetaDetallesItem } from "../types/types";
import { DetailsTableElement } from "./DetailsTableElement";

export const DetailsTable = ({
  detalles,
}: {
  detalles: recetaDetallesItem[];
}) => {
  return (
    <div className="flex items-center gap-20">
      <div className="flex flex-col min-w-[650px] w-[50%] border border-gray-300 rounded-md">
        <div className="grid grid-cols-2">
          <DetailsTableElement
            header="Componente"
            data={detalles}
            attribute="nombre"
            right={true}
          />
          <DetailsTableElement
            header="Tipo de componente"
            data={detalles}
            attribute="tipo"
          />
        </div>
      </div>
    </div>
  );
};
