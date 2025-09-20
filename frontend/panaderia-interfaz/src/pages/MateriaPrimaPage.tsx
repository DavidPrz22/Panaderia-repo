import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import MateriaPrimaPanel from "@/features/MateriaPrima/components/MateriaPrimaPanel";
import MateriasPrimasForma from "@/features/MateriaPrima/components/MateriasPrimasForma";
import { MaterialPrimaDetalles } from "@/features/MateriaPrima/components/MateriaPrimaDetalles";
import { MateriaPrimaProvider } from "@/context/MateriaPrimaContext";


export default function MateriaPrimaPage() {
  return (
    <MateriaPrimaProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="pt-7 pb-3 h-full">
            <MateriaPrimaPanel />
            <MateriasPrimasForma />
            <MaterialPrimaDetalles />
          </main>
        </div>
      </div>
    </MateriaPrimaProvider>
  );
}
