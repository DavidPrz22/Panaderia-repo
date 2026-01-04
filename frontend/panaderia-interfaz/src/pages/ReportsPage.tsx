import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import Reportes from "@/features/Reportes/components/ReportesIndex";
import { ReportesProvider } from "@/context/ReportesContext";

const ReportsPage = () => {
    return (
        <>
            <Sidebar />
            <HeaderBar />
            <div className="flex min-h-screen">
                <div className="flex-1 ml-(--sidebar-width) pt-(--header-height)">
                    <main className="h-full p-8">
                        <ReportesProvider>
                            <Reportes />
                        </ReportesProvider>
                    </main>
                </div>
            </div>
        </>
    );
};

export default ReportsPage;
