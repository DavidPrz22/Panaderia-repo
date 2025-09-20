import { PlussignIcon } from "@/assets/DashboardAssets";
import { useTransformacionContext } from "@/context/TransformacionContext";
import { NuevaTransformacion } from "./NuevaTransformacion";

export const NuevaTransformacionBtn = () => {
    const { isOpen, setIsOpen } = useTransformacionContext();


    return (
        <>
        <button className="flex items-center gap-3 bg-blue-600 text-white border border-gray-300 px-4 py-2 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-blue-400" 
        onClick={() => setIsOpen(true)}> 
            <img src={PlussignIcon} className="size-7" alt="Icono de menú" />
            Nueva Transformación
        </button>
        {isOpen && <NuevaTransformacion />}
        </>
    );
};
