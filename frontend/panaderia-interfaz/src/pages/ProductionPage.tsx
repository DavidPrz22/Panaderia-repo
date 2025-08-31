import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import { ProductionRegisterCard } from "@/features/Production/components/ProductionRegisterCard";
import { ProductionProvider } from "@/context/ProductionContext";

export default function MateriaPrimaPage() {
  return (
    <ProductionProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="pt-7 pb-3 h-full">
            <div className="px-8 h-full">
                <h1 className="text-2xl font-semibold mb-4">Producción</h1>
                {/* Aquí va el contenido específico de la página de Producción */}
                <ProductionRegisterCard />
            </div>
          </main>
        </div>
      </div>
    </ProductionProvider>
  );
}
