import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import { ProductionProvider } from "@/context/ProductionContext";
import ProductionHeader from "@/features/Production/components/ProductionHeader";
import { ProductionRegistrosModal } from "@/features/Production/components/ProductionRegistrosModal";
import { ProductionForm } from "@/features/Production/components/ProductionForm";

export default function ProductionPage() {

  return (
    <ProductionProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="pt-7 pb-3 h-full">
            <div className="px-8 h-full">
                <ProductionHeader />
                <ProductionForm />
                <ProductionRegistrosModal />
            </div>
          </main>
        </div>
      </div>
    </ProductionProvider>
  );
}
