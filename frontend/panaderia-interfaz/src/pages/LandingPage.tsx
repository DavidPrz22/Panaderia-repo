import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import Sidebar from "../components/Layout/Sidebar/Sidebar";
import { DashBoardIndex } from "@/features/DashBoard/components/DashBoardIndex";
import { DashBoardProvider } from "@/context/DashBoardContext";

export function LandingPage() {
  return (
    <DashBoardProvider>
      <main >
        <Sidebar />
        <HeaderBar />
        <div className="min-h-screen bg-gray-100">
          <div className={`ml-(--sidebar-width) pt-(--header-height)`}>
            <DashBoardIndex />
          </div>
        </div >
      </main>
    </DashBoardProvider>
  );
}
