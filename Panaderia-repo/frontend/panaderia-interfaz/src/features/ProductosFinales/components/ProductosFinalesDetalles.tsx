import { DeleteComponent } from "./DeleteComponent";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";
import ProductosFinalesFormShared from "./ProductosFinalesFormShared";
import { TitleDetails } from "@/components/TitleDetails";
import { DetailsTable } from "./DetailsTable";
import { useProductoFinalDetalles } from "../hooks/queries/queries";
import { useEffect } from "react";
import { useDeleteProductoFinal } from "../hooks/mutations/productosFinalesMutations";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { DetallesHeader } from "@/components/DetallesHeader";

export default function ProductosFinalesDetalles() {
  const {
    showProductoDetalles,
    setShowProductoDetalles,
    updateRegistro,
    setUpdateRegistro,
    setRegistroDelete,
    registroDelete,
    productoId,
    setIsLoadingDetalles,
    enabledProductoDetalles,
    setEnabledProductoDetalles,
  } = useProductosFinalesContext();

  const {
    data: productoFinalDetalles,
    isFetching: isFetchingDetalles,
    isSuccess: isSuccessDetalles,
  } = useProductoFinalDetalles(productoId!);

  const {
    mutateAsync: deleteProductoFinal,
    isPending: isPendingDeleteProductoFinal,
  } = useDeleteProductoFinal();

  useEffect(() => {
    if (isSuccessDetalles && productoFinalDetalles && enabledProductoDetalles) {
      setShowProductoDetalles(true);
      setEnabledProductoDetalles(false);
    }
  }, [
    productoId,
    productoFinalDetalles,
    isSuccessDetalles,
    enabledProductoDetalles,
    setIsLoadingDetalles,
    setShowProductoDetalles,
    setEnabledProductoDetalles,
  ]);

  useEffect(() => {
    setIsLoadingDetalles(isFetchingDetalles);
  }, [isFetchingDetalles, setIsLoadingDetalles]);

  if (!showProductoDetalles) return <></>;

  const handleCloseUpdate = () => {
    setShowProductoDetalles(false);
    setUpdateRegistro(false);
  };

  const handleClose = () => {
    setShowProductoDetalles(false);
  };

  if (updateRegistro) {
    if (!productoFinalDetalles) return null;

    return (
      <ProductosFinalesFormShared
        title="Editar Producto Intermedio"
        isUpdate={true}
        onClose={handleCloseUpdate}
        onSubmitSuccess={handleCloseUpdate}
        initialData={productoFinalDetalles}
      />
    );
  }
  console.log(productoFinalDetalles);
  const handleDelete = async () => {
    await deleteProductoFinal(productoId!);
    setShowProductoDetalles(false);
    setRegistroDelete(false);
  };
  return (
    <div className="flex flex-col gap-5 mx-8 border border-gray-200 p-5 rounded-lg shadow-md h-full relative">
      <DetallesHeader
        title={productoFinalDetalles?.nombre_producto}
        onEdit={() => setUpdateRegistro(true)}
        onDelete={() => setRegistroDelete(true)}
        onClose={handleClose}
      />

      {registroDelete && productoId !== null && (
        <DeleteComponent
          deleteFunction={handleDelete}
          cancelFunction={() => setRegistroDelete(false)}
          isLoading={isPendingDeleteProductoFinal}
          title="Eliminar Producto Final"
          buttonText="Eliminar"
        />
      )}

      {isFetchingDetalles && (
        <PendingTubeSpinner
          size={28}
          extraClass="absolute bg-white opacity-50 w-full h-full "
        />
      )}
      <div className="flex flex-col gap-6">
        <TitleDetails>Detalles</TitleDetails>
        <DetailsTable productoFinalDetalles={productoFinalDetalles!} />
      </div>
    </div>
  );
}
