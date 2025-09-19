import { BorrarIcon } from "@/assets/DashboardAssets";
import { DetailFieldValue } from "@/components/DetailFieldValue";
import type { RecetaRelacionada } from "../types/types";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export const RecetaFieldValue = ({
  recetaRelacionada,
}: {
  recetaRelacionada: RecetaRelacionada;
}) => {
  const { setDeleteRecetaRelacionada } = useProductosIntermediosContext();

  const HandleRemoveReceta = () => {
    setDeleteRecetaRelacionada(true);
  };

  return (
    <DetailFieldValue extraClass="min-h-[25px] flex items-center">
      {recetaRelacionada !== false ? (
        <div className="flex items-center gap-2 w-full">
          <span>{recetaRelacionada?.nombre}</span>
          <button
            onClick={HandleRemoveReceta}
            className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 cursor-pointer ml-auto"
          >
            <img src={BorrarIcon} alt="Eliminar" className="size-4" />
          </button>
        </div>
      ) : (
        "No hay receta relacionada"
      )}
    </DetailFieldValue>
  );
};
