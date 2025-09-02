import { DeleteComponent } from "./DeleteComponent";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";
import ProductosIntermediosFormShared from "./ProductosIntermediosFormShared";
import { TitleDetails } from "@/components/TitleDetails";
import { DetailsTable } from "./DetailsTable";
import { useGetProductosIntermediosDetalles } from "../hooks/queries/queries";
import { useEffect } from "react";
import { useDeleteProductoIntermedioMutation } from "../hooks/mutations/productosIntermediosMutations";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { DetallesHeader } from "@/components/DetallesHeader";

export default function ProductosIntermediosDetalles() {
  const {
    showProductosIntermediosDetalles,
    updateRegistro,
    setUpdateRegistro,
    setRegistroDelete,
    setShowProductosIntermediosDetalles,
    registroDelete,
    productoIntermedioId,
    setIsLoadingDetalles,
    enabledDetalles,
    setEnabledDetalles,
  } = useProductosIntermediosContext();

  const {
    data: productoIntermediosDetalles,
    isFetching: isFetchingDetalles,
    isSuccess: isSuccessDetalles,
  } = useGetProductosIntermediosDetalles(productoIntermedioId!);

  const {
    mutateAsync: deleteProductoIntermedio,
    isPending: isPendingDeleteProductoIntermedio,
  } = useDeleteProductoIntermedioMutation();

  useEffect(() => {
    if (isSuccessDetalles && productoIntermediosDetalles && enabledDetalles) {
      setShowProductosIntermediosDetalles(true);
      setEnabledDetalles(false);
    }
  }, [
    productoIntermedioId,
    productoIntermediosDetalles,
    isSuccessDetalles,
    enabledDetalles,
    setIsLoadingDetalles,
    setShowProductosIntermediosDetalles,
    setEnabledDetalles,
  ]);

  useEffect(() => {
    setIsLoadingDetalles(isFetchingDetalles);
  }, [isFetchingDetalles, setIsLoadingDetalles]);

  if (!showProductosIntermediosDetalles) return <></>;

  const handleCloseUpdate = () => {
    setShowProductosIntermediosDetalles(false);
    setUpdateRegistro(false);
  };

  const handleClose = () => {
    setShowProductosIntermediosDetalles(false);
  };

  if (updateRegistro) {
    return (
      <ProductosIntermediosFormShared
        title="Editar Producto Intermedio"
        isUpdate={true}
        onClose={handleCloseUpdate}
        onSubmitSuccess={handleCloseUpdate}
        initialData={productoIntermediosDetalles!}
      />
    );
  }
  console.log(productoIntermediosDetalles);
  const handleDelete = async () => {
    await deleteProductoIntermedio(productoIntermedioId!);
    setShowProductosIntermediosDetalles(false);
    setRegistroDelete(false);
  };
  return (
    <div className="flex flex-col gap-5 mx-8 border border-gray-200 p-5 rounded-lg shadow-md h-full relative">
      <DetallesHeader
        title={productoIntermediosDetalles?.nombre_producto}
        onEdit={() => setUpdateRegistro(true)}
        onDelete={() => setRegistroDelete(true)}
        onClose={handleClose}
      />

      {registroDelete && productoIntermedioId !== null && (
        <DeleteComponent
          deleteFunction={handleDelete}
          cancelFunction={() => setRegistroDelete(false)}
          isLoading={isPendingDeleteProductoIntermedio}
          title="Eliminar Producto Intermedio"
          buttonText="Eliminar"
        />
      )}

      {isFetchingDetalles && (
        <PendingTubeSpinner
          size={28}
          extraClass="absolute bg-white opacity-50 w-full h-full"
        />
      )}
      <div className="flex flex-col gap-6">
        <TitleDetails>Detalles</TitleDetails>
        <DetailsTable
          productoIntermediosDetalles={productoIntermediosDetalles!}
        />
      </div>
    </div>
  );
}
