import { ProductosFinalesProvider } from "@/context/ProductosFinalesContext";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import ProductosFinalesPanel from "@/features/ProductosFinales/components/ProductosFinalesPanel";
import ProductosFinalesForma from "@/features/ProductosFinales/components/ProductosFinalesForma";
import ProductosFinalesDetalles from "@/features/ProductosFinales/components/ProductosFinalesDetalles";

export default function ProductosFinalesPage() {
  return (
    <ProductosFinalesProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="pt-7 pb-3 h-full">
            <ProductosFinalesPanel />
            <ProductosFinalesForma />
            <ProductosFinalesDetalles />
          </main>
        </div>
      </div>
    </ProductosFinalesProvider>
  );
}