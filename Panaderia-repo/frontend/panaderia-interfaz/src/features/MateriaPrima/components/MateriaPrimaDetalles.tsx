import { useEffect } from "react";

import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import {
  EditarIcon,
  BorrarIcon,
  CerrarIcon,
  PlussignIcon,
} from "@/assets/DashboardAssets";
import { TubeSpinner } from "@/assets";

import Button from "../../../components/Button";
import Title from "@/components/Title";
import { LotesTable } from "./Lotes/LotesTable";
import { DeleteComponent } from "./DeleteComponent";
import MateriaPrimaFormShared from "./MateriaPrimaFormShared";
import { LotesMateriaPrimaFormShared } from "./Lotes/LotesMateriaPrimaFormShared";
import { LotesMateriaPrimaDetalles } from "./Lotes/LotesMateriaPrimaDetalles";

import { useDeleteMateriaPrimaMutation } from "../hooks/mutations/materiaPrimaMutations";
import { useLotesMateriaPrimaQuery } from "../hooks/queries/queries";
import { TitleDetails } from "@/components/TitleDetails";
import { DetailsTable } from "./DetailsTable";

export const MaterialPrimaDetalles = () => {
  const {
    showMateriaprimaDetalles,
    setShowMateriaprimaDetalles,
    materiaprimaId,
    materiaprimaDetalles,
    setMateriaprimaDetalles,
    registroDelete,
    setRegistroDelete,
    updateRegistro,
    setUpdateRegistro,
    showLotesForm,
    setShowLotesForm,
    lotesForm,
    setLotesForm,
    showLotesMateriaPrimaDetalles,
  } = useMateriaPrimaContext();

  const { mutateAsync: deleteMateriaPrima, isPending } =
    useDeleteMateriaPrimaMutation(handleClose, materiaprimaId!);

  const { data: lotesData, isFetching: isLoadingLotes } =
    useLotesMateriaPrimaQuery(materiaprimaId, showMateriaprimaDetalles);

  useEffect(() => {
    if (lotesData && lotesData.success) {
      setLotesForm(lotesData.lotes);
    }
  }, [lotesData, setLotesForm, showMateriaprimaDetalles]);

  if (!showMateriaprimaDetalles) return <></>;

  function handleClose() {
    setShowMateriaprimaDetalles(false);
    setMateriaprimaDetalles(null);
    setUpdateRegistro(false);
  }

  const handleCloseUpdate = () => {
    setUpdateRegistro(false);
  };

  if (showLotesMateriaPrimaDetalles) {
    return <LotesMateriaPrimaDetalles />;
  }

  if (showLotesForm) {
    return (
      <LotesMateriaPrimaFormShared
        title="Nuevo Lote"
        onClose={() => {
          setShowLotesForm(false);
          setShowMateriaprimaDetalles(true);
        }}
        onSubmitSuccess={() => {
          setShowLotesForm(false);
          setShowMateriaprimaDetalles(true);
        }}
      />
    );
  }

  if (updateRegistro && materiaprimaDetalles) {
    return (
      <MateriaPrimaFormShared
        isUpdate={true}
        initialData={materiaprimaDetalles}
        title="Editar Materia Prima"
        onClose={handleCloseUpdate}
        onSubmitSuccess={() => {
          handleClose();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 mx-8 border border-gray-200 p-5 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center">
        <Title>{materiaprimaDetalles?.nombre || "-"}</Title>
        <div className="flex gap-2">
          <Button type="edit" onClick={() => setUpdateRegistro(true)}>
            <div className="flex items-center gap-2">
              Editar
              <img src={EditarIcon} alt="Editar" />
            </div>
          </Button>
          <Button
            type="delete"
            onClick={() => {
              setRegistroDelete(true);
            }}
          >
            <div className="flex items-center gap-2">
              Eliminar
              <img src={BorrarIcon} alt="Eliminar" />
            </div>
          </Button>
          <div className="ml-6">
            <Button type="close" onClick={handleClose}>
              <img src={CerrarIcon} alt="Cerrar" />
            </Button>
          </div>
        </div>
      </div>

      {registroDelete && materiaprimaId !== null && (
        <DeleteComponent
          deleteFunction={() => deleteMateriaPrima(materiaprimaId!)}
          isLoading={isPending}
        />
      )}
      <div className="flex flex-col gap-6">
        <TitleDetails>Detalles</TitleDetails>
        {materiaprimaDetalles && (
          <DetailsTable materiaprimaDetalles={materiaprimaDetalles} />
        )}
      </div>

      <div className="flex flex-col gap-4 mt-5 h-full">
        <div className="flex justify-between items-center pr-5">
          <Title extraClass="text-blue-600">Lotes de materia prima</Title>
          <Button
            type="add"
            onClick={() => {
              setShowLotesForm(true);
            }}
          >
            <div className="flex items-center gap-2">
              Agregar Lote
              <img
                className="p-0.5 border border-white rounded-full size-7"
                src={PlussignIcon}
                alt="agregar"
              />
            </div>
          </Button>
        </div>
        {isLoadingLotes ? (
          <div className="flex justify-center items-center h-full rounded-md border border-gray-300">
            <img src={TubeSpinner} alt="Cargando..." className="size-28" />
          </div>
        ) : lotesForm.length > 0 ? (
          <LotesTable lotes={lotesForm} />
        ) : (
          <div className="flex justify-center items-center h-full rounded-md border border-gray-300">
            <p className="text-lg text-gray-500 font-bold font-[Roboto]">
              No hay lotes registrados
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
