import Title from "@/components/Title"
import Button from "./MateriaPrimaComponentes/Button"
import { useAppContext } from "@/context/AppContext";

export const DeleteComponent = ({deleteFunction}: {deleteFunction: () => void}) => {
    const {setRegistroDelete} = useAppContext();
    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.5)] z-50'>
            <div className="flex flex-col gap-5 w-[500px] bg-white rounded-lg shadow-md  p-5">

                <div className="flex flex-col gap-5 justify-between items-center">
                    <Title>Seguro que desea eliminar este registro?</Title>
                    <div className="flex justify-between gap-2">
                        <Button type="cancel" onClick={() => {setRegistroDelete(null)}}>
                            <div className="flex items-center gap-2">
                                Cancelar
                            </div>
                        </Button>
                        <Button type="delete" onClick={deleteFunction}>
                            <div className="flex items-center gap-2">
                                Eliminar
                                <img src='/DashboardAssets/Borrar.svg' alt="Eliminar" />
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        
    )
}