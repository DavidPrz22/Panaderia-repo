import { ProductionComponentItem } from "./ProductionComponentItem";
import { ProductionComponentsHeader } from "./ProductionComponentsHeader";
import { DoubleSpinnerLoading } from "@/components/DoubleSpinnerLoading";
import { useComponentsProductionQuery } from "../hooks/queries/ProductionQueries";
import type {
  ComponentesLista,
  subreceta,
  watchSetvalueTypeProduction,
} from "../types/types";
import { ProductionSubComponents } from "./ProductionSubComponents";
import { ChefHatIcon } from "@/assets/DashboardAssets";
import { ProductionWarning } from "./ProductionWarning";
import { useProductionContext } from "@/context/ProductionContext";
import { useEffect, useMemo, memo } from "react";

type Componente = ComponentesLista[number];

const ProductionComponentsBase = ({
  setValue,
  watch,
  cantidadProduction,
}: watchSetvalueTypeProduction & { cantidadProduction?: number }) => {
  const { data : productionComponentes , isFetching, isFetched } = useComponentsProductionQuery();

  const { setInsufficientStock, componentesBaseProduccion, setComponentesBaseProduccion, setMedidaFisica, esPorUnidad, setEsPorUnidad } = useProductionContext();

  // Cantidad a producir desde el formulario (1 por defecto)
  const cantidad = cantidadProduction ?? 1;

  // Escalar cantidades de componentes base por la cantidad a producir
  const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;

  // Store unscaled base componentes from backend in context when fetched
  useEffect(() => {
    if (!isFetched) return;
    const base = productionComponentes?.componentes ?? [];
    // Preserve previously added additional components
    setComponentesBaseProduccion((prev: ComponentesLista) => {
      const additional = (prev || []).filter((c) => c.isAdditional);
      const baseIds = new Set(base.map((c) => c.id));
      const additionalFiltered = additional.filter((c) => !baseIds.has(c.id));
      return [...base, ...additionalFiltered] as ComponentesLista;
    });
  }, [isFetched, productionComponentes, setComponentesBaseProduccion]);


  useEffect(() => {
    if (!isFetched || !productionComponentes) return;
  
    const medidaRaw = productionComponentes.medida_produccion;
    const m = typeof medidaRaw === "string" ? medidaRaw.toLowerCase() : undefined;

    setEsPorUnidad((
      (productionComponentes.es_por_unidad === true) ||
      (typeof m === "string" && m === "unidad")
    ));

    if (productionComponentes.tipo_medida_fisica) {
      setMedidaFisica(productionComponentes.tipo_medida_fisica);
    }
  
  }, [isFetched, productionComponentes, setMedidaFisica, setEsPorUnidad]);


  const componentesPrincipalesProducts: Componente[] = useMemo(() => {
    const base = componentesBaseProduccion ?? [];
    const q = Number(cantidad) || 0;
    return base.map((c) => {
      const original = c.cantidad ?? 0;
      // Only scale base (non-additional) components when product is unit-based
      const scaled = esPorUnidad && !c.isAdditional ? original * q : original;
      return { ...c, cantidad: roundTo3(scaled) };
    });
  }, [componentesBaseProduccion, cantidad, esPorUnidad]);

  // Escalar cantidades de subrecetas por la cantidad a producir
  const subrecetasProducts: subreceta[] = useMemo(() => {
    const subs = productionComponentes?.subrecetas ?? [];
    const q = Number(cantidad) || 0;
    if (!esPorUnidad) {
      // Keep original quantities when not unit-based
      return subs.map((sr) => ({
        ...sr,
        componentes: sr.componentes.map((c) => ({
          ...c,
          cantidad: roundTo3(c.cantidad ?? 0),
        })),
      }));
    }
    return subs.map((sr) => ({
      ...sr,
      componentes: sr.componentes.map((c) => ({
        ...c,
        cantidad: roundTo3((c.cantidad ?? 0) * q),
      })),
    }));
  }, [productionComponentes, cantidad, esPorUnidad]);

  // Unificar y sumar por componente (base + subrecetas) con cantidades escaladas
  const componentesEnProducto: ComponentesLista = useMemo(() => {
    const all: ComponentesLista = [
      ...componentesPrincipalesProducts.map((c) => ({ ...c })),
    ];
    subrecetasProducts.forEach(({ componentes }) => {
      componentes.forEach((componente) => {
        const index = all.findIndex((c) => c.id === componente.id);
        if (componente.id && index === -1) {
          all.push({ ...componente });
        } else if (index !== -1) {
          const newComponent = { ...all[index] };
          newComponent.cantidad = roundTo3(
            newComponent.cantidad + componente.cantidad,
          );
          all[index] = newComponent;
        }
      });
    });
    return all;
  }, [componentesPrincipalesProducts, subrecetasProducts]);

  const insufficientStock: ComponentesLista = useMemo(() => {
    return componentesEnProducto.filter((c) => c.stock < c.cantidad);
  }, [componentesEnProducto]);

  useEffect(() => {
    if (!isFetched) return;
    // Guardar en el formulario solo lo necesario para el backend/zod: id, cantidad y tipo
    const formComponentes = componentesEnProducto.map(({ id, cantidad, tipo }) => ({
      id,
      cantidad: roundTo3(cantidad),
      tipo: tipo || "MateriaPrima", // Default to MateriaPrima if not specified
    }));
    setValue?.("componentes", formComponentes, { shouldValidate: true });
  }, [isFetched, componentesEnProducto, setValue]);

  // Al cargar componentes del servidor, si no hay cantidad indicada por el usuario,
  // establecer 1 para mostrar cantidades base de la receta
  useEffect(() => {
    if (!isFetched) return;
    const current = cantidad;
    if (!current || current - 1 <= 0) {
      const input = document.getElementById("cantidadProduction");
      if (input) {
        input.classList.remove('invalidInput');
        (input as HTMLInputElement).value = "1"
      }
      setValue?.("cantidadProduction", 1, { shouldValidate: true });
    }
  }, [isFetched, setValue, watch, productionComponentes, cantidad]);

  useEffect(() => {
    if (!isFetched) return;
    setInsufficientStock?.(insufficientStock);
  }, [isFetched, insufficientStock, setInsufficientStock]);

  return (
    <>
      {isFetching && <DoubleSpinnerLoading extraClassName="size-30 mt-4" />}

      {isFetched && componentesPrincipalesProducts.length > 0 && (
        <div className="p-6 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <ProductionComponentsHeader />
          <ProductionWarning />
          <div className="flex flex-col gap-2 mt-8">
            {componentesPrincipalesProducts.map((componente) => (
              <ProductionComponentItem
                key={`${componente.id}-${componente.cantidad}`}
                id={componente.id}
                titulo={componente.nombre}
                stock={componente.stock}
                unidad={componente.unidad_medida}
                cantidad={componente.cantidad}
                tipo={componente.tipo}
                isAdditional={componente.isAdditional}
                setValue={setValue}
                watch={watch}
              />
            ))}

            {subrecetasProducts.length > 0 && (
              <div className="space-y-4 border-t mt-5 pt-7 border-gray-200">
                <div className="text-lg font-semibold flex gap-2">
                  <img src={ChefHatIcon} className="size-6" alt="" />
                  Recetas Relacionadas:
                </div>
                {subrecetasProducts.map((sr, index) => (
                  <ProductionSubComponents
                    key={`${sr.nombre}-${index}-${cantidad}`}
                    subreceta={sr}
                    setValue={setValue}
                    watch={watch}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isFetched && componentesPrincipalesProducts.length === 0 && (
        <div className="p-4 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
          <div className="p-4 text-gray-800 font-bold">
            No hay componentes disponibles
          </div>
        </div>
      )}
    </>
  );
};

export const ProductionComponents = memo(ProductionComponentsBase);
ProductionComponents.displayName = "ProductionComponents";
