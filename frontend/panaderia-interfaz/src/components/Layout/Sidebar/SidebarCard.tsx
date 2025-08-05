import { useNavigate } from "react-router-dom";
import type { SidebarCardProps } from "@/features/MateriaPrima/types/types";
import { useAppContext } from "@/context/AppContext";
export default function SidebarCard({
  children,
  icon,
  onclick,
  link,
  id,
}: SidebarCardProps) {
  const navigate = useNavigate();
  const { selectedModule } = useAppContext();
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (link) {
      navigate(link);
    }
    onclick(e);
  }

  return (
    <div
      className={`flex items-center gap-2.5 p-2 hover:bg-white/20 transition-colors duration-200 ease-in-out rounded-md cursor-pointer ${
        id === selectedModule ? "bg-white/20" : ""
      }`}
      onClick={handleClick}
      id={id}
    >
      <img src={icon} alt={icon} />
      <div className="font-[Roboto] text-md text-white ">{children}</div>
    </div>
  );
}
