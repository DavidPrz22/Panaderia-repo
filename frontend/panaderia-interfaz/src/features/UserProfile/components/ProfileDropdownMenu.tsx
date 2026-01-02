import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ProfileDropdownMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProfileSettings = () => {
    navigate("/dashboard/perfil");
  };

  return (
    <DropdownMenuContent className="w-64">
      <DropdownMenuLabel className="pb-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold truncate">
              {user?.full_name ?? "Usuario"}
            </span>
            {user?.rol && (
              <span className="inline-flex shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 border border-blue-100">
                {user.rol}
              </span>
            )}
          </div>
          {user?.username && user.username !== user.rol && (
            <span className="text-[11px] font-mono text-muted-foreground break-all">
              @{user.username}
            </span>
          )}
          <span className="text-xs text-muted-foreground break-all">
            {user?.email ?? "Sin correo"}
          </span>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="cursor-pointer text-sm"
        onClick={handleProfileSettings}
      >
        Configuración de Perfil
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
