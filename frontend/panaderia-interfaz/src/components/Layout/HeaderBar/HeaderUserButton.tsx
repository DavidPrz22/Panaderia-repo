import { useAuth } from "@/context/AuthContext";
import { UsuarioIcon } from "@/assets/DashboardAssets";

export default function HeaderUserButton() {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full p-2 transition-colors duration-200">
      <div className="text-md font-semibold">
        {user?.full_name || "Usuario"}
      </div>
      <div className="flex items-center cursor-pointer">
        <img src={UsuarioIcon} alt="Usuario" />
      </div>
    </div>
  );
}
