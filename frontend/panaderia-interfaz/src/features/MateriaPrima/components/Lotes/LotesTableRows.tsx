import type { LoteMateriaPrima } from "@/features/MateriaPrima/types/types";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userHasPermission } from "@/features/Authentication/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,

} from "@/components/ui/alert-dialog";
import { useDeleteLoteMateriaPrimaMutation } from "../../hooks/mutations/materiaPrimaMutations";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";


export const LotesTableRows = ({
  data,
  onClick,
}: {
  data: LoteMateriaPrima[];
  onClick: (id: number) => void;
}) => {
  const { user } = useAuth();
  const canDelete = user ? userHasPermission(user, "lots", "delete") : false;
  const { materiaprimaId } = useMateriaPrimaContext();
  const [lotToDelete, setLotToDelete] = useState<number | null>(null);

  const mutation = useDeleteLoteMateriaPrimaMutation(materiaprimaId!, () => setLotToDelete(null));

  const mapLotes = (lotes: LoteMateriaPrima[]) => {
    return lotes.map((item) => (
      <div
        onClick={() => onClick(item.id)}
        key={item.id}
        className={`cursor-pointer hover:bg-gray-100 grid grid-cols-8 items-center px-8 py-4 border-b border-gray-300 bg-white font-[Roboto] text-sm`}
      >
        <div>{item.fecha_recepcion}</div>
        <div>{item.fecha_caducidad}</div>
        <div>{item.cantidad_recibida}</div>
        <div>{item.stock_actual_lote}</div>
        <div>{item.costo_unitario_usd}</div>
        <div>{item.proveedor}</div>
        <div className="font-medium px-1">{item.estado}</div>

        {canDelete && (
          <button
            className="text-red-600 hover:text-red-600 w-fit p-2 rounded-full hover:bg-red-100"
            onClick={(e) => {
              e.stopPropagation();
              setLotToDelete(item.id);
            }}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    ));
  }
  const lotesDisponibles = sortData(data.filter((lote) => lote.estado === "DISPONIBLE"));
  const restoDeLotes = sortData(data.filter((lote) => lote.estado !== "DISPONIBLE"));

  return (
    <>
      {data.length > 0 && mapLotes(lotesDisponibles)}
      {data.length > 0 && mapLotes(restoDeLotes)}

      <AlertDialog open={!!lotToDelete} onOpenChange={(open) => !open && setLotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro de eliminar este lote?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el lote y actualizará el stock disponible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={async (e) => {
                e.preventDefault();
                if (lotToDelete) await mutation.mutateAsync(lotToDelete);
              }}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
