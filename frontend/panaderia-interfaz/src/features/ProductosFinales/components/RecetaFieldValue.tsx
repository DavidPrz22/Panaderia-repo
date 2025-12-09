import { BorrarIcon } from "@/assets/DashboardAssets";
import { DetailFieldValue } from "@/components/DetailFieldValue";
import type { receta_relacionada } from "../types/types";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";
import {userHasPermission} from "@/features/Authentication/lib/utils";
import { useAuth } from "@/context/AuthContext";

export const RecetaFieldValue = ({
  recetaRelacionada,
}: {
  recetaRelacionada: receta_relacionada;
}) => {
  const { user } = useAuth();
  const userCanEdit = userHasPermission(user!, 'productos_elaborados', 'edit');
  const { setDeleteRecetaRelacionada } = useProductosFinalesContext();

  const HandleRemoveReceta = () => {
    setDeleteRecetaRelacionada(true);
  };

  return (
    <DetailFieldValue extraClass="min-h-[25px] flex items-center">
      {recetaRelacionada !== false ? (
        <div className="flex items-center gap-2 w-full">
          <span>{recetaRelacionada?.nombre}</span>
          {userCanEdit && (
            <button
              onClick={HandleRemoveReceta}
              className="bg-red-500 text-white p-1 rounded-md hover:bg-red-600 cursor-pointer ml-auto"
            >
              <img src={BorrarIcon} alt="Eliminar" className="size-4" />
            </button>
          )}
        </div>
      ) : (
        "No hay receta relacionada"
      )}
    </DetailFieldValue>
  );
};
