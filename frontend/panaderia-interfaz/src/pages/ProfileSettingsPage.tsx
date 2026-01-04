import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import HeaderBar from "@/components/Layout/HeaderBar/HeaderBar";
import { ProfileSettingsPanel } from "@/features/UserProfile/components/ProfileSettingsPanel";

const ProfileSettingsPage = () => {
  return (
    <>
      <Sidebar />
      <HeaderBar />
      <div className="flex min-h-screen">
        <div className="flex-1 ml-(--sidebar-width) pt-(--header-height)">
          <main className="h-full">
            <ProfileSettingsPanel />
          </main>
        </div>
      </div>
    </>
  );
};

export default ProfileSettingsPage;