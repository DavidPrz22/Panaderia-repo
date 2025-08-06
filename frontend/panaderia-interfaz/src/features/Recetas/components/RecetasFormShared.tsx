import Button from "@/components/Button";
import type { RecetasFormSharedProps } from "@/features/Recetas/types/types";
import { recetasFormSchema, type TRecetasFormSchema } from "../schemas/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RecetasFormInputContainer from "./RecetasFormInputContainer";
import { useRecetasContext } from "@/context/RecetasContext";
import { useEffect } from "react";
import { useComponentesRecetaSearchMutation, useRegisterRecetaMutation } from "../hooks/mutations/recetasMutations";

import NoResults from "./NoResults";
import RecetasSearchListContainer from "./RecetasSearchListContainer";
import RecetasFormLoading from "./RecetasFormLoading";
import RecetesComponentesListados from "./RecetesComponentesListados";
import { PendingTubeSpinner } from "./PendingTubeSpinner";

export default function RecetasFormShared(
    {
        title,
        isUpdate: _isUpdate=false, // eslint-disable-line @typescript-eslint/no-unused-vars
        onClose,
        onSubmitSuccess,
    }: RecetasFormSharedProps
) {
    const { searchListActiveRecetas, setSearchListActiveRecetas, searchListItems, timer, setTimer} = useRecetasContext();

    const { mutate: componentesRecetaSearchMutation, isPending: isComponentesRecetaSearchPending } 
    = useComponentesRecetaSearchMutation();

    const { mutateAsync: registerRecetaMutation, isPending: isRegisterRecetaPending  } = useRegisterRecetaMutation();
    
    const { register, formState: { errors } , handleSubmit, watch, setValue} = useForm<TRecetasFormSchema>({
        resolver: zodResolver(recetasFormSchema),
        defaultValues: {
            nombre: "",
            componente_receta: [],
        },
    });


    useEffect(() => {
        if (!searchListActiveRecetas) return;
        const componentesRecetaContainer = document.getElementById("componentes-receta-container");

        const handleClickOutside = (event: MouseEvent) => {
            if (componentesRecetaContainer && !componentesRecetaContainer.contains(event.target as Node)) {
              setSearchListActiveRecetas(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () =>  document.removeEventListener("click", handleClickOutside);
    }, [searchListActiveRecetas, setSearchListActiveRecetas]);

    const handleCancelButtonClick = () => {
        onClose();
    }

    const handleSearchListFocus = async (search: string) => {
      if (timer) {
        clearTimeout(timer);
      }
      const interval = setTimeout(() => {
            componentesRecetaSearchMutation(search);
            setTimer(null);
        }, 1000);
        setTimer(interval as NodeJS.Timeout);
    }


    const onSubmit = async (data: TRecetasFormSchema) => {
        await registerRecetaMutation(data);
        onSubmitSuccess();
    }

    return (
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="productos-intermedios-form"
        >
  
          <div className="flex flex-col mx-8 mt-4 rounded-md border border-gray-200 shadow-md relative">
            {isRegisterRecetaPending && (
              <PendingTubeSpinner size={28} extraClass="absolute bg-white opacity-50 w-full h-full" />
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

                <div className="flex flex-col relative" id="componentes-receta-container">
                  <RecetasFormInputContainer
                    title="Componentes"
                    name="componente_receta"
                    errors={errors}
                    inputType="text"
                    recetaBusqueda={true}
                    onChange={handleSearchListFocus}
                  />

                  {searchListActiveRecetas && (
                      isComponentesRecetaSearchPending ? (
                        <RecetasFormLoading />
                      ) : (
                        searchListItems.length > 0 ? (
                        <RecetasSearchListContainer watch={watch} setValue={setValue} />
                        ) : (
                          !timer && <NoResults />
                        )
                  ))}

                </div>
              </div>

              <div className="flex flex-col gap-2 border border-gray-300 py-5 px-7 rounded-md font-[Roboto]">

                <div className=" text-lg font-semibold ">
                  Componentes Listados
                </div>
                <RecetesComponentesListados watch={watch} setValue={setValue} />
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