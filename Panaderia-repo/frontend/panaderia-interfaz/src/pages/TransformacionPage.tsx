import Principal from "@/features/Transformation/components/Principal";
import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import Seleccion from "@/features/Transformation/components/Seleccion";
import { TransformacionProvider } from "@/context/TransformacionContext";



export default function TransformacionPage() {
    return (
    <TransformacionProvider>
        <HeaderBar />
    <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4">
            <Principal />
            <Seleccion />
        </main>
    </div>
    </TransformacionProvider>
    );
}