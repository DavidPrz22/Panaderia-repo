import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import ProductosIntermediosPanel from "@/features/ProductosIntermedios/components/ProductosIntermediosPanel";
import ProductosIntermediosForma from "@/features/ProductosIntermedios/components/ProductosIntermediosForma";
import ProductosIntermediosDetalles from "@/features/ProductosIntermedios/components/ProductosIntermediosDetalles";
import { ProductosIntermediosProvider } from "@/context/ProductosIntermediosContext";

export default function ProductosIntermediosPage() {
  return (
    <ProductosIntermediosProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="pt-7 pb-3 h-full">
            <ProductosIntermediosPanel />
            <ProductosIntermediosForma />
            <ProductosIntermediosDetalles />
          </main>
        </div>
      </div>
    </ProductosIntermediosProvider>
  );
}
