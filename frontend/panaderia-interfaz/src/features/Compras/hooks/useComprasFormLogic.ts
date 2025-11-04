import { useCallback } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { DetalleOC } from "../types/types";
import type { TOrdenCompraSchema } from "../schemas/schemas";

interface UseComprasFormLogicProps {
  setValue: UseFormSetValue<TOrdenCompraSchema>;
  watch: UseFormWatch<TOrdenCompraSchema>;
  items: DetalleOC[];
  setSubtotal: (value: number) => void;
}

export const useComprasFormLogic = ({
  setValue,
  watch,
  setSubtotal,
}: UseComprasFormLogicProps) => {
  
  const roundTo3 = useCallback((n: number) => Math.round(n * 1000) / 1000, []);

  const calculateImpuesto = useCallback((subtotal: number, impuestoPorcentaje: number = 0) => {
    const impuesto = subtotal * impuestoPorcentaje / 100;
    return roundTo3(impuesto);
  }, [roundTo3]);

  const calculateSubtotal = useCallback((item: DetalleOC, impuestoPorcentaje: number = 0) => {
    const subtotal = item.costo_unitario_usd * item.cantidad_solicitada;
    const impuesto = calculateImpuesto(subtotal, impuestoPorcentaje);
    return roundTo3(subtotal + impuesto);
  }, [roundTo3, calculateImpuesto]);

  const calculateTotalFromItems = useCallback((itemsArray: DetalleOC[]) => {
    const subtotalBeforeTaxes = itemsArray.reduce(
      (sum, item) => sum + (item.costo_unitario_usd * item.cantidad_solicitada), 
      0
    );
    const impuesto = itemsArray.reduce(
      (sum, item) => sum + (item.costo_unitario_usd * item.cantidad_solicitada * item.porcentaje_impuesto / 100), 
      0
    );
    const subtotal = subtotalBeforeTaxes + impuesto;
    setSubtotal(subtotalBeforeTaxes);
    
    const tasaCambio = Number(watch('tasa_cambio_aplicada')) || 0;
    
    setValue('subtotal_oc_usd', roundTo3(subtotalBeforeTaxes));
    setValue('subtotal_oc_ves', roundTo3(subtotalBeforeTaxes * tasaCambio));
    
    setValue('monto_total_oc_usd', roundTo3(subtotal));
    setValue('monto_total_oc_ves', roundTo3(subtotal * tasaCambio));
    setValue('monto_impuestos_oc_usd', roundTo3(impuesto));
    setValue('monto_impuestos_oc_ves', roundTo3(impuesto * tasaCambio));
  }, [setValue, watch, setSubtotal, roundTo3]);

  const convertItemsToSchemaValue = useCallback((items: DetalleOC[]): TOrdenCompraSchema['detalles'] => {
    return items
      .filter((item) => item.unidad_medida_compra !== undefined && item.unidad_medida_compra !== 0)
      .map((item) => ({
        id: item.id,
        materia_prima: item.materia_prima,
        producto_reventa: item.producto_reventa,
        cantidad_solicitada: item.cantidad_solicitada,
        unidad_medida_compra: item.unidad_medida_compra!,
        costo_unitario_usd: item.costo_unitario_usd,
        subtotal_linea_usd: item.subtotal_linea_usd,
        porcentaje_impuesto: item.porcentaje_impuesto,
        impuesto_linea_usd: item.impuesto_linea_usd,
      }));
  }, []);

  const updateItemCalculations = useCallback((
    item: DetalleOC,
    impuestoPorcentaje?: number
  ) => {
    const taxRate = impuestoPorcentaje ?? item.porcentaje_impuesto;
    const subtotal = calculateSubtotal(item, taxRate);
    const impuesto = calculateImpuesto(subtotal, taxRate);

    item.subtotal_linea_usd = subtotal;
    item.impuesto_linea_usd = impuesto;
    
    if (impuestoPorcentaje !== undefined) {
      item.porcentaje_impuesto = impuestoPorcentaje;
    }

    return { subtotal, impuesto };
  }, [calculateSubtotal, calculateImpuesto]);

  const updateFormDetalles = useCallback((
    items: DetalleOC[],
    productoIndex: number,
    calculations: { subtotal: number; impuesto: number },
    additionalUpdates?: Record<string, number | string>
  ) => {
    const schemaValue = convertItemsToSchemaValue(items);
    setValue('detalles', schemaValue);
    
    if (productoIndex !== -1) {
      setValue(`detalles.${productoIndex}.subtotal_linea_usd`, calculations.subtotal);
      setValue(`detalles.${productoIndex}.impuesto_linea_usd`, calculations.impuesto);
      
      if (additionalUpdates) {
        Object.entries(additionalUpdates).forEach(([key, value]) => {
          const fieldPath = `detalles.${productoIndex}.${key}` as keyof TOrdenCompraSchema;
          setValue(fieldPath, value as never, { shouldValidate: true });
        });
      }
    }
  }, [convertItemsToSchemaValue, setValue]);

  const resetAmounts = useCallback(() => {
    setSubtotal(0);
    setValue('monto_impuestos_oc_usd', 0);
    setValue('monto_total_oc_usd', 0);
    setValue('monto_total_oc_ves', 0);
    setValue('subtotal_oc_usd', 0);
    setValue('subtotal_oc_ves', 0);
  }, [setValue, setSubtotal]);

  return {
    roundTo3,
    calculateImpuesto,
    calculateSubtotal,
    calculateTotalFromItems,
    convertItemsToSchemaValue,
    updateItemCalculations,
    updateFormDetalles,
    resetAmounts,
  };
};

