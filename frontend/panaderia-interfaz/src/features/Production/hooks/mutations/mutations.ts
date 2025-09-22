import { useMutation } from "@tanstack/react-query";
import { createProduction, componentesRecetaSearch } from "../../api/api";
import type { TProductionFormData } from "../../schemas/schemas";
import { useProductionContext } from "@/context/ProductionContext";
import { useQueryClient } from "@tanstack/react-query";
import { componentsProductionOptions } from "../../hooks/queries/ProductionQueryOptions";
import { productosFinalesQueryOptions } from "@/features/ProductosFinales/hooks/queries/productosFinalesQueryOptions";
import { productosIntermediosQueryOptions } from "@/features/ProductosIntermedios/hooks/queries/queryOptions";

export const useCreateProductionMutation = () => {
  const queryClient = useQueryClient();
  const { setShowToast, setToastMessage } = useProductionContext();
  const handleToast = (message: string) => {
    setShowToast(true);
    setToastMessage(message);
  };

  return useMutation({
    mutationFn: (data: TProductionFormData) => createProduction(data),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({
        queryKey: componentsProductionOptions(data.productoId).queryKey,
      })
      if (data.tipoProducto === "producto-intermedio") {
        queryClient.invalidateQueries({
          queryKey: productosIntermediosQueryOptions.queryKey,
        })
      } else {
        queryClient.invalidateQueries({
          queryKey: productosFinalesQueryOptions().queryKey,
        })
      }
      handleToast("Producción registrada exitosamente");
    },
    onError: (error) => {
      console.error("Error fetching componentes receta search:", error);
      handleToast("Error al cargar componentes de producción");
    },
  });
};

export const useComponentesProductionSearchMutation = () => {
  const { setComponentSearchList } = useProductionContext();
  
  return useMutation({
    mutationFn: (search: string) => componentesRecetaSearch(search),
    onSuccess: (data) => {
      setComponentSearchList(data);
    },
    onError: (error) => {
      console.error("Error fetching componentes receta search:", error);
    },
  });
};
