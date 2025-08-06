import { DeleteComponent } from "./DeleteComponent";
import { useRecetasContext } from "@/context/RecetasContext";
import RecetasFormShared from "./RecetasFormShared";
import Title from "@/components/Title";
import Button from "@/components/Button";

import { 
  EditarIcon, 
  BorrarIcon, 
  CerrarIcon 
} from "@/assets/DashboardAssets";
import { TitleDetails } from "@/components/TitleDetails";
import { DetailsTable } from "./DetailsTable";
import { useRecetaDetallesQuery } from "../hooks/queries/queries";
import { useEffect } from "react";


export default function RecetasDetalles() {
  const { 
    showRecetasDetalles, 
    updateRegistro, 
    setUpdateRegistro, 
    setRegistroDelete, 
    setShowRecetasDetalles,
    setRecetaDetalles,
    setRecetaDetallesLoading,
    registroDelete, 
    recetaId,
    setEnabledRecetaDetalles,
    enabledRecetaDetalles,
  } = useRecetasContext();
    
    const { data: recetaDetalles, isSuccess, isLoading } = useRecetaDetallesQuery(recetaId!);

    useEffect(() => {
      if (recetaId && enabledRecetaDetalles && isSuccess) {
        setRecetaDetalles(recetaDetalles || []);
        setShowRecetasDetalles(true);
        setEnabledRecetaDetalles(false);
      }
    }, [recetaId, enabledRecetaDetalles, isSuccess, recetaDetalles, setRecetaDetalles, setShowRecetasDetalles, setEnabledRecetaDetalles]);

    useEffect(() => {
      setRecetaDetallesLoading(isLoading);
    }, [isLoading, setRecetaDetallesLoading]);

    if (!showRecetasDetalles) return <></>;

  const handleCloseUpdate = () => {
    setShowRecetasDetalles(false);
    setUpdateRegistro(false);
  };

  function handleClose() {
    setShowRecetasDetalles(false);
  }

  if (updateRegistro) {
    return <RecetasFormShared 
      title="Editar Receta"
      isUpdate={true}
      onClose={handleCloseUpdate}
      onSubmitSuccess={handleCloseUpdate}
    />
  }

  return (
    <div className="flex flex-col gap-5 mx-8 border border-gray-200 p-5 rounded-lg shadow-md h-full">
      <div className="flex justify-between items-center">
        <Title>Text</Title>
        <div className="flex gap-2">
          <Button type="edit" onClick={() => {
            setUpdateRegistro(true);
          }}>
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

      {registroDelete && recetaId !== null && (
        <DeleteComponent
        />
      )}
      <div className="flex flex-col gap-6">
        <TitleDetails>
          Detalles
        </TitleDetails>
        <DetailsTable detalles={recetaDetalles || []} />
      </div>
    </div>
  );
}