import Title from "@/components/Title";
import Button from "../../../../components/Button";
import { DetailsField } from "../../../../components/DetailsField";
import { DetailFieldValue } from "../../../../components/DetailFieldValue";
import { DeleteComponent } from "../DeleteComponent";
import { LotesMateriaPrimaFormShared } from "./LotesMateriaPrimaFormShared";
import {
  EditarIcon,
  BorrarIcon,
  CerrarIcon,
  CheckIcon,
} from "@/assets/DashboardAssets";
import { TubeSpinner } from "@/assets";

import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import {
  useActivateLoteMateriaPrimaMutation,
  useDeleteLoteMateriaPrimaMutation,
  useInactivateLoteMateriaPrimaMutation,
} from "../../hooks/mutations/materiaPrimaMutations";

import { useAuth } from "@/context/AuthContext";
import { userHasPermission } from "@/features/Authentication/lib/utils";

export const LotesMateriaPrimaDetalles = () => {
  const {
    materiaprimaDetalles,
    lotesMateriaPrimaDetalles,
    registroDelete,
    updateRegistro,
    setShowMateriaprimaDetalles,
    setShowLotesMateriaPrimaDetalles,
    setUpdateRegistro,
    setRegistroDelete,
  } = useMateriaPrimaContext();

  const { user } = useAuth();

  const { mutateAsync: deleteLote, isPending: isLoadingDelete } =
    useDeleteLoteMateriaPrimaMutation(materiaprimaDetalles?.id, handleClose);

  const { mutateAsync: activateLote, isPending: isLoadingActivate } =
    useActivateLoteMateriaPrimaMutation(materiaprimaDetalles?.id, handleClose);

  const { mutateAsync: inactivateLote, isPending: isLoadingInactivate } =
    useInactivateLoteMateriaPrimaMutation(materiaprimaDetalles?.id, handleClose);
  const handleEdit = () => {
    setUpdateRegistro(true);
  };

  function handleClose() {
    setShowMateriaprimaDetalles(true);
    setUpdateRegistro(false);
    setShowLotesMateriaPrimaDetalles(false);
    setRegistroDelete(false);
  }

  const handleActivate = async () => {
    if (lotesMateriaPrimaDetalles?.id) {
      activateLote(lotesMateriaPrimaDetalles.id);
    }
  };

  const handleInactivate = async () => {
    if (lotesMateriaPrimaDetalles?.id) {
      inactivateLote(lotesMateriaPrimaDetalles.id);
    }
  };

  const canUserEditLot = userHasPermission(user!, 'lots', 'edit')
  const canUserDeleteLot = userHasPermission(user!, 'lots', 'delete')

  if (updateRegistro && lotesMateriaPrimaDetalles) {
    return (
      <LotesMateriaPrimaFormShared
        title="Editar Lote"
        isUpdate={true}
        initialData={lotesMateriaPrimaDetalles}
        onClose={() => {
          setUpdateRegistro(false);
          setShowLotesMateriaPrimaDetalles(true);
        }}
        onSubmitSuccess={() => {
          setUpdateRegistro(false);
          setShowLotesMateriaPrimaDetalles(false);
        }}
      />
    );
  }

  const handleActivation = () => {
    if (lotesMateriaPrimaDetalles?.estado === "INACTIVO") {
      return (
        <div className="flex justify-end mt-auto mr-2">
          <Button type="add" onClick={handleActivate}>
            <div className="flex items-center gap-2 text-xl font-semibold">
              Activar Lote
              <img src={CheckIcon} alt="Activar Lote" className="size-7" />
            </div>
          </Button>
        </div>
      )
    } else if (lotesMateriaPrimaDetalles?.estado === "DISPONIBLE") {
      return (
      <div className="flex justify-end mt-auto mr-2">
          <Button type="delete" onClick={handleInactivate}>
            <div className="flex items-center gap-2 text-xl font-semibold">
              Inactivar Lote
              <img src={CheckIcon} alt="Inactivar Lote" className="size-7" />
            </div>
          </Button>
        </div>
      )
    }
  }

  return (
    <div className="flex flex-col gap-5 mx-8 border border-gray-200 p-5 rounded-lg shadow-md h-full relative">
      {(isLoadingActivate || isLoadingInactivate) && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-50">
          <img src={TubeSpinner} alt="Cargando..." className="size-28" />
        </div>
      )}
      <div className="flex justify-between items-center">
        <Title>Detalles de lote de materia prima</Title>
        <div className="flex gap-2">
          {canUserEditLot && (

            <Button type="edit" onClick={handleEdit}>
              <div className="flex items-center gap-2">
                Editar
                <img src={EditarIcon} alt="Editar" />
              </div>
            </Button>
          )}
          {canUserDeleteLot && (
          <Button type="delete" onClick={() => setRegistroDelete(true)}>
            <div className="flex items-center gap-2">
              Eliminar
              <img src={BorrarIcon} alt="Eliminar" />
            </div>
          </Button>
          )}
          <div className="ml-6">
            <Button type="close" onClick={handleClose}>
              <img src={CerrarIcon} alt="Cerrar" />
            </Button>
          </div>
        </div>
      </div>
      {registroDelete && lotesMateriaPrimaDetalles?.id !== undefined && (
        <DeleteComponent
          deleteFunction={() =>
            deleteLote(lotesMateriaPrimaDetalles.id as number)
          }
          isLoading={isLoadingDelete}
        />
      )}
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-semibold font-[Roboto] text-blue-600 border-b border-gray-300 pb-2">
          Detalles
        </h2>

        <div className="flex items-center gap-20">
          <div className="grid grid-rows-9 grid-cols-1 gap-2">
            <DetailsField>
              <div className="text-lg">Materia prima</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Proveedor</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Fecha de recepción</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Fecha de caducidad</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Cantidad recibida</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Stock actual</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Costo unitario USD</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Detalles Orden de Compra</div>
            </DetailsField>
            <DetailsField>
              <div className="text-lg">Estado</div>
            </DetailsField>
          </div>
          <div className="grid grid-rows-9 grid-cols-1 gap-2">
            <DetailFieldValue>
              <div className="text-lg">
                {materiaprimaDetalles?.nombre || "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.proveedor?.nombre_comercial || "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.fecha_recepcion
                  ? new Date(
                      lotesMateriaPrimaDetalles?.fecha_recepcion,
                    ).toLocaleDateString("es-ES")
                  : "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.fecha_caducidad
                  ? new Date(
                      lotesMateriaPrimaDetalles?.fecha_caducidad,
                    ).toLocaleDateString("es-ES")
                  : "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.cantidad_recibida || "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.stock_actual_lote || "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.costo_unitario_usd || "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.detalle_oc || "-"}
              </div>
            </DetailFieldValue>
            <DetailFieldValue>
              <div className="text-lg">
                {lotesMateriaPrimaDetalles?.estado || "-"}
              </div>
            </DetailFieldValue>
          </div>
          {handleActivation()}
        </div>
      </div>
      
    </div>
  );
};
