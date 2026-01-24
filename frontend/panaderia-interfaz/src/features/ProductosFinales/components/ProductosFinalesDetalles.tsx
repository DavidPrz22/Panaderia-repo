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
import Title from "@/components/Title";
import { PFLotesTable } from "./PFLotesTable";
import { PFLotesDetailsContainer } from "./PFLotesDetailsContainer";
import { useAuth } from "@/context/AuthContext";
import { userHasPermission } from "@/features/Authentication/lib/utils";
import { RecipeModal } from "@/components/RecipeModal";
import { useQuery } from "@tanstack/react-query";
import { recetasDetallesQueryOptions } from "@/features/Recetas/hooks/queries/RecetasQueryOptions";

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
    showLotesDetalles,
    selectedRecipeId,
    showRecipeModal,
    setShowRecipeModal,
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

  const { user } = useAuth();
  const userCanEdit = userHasPermission(user!, 'productos_elaborados', 'edit');
  const userCanDelete = userHasPermission(user!, 'productos_elaborados', 'delete');

  const { data: recipeDetails, isLoading: isLoadingRecipe } = useQuery({
    ...recetasDetallesQueryOptions(selectedRecipeId ?? 0),
    enabled: !!selectedRecipeId && showRecipeModal,
  });

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
        title="Editar Producto Final"
        isUpdate={true}
        onClose={handleCloseUpdate}
        onSubmitSuccess={handleCloseUpdate}
        initialData={productoFinalDetalles}
      />
    );
  }
  const handleDelete = async () => {
    await deleteProductoFinal(productoId!);
    setShowProductoDetalles(false);
    setRegistroDelete(false);
  };
  if (showLotesDetalles) {
    return <PFLotesDetailsContainer />;
  }
  return (
    <div className="flex flex-col gap-5 mx-8 border border-gray-200 p-5 rounded-lg shadow-md h-full relative">
      <DetallesHeader
        title={productoFinalDetalles?.nombre_producto}
        onEdit={userCanEdit ? () => setUpdateRegistro(true) : undefined}
        onDelete={userCanDelete ? () => setRegistroDelete(true) : undefined}
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

      <div className="space-y-4 mt-4">
        <Title extraClass="text-blue-600">Lotes de producto final</Title>
        <PFLotesTable />
      </div>

      <RecipeModal
        isOpen={showRecipeModal}
        onClose={() => setShowRecipeModal(false)}
        data={recipeDetails}
        isLoading={isLoadingRecipe}
      />
    </div>
  );
}
