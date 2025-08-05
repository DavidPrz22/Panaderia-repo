import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import RecetasPanel from "@/features/Recetas/components/RecetasPanel";
import RecetasForma from "@/features/Recetas/components/RecetasForma";
import RecetasDetalles from "@/features/Recetas/components/RecetasDetalles";
import { RecetasProvider } from "@/context/RecetasContext";

export default function RecetasPage() {
  return (
  <RecetasProvider>
    <Sidebar />
    <HeaderBar />
    <div className="flex min-h-screen">
      <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
        <main className="pt-7 pb-3 h-full">
          <RecetasPanel />
          <RecetasForma />
          <RecetasDetalles />
        </main>
      </div>
    </div>
  </RecetasProvider>
  );
}
