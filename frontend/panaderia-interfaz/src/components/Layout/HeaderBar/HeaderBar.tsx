import { useState, useEffect } from "react";
import HeaderUserButton from "./HeaderUserButton";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

export default function HeaderBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed flex font-[Roboto] items-center justify-between top-0 py-3 px-8 bg-white z-(--z-index-header-bar) left-[var(--sidebar-width)] w-[calc(100%-var(--sidebar-width))] max-h-[var(--header-height)] transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : "border-b border-gray-200"
      }`}
    >
      {/* <div className="flex items-center justify-center">
        <HeaderPlusButton />
      </div>
    
      <div className="flex items-center justify-end gap-2 pr-8 min-w-[220px]">
        <HeaderUserButton />
        <HeaderButton icon={ConfigIcon} />
      </div>
      */}
      <div className="flex flex-1 items-center justify-end gap-3 pr-8">
        <HeaderUserButton />
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Cerrar sesión"
          className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 rounded-full px-3 py-2 transition-colors duration-200 bg-transparent border-none outline-none text-sm font-medium text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
