import OrdenesIndex from "../features/Ordenes/components/OrdenesIndex";
import Sidebar from "../components/Layout/Sidebar/Sidebar";
import HeaderBar from "../components/Layout/HeaderBar/HeaderBar";
import { OrdenesProvider } from "@/context/OrdenesContext";

const OrdenesPage = () => {
  return (
    <OrdenesProvider>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className={`flex-1 ml-(--sidebar-width) pt-(--header-height)`}>
          <main className="h-full">
            <OrdenesIndex />
          </main>
        </div>
      </div >
    </OrdenesProvider>
  );
};

export default OrdenesPage;