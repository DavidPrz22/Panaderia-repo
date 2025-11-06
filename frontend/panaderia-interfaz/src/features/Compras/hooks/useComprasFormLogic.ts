import { useCallback } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { DetalleOC } from "../types/types";
import type { TOrdenCompraSchema } from "../schemas/schemas";

interface UseComprasFormLogicProps {
  setValue: UseFormSetValue<TOrdenCompraSchema>;
  watch: UseFormWatch<TOrdenCompraSchema>;
  items: DetalleOC[];
}

export const useComprasFormLogic = ({
  setValue,
  watch,
}: UseComprasFormLogicProps) => {
  const roundTo3 = useCallback((n: number) => Math.round(n * 1000) / 1000, []);

  const calculateSubtotal = useCallback(
    (item: DetalleOC) => {
      const subtotal = item.costo_unitario_usd * item.cantidad_solicitada;
      return roundTo3(subtotal);
    },
    [roundTo3],
  );

  const calculateTotalFromItems = useCallback(
    (itemsArray: DetalleOC[]) => {
      const subtotal = itemsArray.reduce(
        (sum, item) => sum + item.costo_unitario_usd * item.cantidad_solicitada,
        0,
      );

      const tasaCambio = Number(watch("tasa_cambio_aplicada")) || 0;

      setValue("monto_total_oc_usd", roundTo3(subtotal));
      setValue("monto_total_oc_ves", roundTo3(subtotal * tasaCambio));
    },
    [setValue, watch, roundTo3],
  );

  const convertItemsToSchemaValue = useCallback(
    (items: DetalleOC[]): TOrdenCompraSchema["detalles"] => {
      return items
        .filter(
          (item) =>
            item.unidad_medida_compra !== undefined &&
            item.unidad_medida_compra !== 0,
        )
        .map((item) => ({
          id: item.id,
          materia_prima: item.materia_prima,
          producto_reventa: item.producto_reventa,
          cantidad_solicitada: item.cantidad_solicitada,
          unidad_medida_compra: item.unidad_medida_compra!,
          costo_unitario_usd: item.costo_unitario_usd,
          subtotal_linea_usd: item.subtotal_linea_usd,
        }));
    },
    [],
  );

  const updateItemCalculations = useCallback(
    (item: DetalleOC) => {
      const subtotal = calculateSubtotal(item);
      item.subtotal_linea_usd = subtotal;
      return subtotal;
    },
    [calculateSubtotal],
  );

  const updateFormDetalles = useCallback(
    (
      items: DetalleOC[],
      productoIndex: number,
      subtotal: number,
      additionalUpdates?: Record<string, number | string>,
    ) => {
      const schemaValue = convertItemsToSchemaValue(items);
      setValue("detalles", schemaValue);

      if (productoIndex !== -1) {
        setValue(`detalles.${productoIndex}.subtotal_linea_usd`, subtotal);

        if (additionalUpdates) {
          Object.entries(additionalUpdates).forEach(([key, value]) => {
            const fieldPath =
              `detalles.${productoIndex}.${key}` as keyof TOrdenCompraSchema;
            setValue(fieldPath, value as never, { shouldValidate: true });
          });
        }
      }
    },
    [convertItemsToSchemaValue, setValue],
  );

  const resetAmounts = useCallback(() => {
    setValue("monto_total_oc_usd", 0);
    setValue("monto_total_oc_ves", 0);
  }, [setValue]);

  return {
    roundTo3,
    calculateSubtotal,
    calculateTotalFromItems,
    convertItemsToSchemaValue,
    updateItemCalculations,
    updateFormDetalles,
    resetAmounts,
  };
};
