import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import { ProductionRegisterCard } from "@/features/Production/components/ProductionRegisterCard";
import { ProductionProvider } from "@/context/ProductionContext";
import ProductionHeader from "@/features/Production/components/ProductionHeader";
import ProductionButtons from "@/features/Production/components/ProductionButtons";
import { ProductionComponents } from "@/features/Production/components/ProductionComponents";

export default function MateriaPrimaPage() {
  return (
    <ProductionProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="pt-7 pb-3 h-full">
            <div className="px-8 h-full">
                <ProductionHeader />
                <ProductionRegisterCard />
                <ProductionComponents />
                <ProductionButtons />
            </div>
          </main>
        </div>
      </div>
    </ProductionProvider>
  );
}
