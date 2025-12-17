import { PaginaInicio,  } from "@/features/PuntoDeVenta/componentes/PosPantallaInicio";  
import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import { POSProvider } from "@/context/POSContext";

export default function POSPage () {

    return (
        <POSProvider>
            <Sidebar />
            <HeaderBar />
            <div className="flex min-h-screen">
                <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
                    <main className="h-full">
                        <PaginaInicio />
                    </main>
                </div>
            </div >
        </POSProvider>
        )
}