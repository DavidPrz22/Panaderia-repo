import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import Principal from "@/features/Ventas/Clientes/components/Principal";
import { ClientProvider } from "@/context/ClientContext";
import ButtonNew from "@/features/Ventas/Clientes/components/ButtonNew";
import TitleClientes from "@/features/Ventas/Clientes/components/TitleClientes";


export default function ClientesPage() {
    return (
        <ClientProvider>
        <>
        <HeaderBar />
        <div className="flex">
            <Sidebar />
            <div className="flex flex-col flex-1 ml-[var(--sidebar-width)] pt-[var(--header-height)] h-screen">
                <main className="px-8 pt-6 pb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <TitleClientes />
                        </div>
                        <ButtonNew />
                    </div>
                </main>
                <div className="flex-grow bg-white border border-gray-200 rounded-lg p-4 mx-8 mb-8 overflow-y-auto">
                    <Principal />
                </div>
            </div>
        </div>
        </>
        </ClientProvider>
    );
}
