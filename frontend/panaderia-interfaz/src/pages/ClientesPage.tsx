import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";


export default function ClientesPage() {
    return (
        <>
        <HeaderBar />
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold  ">Clientes</h1>
                <p>Aquí puedes gestionar tus clientes.</p>
            </main>
        </div>
        </>
    );
}
