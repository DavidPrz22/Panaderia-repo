import { DotMenuIcon } from "@/assets/DashboardAssets";
import ModalTransformacion from "./ModalTransformacion";
import { useTransformacionContext } from "@/context/TransformacionContext";

export const RegistrosBtn = () => {
    const { isRegistroOpen, setIsRegistroOpen } = useTransformacionContext();

    return (
        <>
        <button className="flex items-center gap-3 bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-100"
        onClick={() => setIsRegistroOpen(true)}>
            <img src={DotMenuIcon} className="size-7" alt="Icono de menú" />
            Ver Transformaciones
        </button>
        {isRegistroOpen && <ModalTransformacion />}
        </>
    );
};
