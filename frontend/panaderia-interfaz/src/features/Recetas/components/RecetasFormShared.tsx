import Button from "@/components/Button";
import type { RecetasFormSharedProps } from "@/features/Recetas/types/types";
import { recetasFormSchema, type TRecetasFormSchema } from "../schemas/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RecetasFormInputContainer from "./RecetasFormInputContainer";
import { useRecetasContext } from "@/context/RecetasContext";
import {
  useRegisterRecetaMutation,
  useUpdateRecetaMutation,
} from "../hooks/mutations/recetasMutations";


import RecetesComponentesListados from "./RecetesComponentesListados";
import { PendingTubeSpinner } from "./PendingTubeSpinner";
import RecetaComponentsContainer from "./RecetaComponentsContainer";
import RecetaListContainer from "./RecetaListContainer";
import RecetasListadasForm from "./RecetasListadasForm";


export default function RecetasFormShared({
  title,
  isUpdate,
  initialData,
  onClose,
  onSubmitSuccess,
}: RecetasFormSharedProps) {
  const {
    recetaId,
    setComponentesListadosReceta,
  } = useRecetasContext();

  const {
    mutateAsync: registerRecetaMutation,
    isPending: isRegisterRecetaPending,
  } = useRegisterRecetaMutation();

  const {
    mutateAsync: updateRecetaMutation,
    isPending: isUpdateRecetaPending,
  } = useUpdateRecetaMutation();


  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<TRecetasFormSchema>({
    resolver: zodResolver(recetasFormSchema),
    defaultValues:
      isUpdate && initialData
        ? {
            nombre: initialData.nombre,
            componente_receta: initialData.componente_receta,
            notas: initialData.notas,
          }
        : {
            nombre: "",
            componente_receta: [],
            notas: "",
          },
  });


  const handleCancelButtonClick = () => {
    onClose();
    setComponentesListadosReceta([]);
  };


  const onSubmit = async (data: TRecetasFormSchema) => {
    if (isUpdate) {
      await updateRecetaMutation({ recetaId: recetaId!, data });
    } else {
      await registerRecetaMutation(data);
    }
    onSubmitSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="productos-intermedios-form">
      <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 shadow-md relative">
        {(isRegisterRecetaPending || isUpdateRecetaPending) && (
          <PendingTubeSpinner
            size={28}
            extraClass="absolute bg-white opacity-50 w-full h-full"
          />
        )}
        <div className="p-5 font-[Roboto] text-lg font-semibold border-b border-gray-300 bg-gray-50 rounded-t-md">
          {title}
        </div>

        <div className="flex flex-col gap-15 px-5 bg-white">
          <div className="flex flex-col gap-2 border-gray-300 py-8 w-[80%] self-center">
            <RecetasFormInputContainer
              register={register}
              title="Nombre"
              name="nombre"
              errors={errors}
              inputType="text"
            />

            <RecetaComponentsContainer
              watch={watch}
              setValue={setValue}
              errors={errors}
            />

            <RecetaListContainer
              errors={errors}
              setValue={setValue}
              watch={watch}
            />

            <RecetasFormInputContainer
              register={register}
              title="Notas"
              name="notas"
              errors={errors}
              inputType="textarea"
              optional={true}
            />
          </div>

          <div className="flex flex-col gap-2 border border-gray-300 py-5 px-7 rounded-md font-[Roboto]">
            <div className=" text-lg font-semibold ">Componentes Listados</div>
            <RecetesComponentesListados watch={watch} setValue={setValue} />
          </div>

          <div className="flex flex-col gap-2 border border-gray-300  rounded-md font-[Roboto]">
            <div className="px-5 py-2 text-lg font-semibold border-b border-gray-300">Recetas Listadas</div>
            <RecetasListadasForm watch={watch} setValue={setValue} />
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
