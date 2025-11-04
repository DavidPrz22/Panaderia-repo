import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import ProductosReventaPanel from "@/features/ProductosReventa/components/ProductosReventaPanel";
import ProductosReventaForm from "@/features/ProductosReventa/components/ProductosReventaForm";
import ProductosReventaDetalles from "@/features/ProductosReventa/components/ProductosReventaDetalles";
import { ProductosReventaProvider } from "@/context/ProductosReventaContext";

export default function ProductosReventaPage() {
  return (
    <ProductosReventaProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="pt-7 pb-3 h-full">
            <ProductosReventaPanel />
            <ProductosReventaForm />
            <ProductosReventaDetalles />
          </main>
        </div>
      </div>
    </ProductosReventaProvider>
  );
}