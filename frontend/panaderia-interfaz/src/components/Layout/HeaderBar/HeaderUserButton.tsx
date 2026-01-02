import { useAuth } from "@/context/AuthContext";
import { UsuarioIcon } from "@/assets/DashboardAssets";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileDropdownMenu } from "@/features/UserProfile/components/ProfileDropdownMenu";

export default function HeaderUserButton() {
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full p-2 transition-colors duration-200 outline-none border-none bg-transparent">
          <div className="text-md font-semibold max-w-[180px] truncate text-right">
            {user?.full_name || "Usuario"}
          </div>
          <div className="flex items-center">
            <img src={UsuarioIcon} alt="Usuario" />
          </div>
        </button>
      </DropdownMenuTrigger>
      <ProfileDropdownMenu />
    </DropdownMenu>
  );
}
