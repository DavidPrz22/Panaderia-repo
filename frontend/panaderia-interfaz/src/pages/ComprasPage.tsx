import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "../components/Layout/HeaderBar/HeaderBar";
import { ComprasProvider } from "../context/ComprasContext";
import { ComprasIndex } from "../features/Compras/components/ComprasIndex";

const ComprasPage = () => {
  return (
    <ComprasProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="h-full">
            <ComprasIndex />
          </main>
        </div>
      </div >
    </ComprasProvider>
  );
};

export default ComprasPage;