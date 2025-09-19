import {
  loteMateriaPrimaSchema,
  type TLoteMateriaPrimaSchema,
} from "@/features/MateriaPrima/schemas/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { TubeSpinner } from "@/assets";

import Button from "../../../../components/Button";
import { LotesMateriaPrimaInputContainer } from "./LotesMateriaPrimaInputContainer";
import { LotesMateriaPrimaSelectContainer } from "./LotesMateriaPrimaSelectContainer";
import type {
  LoteMateriaPrimaFormSumit,
  LotesMateriaPrimaFormSharedProps,
  Proveedor,
} from "@/features/MateriaPrima/types/types";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import { createProveedoresQueryOptions } from "@/features/MateriaPrima/hooks/queries/materiaPrimaQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { useCreateUpdateLoteMateriaPrimaMutation } from "../../hooks/mutations/materiaPrimaMutations";

export const LotesMateriaPrimaFormShared = ({
  title,
  isUpdate = false,
  initialData,
  onClose,
  onSubmitSuccess,
}: LotesMateriaPrimaFormSharedProps) => {
  const { materiaprimaId } = useMateriaPrimaContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TLoteMateriaPrimaSchema>({
    resolver: zodResolver(loteMateriaPrimaSchema),
    defaultValues: initialData || {},
  });

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const { mutate: createUpdateLoteMateriaPrima, isPending: isLoading } =
    useCreateUpdateLoteMateriaPrimaMutation(
      materiaprimaId!,
      onSubmitSuccess,
      reset,
      isUpdate,
      initialData?.id,
    );

  async function onSubmit(data: TLoteMateriaPrimaSchema) {
    const formatedData: LoteMateriaPrimaFormSumit = {
      ...data,
      materia_prima: materiaprimaId!,
      stock_actual_lote: data.cantidad_recibida,
      detalle_oc: null,
    };

    createUpdateLoteMateriaPrima(formatedData);
  }

  const { data: proveedoresQuery } = useQuery(createProveedoresQueryOptions());

  useEffect(() => {
    if (proveedoresQuery) {
      setProveedores(proveedoresQuery);
    }
  }, [proveedoresQuery]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="lote-form"
        className="relative h-[95%]"
      >
        {isLoading ? (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-50">
            <img src={TubeSpinner} alt="Cargando..." className="size-20" />
          </div>
        ) : (
          ""
        )}
        <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 h-full shadow-md">
          <div className="p-5 font-[Roboto] text-lg font-semibold border-b border-gray-300 bg-gray-50 rounded-t-md">
            {title}
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col gap-2 px-5 bg-white">
              <div className="flex flex-col gap-8 py-8">
                <LotesMateriaPrimaInputContainer
                  inputType="number"
                  title="Cantidad recibida"
                  name="cantidad_recibida"
                  register={register}
                  errors={errors}
                />
                <LotesMateriaPrimaInputContainer
                  inputType="number"
                  title="Costo unitario USD"
                  name="costo_unitario_usd"
                  register={register}
                  errors={errors}
                />
                <LotesMateriaPrimaSelectContainer
                  title="Proveedor"
                  name="proveedor_id"
                  register={register}
                  errors={errors}
                >
                  <option value="">Selecciona un proveedor</option>
                  {proveedores.map(({ id, nombre_comercial }) => (
                    <option key={id} value={id}>
                      {nombre_comercial}
                    </option>
                  ))}
                </LotesMateriaPrimaSelectContainer>

                <LotesMateriaPrimaInputContainer
                  inputType="date"
                  title="Fecha de recepción"
                  name="fecha_recepcion"
                  register={register}
                  errors={errors}
                />
                <LotesMateriaPrimaInputContainer
                  inputType="date"
                  title="Fecha de caducidad"
                  name="fecha_caducidad"
                  register={register}
                  errors={errors}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end py-4 px-5 bg-white border-t border-gray-300">
              <Button type="cancel" onClick={onClose}>
                Cerrar
              </Button>
              <Button type="submit" onClick={() => {}}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
