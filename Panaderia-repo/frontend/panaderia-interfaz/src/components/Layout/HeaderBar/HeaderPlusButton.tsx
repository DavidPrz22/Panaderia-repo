// import Agregar from "@/assets/DashboardAssets/Agregar.svg";
import { PlussignIcon } from "@/assets/DashboardAssets";

export default function HeaderPlusButton() {
  return (
    <div className="flex items-center gap-1 cursor-pointer bg-blue-800 rounded-lg hover:bg-blue-700 px-4 py-1.5 transition-colors duration-100">
      <div className="flex items-center cursor-pointer">
        <img src={PlussignIcon} className="size-5" alt="Agregar" />
      </div>
      <div className="text-white text-md font-semibold">Agregar ítem</div>
    </div>
  );
}
