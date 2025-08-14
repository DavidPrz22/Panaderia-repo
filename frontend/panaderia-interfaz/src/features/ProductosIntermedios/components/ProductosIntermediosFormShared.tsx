import Button from "@/components/Button";
import type { ProductosIntermediosFormSharedProps } from "@/features/ProductosIntermedios/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  productosIntermediosSchema,
  type TProductosIntermediosSchema,
} from "../schemas/schema";
import { PIFormInputContainer } from "./PIFormInputContainer";
import { PIFormSelectContainer } from "./PIFormSelectContainer";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";
import { useCreateProductosIntermediosMutation } from "../hooks/mutations/productosIntermediosMutations";
import { PendingTubeSpinner } from "./PendingTubeSpinner";

export default function ProductosIntermediosFormShared({
  title,
  isUpdate = false,
  initialData,
  onClose,
  onSubmitSuccess,
}: ProductosIntermediosFormSharedProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TProductosIntermediosSchema>({
    resolver: zodResolver(productosIntermediosSchema),
    defaultValues: {
      nombre_producto: "",
      SKU: "",
      descripcion: "",
    },
  });

  const { unidadesMedida, categoriasProductoIntermedio } =
    useProductosIntermediosContext();

  const { mutateAsync: createProductosIntermedios, isPending } = useCreateProductosIntermediosMutation();

  function renderCategoriasProductoIntermedio() {
    if (isUpdate && initialData) {
      return (
        <>
          <option value={initialData.categoria}>
            {
              categoriasProductoIntermedio.find(
                (categoria) => categoria.id === initialData.categoria,
              )?.nombre_categoria
            }
          </option>
          {categoriasProductoIntermedio.map(
            ({
              id,
              nombre_categoria,
            }: {
              id: number;
              nombre_categoria: string;
            }) =>
              id !== initialData.categoria && (
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
        {categoriasProductoIntermedio.map(
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
          <option value={initialData.unidad_medida_nominal}>
            {
              unidadesMedida.find(
                (unidad) => unidad.id === initialData.unidad_medida_nominal,
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
              id !== initialData.unidad_medida_nominal && (
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

  const onSubmit = async (data: TProductosIntermediosSchema) => {
    await createProductosIntermedios(data)
    onSubmitSuccess()
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="productos-intermedios-form"
    >
      <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 shadow-md relative">
        {(isPending) && (
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
            <PIFormInputContainer
              inputType="text"
              title="Nombre"
              name="nombre_producto"
              register={register}
              errors={errors}
            />
            <PIFormInputContainer
              inputType="text"
              title="SKU"
              name="SKU"
              register={register}
              errors={errors}
            />
            <PIFormInputContainer
              inputType="text"
              title="Receta"
              name="receta_relacionada"
              register={register}
              errors={errors}
              search={true}
              setValue={setValue}
            />
            <PIFormInputContainer
              inputType="number"
              title="Punto de reorden"
              name="punto_reorden"
              register={register}
              errors={errors}
            />
            <PIFormSelectContainer
              title="Unidad de medida"
              name="unidad_medida_nominal"
              register={register}
              errors={errors}
            >
              {renderUnidadesMedida()}
            </PIFormSelectContainer>

            <PIFormSelectContainer
              title="Categoría"
              name="categoria"
              register={register}
              errors={errors}
            >
              {renderCategoriasProductoIntermedio()}
            </PIFormSelectContainer>

            <PIFormInputContainer
              inputType="textarea"
              title="Descripción"
              name="descripcion"
              register={register}
              errors={errors}
              optional={true}
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
