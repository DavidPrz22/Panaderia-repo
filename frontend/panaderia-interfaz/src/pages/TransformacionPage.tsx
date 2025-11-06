import Principal from "@/features/Transformation/components/Principal";
import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import Seleccion from "@/features/Transformation/components/Selección";
import { TransformacionProvider } from "@/context/TransformacionContext";


export default function TransformacionPage() {
    return (
    <TransformacionProvider>
        <Sidebar />
        <HeaderBar />
        <div className="flex min-h-screen">
            <div className="flex-1 ml-[var(--sidebar-width)] pt-[var(--header-height)]">
                <main className="pt-4 pb-6 h-full overflow-auto max-h-[calc(100vh-var(--header-height))]">
                    <Principal />
                    <Seleccion />
                </main>
            </div>
        </div>
    </TransformacionProvider>
    );
}
