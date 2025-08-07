
import { DetailsTableElement } from "./DetailsTableElement";
import { useRecetasContext } from "@/context/RecetasContext";

export const DetailsTable = () => {
  const { recetaDetalles } = useRecetasContext();

  return (
    <div className="flex items-center gap-20">
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
