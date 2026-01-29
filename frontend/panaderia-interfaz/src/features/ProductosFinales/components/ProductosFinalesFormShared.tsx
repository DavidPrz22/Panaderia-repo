import Button from "@/components/Button";
import type { ProductosFinalesFormSharedProps } from "@/features/ProductosFinales/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";


import {
  productoFinalSchema,
  type TProductoFinalSchema,
} from "../schemas/schemas";

import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

import { PFFormInputContainer } from "./PFFormInputContainer";
import { PFFormSelectContainer } from "./PFFormSelectContainer";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import { useCreateProductoFinal } from "../hooks/mutations/productosFinalesMutations";
import { useUpdateProductoFinal } from "../hooks/mutations/productosFinalesMutations";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";


export default function ProductosFinalesFormShared({
  title,
  isUpdate = false,
  initialData,
  onClose,
  onSubmitSuccess,
}: ProductosFinalesFormSharedProps) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TProductoFinalSchema>({
    resolver: zodResolver(productoFinalSchema),
    defaultValues:
      isUpdate && initialData
        ? {
            nombre_producto: initialData.nombre_producto,
            SKU: initialData.SKU,
            tipo_medida_fisica: initialData.tipo_medida_fisica.toUpperCase() as
              | "UNIDAD"
              | "PESO"
              | "VOLUMEN",
            categoria: initialData.categoria_producto.id,
            receta_relacionada: initialData.receta_relacionada
              ? initialData.receta_relacionada.id
              : undefined,
            precio_venta_usd: initialData.precio_venta_usd ?? undefined,
            unidad_venta: initialData.unidad_venta_producto.id,
            punto_reorden: initialData.punto_reorden,
            unidad_produccion:
              initialData.unidad_produccion_producto.id,
            descripcion: initialData.descripcion,
            vendible_por_medida_real: initialData.vendible_por_medida_real,
            usado_en_transformaciones: initialData.usado_en_transformaciones,
          }
        : undefined,
  });
  const { unidadesMedida, categoriasProductoFinal, productoId } =
    useProductosFinalesContext();

  const {
    mutateAsync: createProductosFinales,
    isPending: isPendingCreateProductosFinales,
  } = useCreateProductoFinal();
  const {
    mutateAsync: updateProductosFinales,
    isPending: isPendingUpdateProductosFinales,
  } = useUpdateProductoFinal();

  function renderCategoriasProductoIntermedio() {
    if (isUpdate && initialData) {
      return (
        <>
          <option value={initialData.categoria_producto.id}>
            {
              categoriasProductoFinal.find(
                (categoria) =>
                  categoria.id === initialData.categoria_producto.id,
              )?.nombre_categoria
            }
          </option>
          {categoriasProductoFinal.map(
            ({
              id,
              nombre_categoria,
            }: {
              id: number;
              nombre_categoria: string;
            }) =>
              id !== initialData.categoria_producto.id && (
                <option key={id} value={id}>
                  {nombre_categoria}
                </option>
              ),
          )}
        </>
      );
    }

    return (
      <>
        <option value="">Seleccione una categoria</option>
        {categoriasProductoFinal.map(
          ({
            id,
            nombre_categoria,
          }: {
            id: number;
            nombre_categoria: string;
          }) => (
            <option key={id} value={id}>
              {nombre_categoria}
            </option>
          ),
        )}
      </>
    );
  }

  function renderUnidadesMedida(
    unidadType: "unidad_venta_producto" | "unidad_produccion_producto",
  ) {
    if (isUpdate && initialData) {
      return (
        <>
          <option value={initialData[unidadType].id}>
            {
              unidadesMedida.find(
                (unidad) => unidad.id === initialData[unidadType].id,
              )?.nombre_completo
            }
          </option>
          {unidadesMedida.map(
            ({
              id,
              nombre_completo,
            }: {
              id: number;
              nombre_completo: string;
            }) =>
              id !== initialData[unidadType].id && (
                <option key={id} value={id}>
                  {nombre_completo}
                </option>
              ),
          )}
        </>
      );
    }
    return (
      <>
        <option value="">Seleccione una unidad de medida</option>
        {unidadesMedida.map(
          ({
            id,
            nombre_completo,
          }: {
            id: number;
            nombre_completo: string;
          }) => (
            <option key={id} value={id}>
              {nombre_completo}
            </option>
          ),
        )}
      </>
    );
  }

  const [usadoEnTransformaciones, setUsadoEnTransformaciones] = useState(initialData?.usado_en_transformaciones ?? false);

  const checkInvalidRecetaRelacionada = () => {
    if (!usadoEnTransformaciones && !watch("receta_relacionada")) return false;
    return true;
  }
  
  const handleCancelButtonClick = () => {
    onClose();
  };

  const onSubmit = async (data: TProductoFinalSchema) => {
    if (!checkInvalidRecetaRelacionada()) {
     toast.error("El producto debe estar relacionado con una receta"); 
     return;
    }
  
    if (isUpdate) {
      await updateProductosFinales({ id: productoId!, producto: data });
    } else {
      await createProductosFinales(data);
    }
    onSubmitSuccess();
  };

  const recetaRelacionadaValidatedData = initialData?.receta_relacionada
    ? initialData.receta_relacionada
    : false;

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="productos-finales-form">
      <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 shadow-md relative">
        {(isPendingUpdateProductosFinales ||
          isPendingCreateProductosFinales) && (
          <PendingTubeSpinner
            size={28}
            extraClass="absolute bg-white opacity-50 w-full h-full"
          />
        )}
        <div className="p-5 font-[Roboto] text-lg font-semibold border-b border-gray-300 bg-gray-50 rounded-t-md">
          {title}
        </div>
        <div className="flex flex-col gap-2 px-5 bg-white">
          <div className="flex flex-col gap-2 border-b border-gray-300 py-8">
            <PFFormInputContainer
              inputType="text"
              title="Nombre del Producto"
              name="nombre_producto"
              register={register}
              errors={errors}
            />

            <PFFormInputContainer
              inputType="text"
              title="SKU"
              name="SKU"
              register={register}
              errors={errors}
            />

            <PFFormInputContainer
                title="Receta"
                inputType="text"
                name="receta_relacionada"
                register={register}
                errors={errors}
                search={true}
                setValue={setValue}
                initialData={recetaRelacionadaValidatedData}
                disabled={usadoEnTransformaciones}
              />
  
            <PFFormInputContainer
              inputType="number"
              title="Precio de Venta (USD)"
              name="precio_venta_usd"
              register={register}
              errors={errors}
            />

            <PFFormInputContainer
              inputType="number"
              title="Punto de Reorden"
              name="punto_reorden"
              register={register}
              errors={errors}
            />

            <PFFormSelectContainer
              title="Unidad de Venta"
              name="unidad_venta"
              register={register}
              errors={errors}
              setValue={setValue}
            >
              {renderUnidadesMedida("unidad_venta_producto")}
            </PFFormSelectContainer>

            <PFFormSelectContainer
              title="Unidad de Producción"
              name="unidad_produccion"
              register={register}
              errors={errors}
            >
              {renderUnidadesMedida("unidad_produccion_producto")}
            </PFFormSelectContainer>

            <PFFormSelectContainer
              title="Categoria del Producto"
              name="categoria"
              register={register}
              errors={errors}
            >
              {renderCategoriasProductoIntermedio()}
            </PFFormSelectContainer>

            <PFFormInputContainer
              inputType="textarea"
              title="Descripción"
              name="descripcion"
              register={register}
              errors={errors}
              optional
            />
            <div className="flex items-center gap-6">
              <div className="font-[Roboto] text-sm font-semibold">
                Producto Usado en Transformaciones
              </div>
                <Checkbox 
                className="size-5 cursor-pointer"
                checked={usadoEnTransformaciones}
                onCheckedChange={() => {
                  setUsadoEnTransformaciones(!usadoEnTransformaciones);
                  setValue('receta_relacionada', null)
                  setValue('usado_en_transformaciones', !usadoEnTransformaciones)
                  const input: HTMLInputElement | null = document.querySelector('input[data-input="search"]')
                  if (input) input.value = ''
                }}
                />
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end py-4 px-5 bg-white">
          <Button type="cancel" onClick={handleCancelButtonClick}>
            Cancelar
          </Button>
          <Button type="submit" onClick={() => {}}>
            Guardar
          </Button>
        </div>
      </div>
    </form>
  );
}
