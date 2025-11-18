import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import { TubeSpinner } from "@/assets";

import type { TMateriaPrimaSchema } from "@/features/MateriaPrima/schemas/schemas";
import type {
  MateriaPrimaFormSharedProps,
  submitMateriaPrima,
} from "@/features/MateriaPrima/types/types";

import { materiaPrimaSchema } from "@/features/MateriaPrima/schemas/schemas";

import Button from "../../../components/Button";
import { MateriaPrimaFormInputContainer } from "./MateriaPrimaFormInputContainer";
import { MateriaPrimaFormSelectContainer } from "./MateriaPrimaFormSelectContainer";
import { useCreateUpdateMateriaPrimaMutation } from "../hooks/mutations/materiaPrimaMutations";

export default function MateriaPrimaFormShared({
  isUpdate = false,
  initialData,
  onClose,
  onSubmitSuccess,
  title,
}: MateriaPrimaFormSharedProps) {
  const { categoriasMateriaPrima, unidadesMedida } = useMateriaPrimaContext();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
    watch,
  } = useForm<TMateriaPrimaSchema>({
    resolver: zodResolver(materiaPrimaSchema),
    defaultValues:
      isUpdate && initialData
        ? {
            nombre: initialData.nombre,
            SKU: initialData.SKU,
            nombre_empaque_estandar: initialData.nombre_empaque_estandar || "",
            cantidad_empaque_estandar:
              initialData.cantidad_empaque_estandar || undefined,
            unidad_medida_empaque_estandar:
              initialData.unidad_medida_empaque_estandar_detail?.id,
            punto_reorden: initialData.punto_reorden,
            unidad_medida_base: initialData.unidad_medida_base_detail.id,
            categoria: initialData.categoria_detail.id,
            descripcion: initialData.descripcion || "",
            precio_compra_usd: initialData.precio_compra_usd || undefined,
          }
        : {},
  });

  const {
    mutate: handleMateriaPrimaMutation,
    isPending: isMateriaPrimaMutationPending,
  } = useCreateUpdateMateriaPrimaMutation(
    onSubmitSuccess,
    setError,
    initialData?.id,
  );

  function renderCategoriasMateriaPrima() {
    if (isUpdate && initialData) {
      return (
        <>
          <option value={initialData.categoria_detail?.id}>
            {initialData.categoria_detail?.nombre_categoria}
          </option>
          {categoriasMateriaPrima.map(
            ({
              id,
              nombre_categoria,
            }: {
              id: number;
              nombre_categoria: string;
            }) =>
              id !== initialData.categoria_detail?.id && (
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
        {categoriasMateriaPrima.map(
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

  function renderUnidadesMedida(type: string) {
    if (type === "base" && isUpdate && initialData) {
      return (
        <>
          <option value={initialData.unidad_medida_base_detail.id}>
            {initialData.unidad_medida_base_detail.nombre_completo}
          </option>
          {unidadesMedida.map(
            ({
              id,
              nombre_completo,
            }: {
              id: number;
              nombre_completo: string;
            }) =>
              id !== initialData.unidad_medida_base_detail.id && (
                <option key={id} value={id}>
                  {nombre_completo}
                </option>
              ),
          )}
        </>
      );
    } else if (
      type === "empaque" &&
      isUpdate &&
      initialData &&
      initialData.unidad_medida_empaque_estandar_detail
    ) {
      return (
        <>
          <option value={initialData.unidad_medida_empaque_estandar_detail.id}>
            {initialData.unidad_medida_empaque_estandar_detail.nombre_completo}
          </option>
          {unidadesMedida.map(
            ({
              id,
              nombre_completo,
            }: {
              id: number;
              nombre_completo: string;
            }) =>
              id !== initialData.unidad_medida_empaque_estandar_detail.id && (
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
    if (isUpdate) {
      reset();
      onClose();
    } else {
      onClose();
    }
  };
  console.log("precio_compra_usd", watch());
  const onSubmit = async (data: TMateriaPrimaSchema) => {
    //Clean up the data before sending
    const cleanedData: submitMateriaPrima = {
      ...data,
      cantidad_empaque_estandar: data.cantidad_empaque_estandar || null,
      unidad_medida_empaque_estandar:
        data.unidad_medida_empaque_estandar || null,
      nombre_empaque_estandar: data.nombre_empaque_estandar?.trim() || null,
      descripcion: data.descripcion?.trim() || null,
      precio_compra_usd: data.precio_compra_usd || null,
    };

    handleMateriaPrimaMutation(cleanedData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="materiaprima-form"
      className="relative "
    >
      {isMateriaPrimaMutationPending ? (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-50">
          <img src={TubeSpinner} alt="Cargando..." className="size-20" />
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 shadow-md">
        <div className="p-5 font-[Roboto] text-lg font-semibold border-b border-gray-300 bg-gray-50 rounded-t-md">
          {title}
        </div>
        <div className="flex flex-col gap-2 px-5 bg-white">
          <div className="flex flex-col gap-2 border-b border-gray-300 py-8">
            <MateriaPrimaFormInputContainer
              inputType="text"
              title="Nombre"
              name="nombre"
              register={register}
              errors={errors}
            />

            <MateriaPrimaFormInputContainer
              inputType="text"
              title="SKU"
              name="SKU"
              register={register}
              errors={errors}
            />

            <MateriaPrimaFormInputContainer
              inputType="number"
              title="Precio de compra por unidad (USD)"
              name="precio_compra_usd"
              register={register}
              errors={errors}
              optional={true}
            />

            <MateriaPrimaFormInputContainer
              inputType="text"
              title="Nombre del empaque"
              name="nombre_empaque_estandar"
              register={register}
              errors={errors}
              optional={true}
            />
            <MateriaPrimaFormInputContainer
              inputType="number"
              title="Cantidad del empaque"
              name="cantidad_empaque_estandar"
              register={register}
              errors={errors}
              optional={true}
            />

            <MateriaPrimaFormSelectContainer
              title="Unidad de medida empaque"
              name="unidad_medida_empaque_estandar"
              register={register}
              errors={errors}
              optional={true}
            >
              {isUpdate && initialData
                ? renderUnidadesMedida("empaque")
                : renderUnidadesMedida("")}
            </MateriaPrimaFormSelectContainer>
          </div>

          <div className="flex flex-col gap-2 py-8 border-b border-gray-300">
            <MateriaPrimaFormInputContainer
              inputType="number"
              title="Punto de reorden"
              name="punto_reorden"
              register={register}
              errors={errors}
            />

            <MateriaPrimaFormSelectContainer
              title="Unidad de medida base"
              name="unidad_medida_base"
              register={register}
              errors={errors}
            >
              {isUpdate && initialData
                ? renderUnidadesMedida("base")
                : renderUnidadesMedida("")}
            </MateriaPrimaFormSelectContainer>

            <MateriaPrimaFormSelectContainer
              title="Categoria"
              name="categoria"
              register={register}
              errors={errors}
            >
              {renderCategoriasMateriaPrima()}
            </MateriaPrimaFormSelectContainer>

            <MateriaPrimaFormInputContainer
              inputType="textarea"
              title="Descripcion"
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
