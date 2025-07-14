import { useNavigate } from "react-router-dom";
import type { SidebarCardProps } from "@/lib/types";

export default function SidebarCard({ children, icon, onclick, link }: SidebarCardProps) {
    const navigate = useNavigate();

    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
        if (link) {
            navigate(link);
        }
        onclick(e);
    }

    return (
        <div className="flex items-center gap-2.5 p-2 hover:bg-white/20 transition-colors duration-200 ease-in-out rounded-md cursor-pointer" onClick={handleClick}>
            <img src={icon} alt={icon}/>
            <div className="font-[Roboto] text-md text-white ">
                {children}
            </div>
        </div>
    )
}