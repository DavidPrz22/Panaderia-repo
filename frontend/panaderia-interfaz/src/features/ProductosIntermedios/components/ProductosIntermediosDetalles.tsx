import { DeleteComponent } from "./DeleteComponent";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";
import ProductosIntermediosFormShared from "./ProductosIntermediosFormShared";
import Title from "@/components/Title";
import Button from "@/components/Button";

import { 
  EditarIcon, 
  BorrarIcon, 
  CerrarIcon 
} from "@/assets/DashboardAssets";
import { TitleDetails } from "@/components/TitleDetails";
import { DetailsTable } from "./DetailsTable";
import { useGetProductosIntermediosDetalles } from "../hooks/queries/queries";
import { useEffect } from "react";

export default function ProductosIntermediosDetalles() {

  const { showProductosIntermediosDetalles, updateRegistro, setUpdateRegistro, setRegistroDelete, setShowProductosIntermediosDetalles, registroDelete, productoIntermedioId, setProductoIntermediosDetalles, setIsLoadingDetalles, enabledDetalles, setEnabledDetalles } = useProductosIntermediosContext();

  const { data: productoIntermediosDetalles, isLoading: isPendingDetalles, isSuccess: isSuccessDetalles } = useGetProductosIntermediosDetalles(productoIntermedioId!);

  useEffect(() => {
    if (isSuccessDetalles && productoIntermediosDetalles && enabledDetalles) {
      setShowProductosIntermediosDetalles(true);
      setProductoIntermediosDetalles(productoIntermediosDetalles);
      setEnabledDetalles(false);
    }
  }, [productoIntermedioId, 
    productoIntermediosDetalles, 
    setProductoIntermediosDetalles, 
    isSuccessDetalles, 
    setIsLoadingDetalles, 
    setShowProductosIntermediosDetalles,
    setEnabledDetalles,
    enabledDetalles]);

  useEffect(() => {
      setIsLoadingDetalles(isPendingDetalles);
  }, [isPendingDetalles, setIsLoadingDetalles]);

  if (!showProductosIntermediosDetalles) return <></>;

  const handleCloseUpdate = () => {
    setShowProductosIntermediosDetalles(false);
    setUpdateRegistro(false);
  };

  function handleClose() {
    setShowProductosIntermediosDetalles(false);
  }

  if (updateRegistro) {
    return <ProductosIntermediosFormShared 
      title="Editar Producto Intermedio"
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

      {registroDelete && productoIntermedioId !== null && (
        <DeleteComponent
        />
      )}
      <div className="flex flex-col gap-6">
        <TitleDetails>
          Detalles
        </TitleDetails>
        <DetailsTable />
      </div>
    </div>
  );
}