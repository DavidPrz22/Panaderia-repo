import Button from "@/components/Button";
import type { ProductosFinalesFormSharedProps } from "@/features/ProductosFinales/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  productoFinalSchema,
  type TProductoFinalSchema
} from "../schemas/schemas";

import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

import { PFFormInputContainer } from "./PFFormInputContainer";
import { PFFormSelectContainer } from "./PFFormSelectContainer";
import PFInputFormSearch from "./PFInputFormSearch";
import { PendingTubeSpinner } from "./PendingTubeSpinner";

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
  } = useForm<TProductoFinalSchema>({
    resolver: zodResolver(productoFinalSchema),
  });

  const { unidadesMedida, categoriasProductoFinal, productoId } =
    useProductosFinalesContext();

  // const { mutateAsync: createProductosIntermedios, isPending: isPendingCreateProductosIntermedios } = useCreateProductosIntermediosMutation();
  // const { mutateAsync: updateProductosIntermedios, isPending: isPendingUpdateProductosIntermedios } = useUpdateProductosIntermediosMutation();

  function renderCategoriasProductoIntermedio() {
    if (isUpdate && initialData) {
      return (
        <>
          <option value={initialData.categoria.id}>
            {
              categoriasProductoFinal.find(
                (categoria) => categoria.id === initialData.categoria.id,
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
              id !== initialData.categoria.id && (
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

  function renderUnidadesMedida() {
    if (isUpdate && initialData) {
      return (
        <>
          <option value={initialData.unidad_medida.id}>
            {
              unidadesMedida.find(
                (unidad) => unidad.id === initialData.unidad_medida.id,
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
              id !== initialData.unidad_medida.id && (
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

  const handleCancelButtonClick = () => {
    onClose();
  };

  const onSubmit = async (data: TProductoFinalSchema) => {
    return
    if (isUpdate) {
      await updateProductosFinales({id: productoFinalId!, data});
    } else {
      await createProductosFinales(data);
    }
    onSubmitSuccess();
  };


  const recetaRelacionadaValidatedData = initialData?.receta_relacionada ? initialData.receta_relacionada : false;
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="productos-finales-form">
      <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 shadow-md relative">
        {(false || false) && (
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
              title="Receta Relacionada"
              inputType="text"
              name="receta_relacionada"
              register={register}
              errors={errors}
              search={true}
              setValue={setValue}
              initialData={recetaRelacionadaValidatedData}
            />
            <PFFormInputContainer
              inputType="number"
              title="Precio de Venta (USD)"
              name="precio_venta_usd"
              register={register}
              errors={errors}
              optional={true}
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
            >
              {renderUnidadesMedida()}
            </PFFormSelectContainer>
  
            <PFFormSelectContainer
              title="Unidad Nominal"
              name="unidad_medida_nominal"
              register={register}
              errors={errors}
            >
              {renderUnidadesMedida()}
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
