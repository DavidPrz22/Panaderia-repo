import { PlussignIcon } from "@/assets/DashboardAssets";
import AggClientes from "./AggClientes";
import { useClientContext } from '@/context/ClientContext';

export default function ButtonNew() {
    const { setOpen } = useClientContext();

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-3 bg-blue-600 text-white border border-gray-300 px-4 py-2 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-blue-400"
            >
                <img src={PlussignIcon} className="size-7" alt="Icono de menú" />
                Agregar Cliente
            </button>
            {/* Mount AggClientes; modal is controlled via ClientContext */}
            <AggClientes />
        </>
    );
}