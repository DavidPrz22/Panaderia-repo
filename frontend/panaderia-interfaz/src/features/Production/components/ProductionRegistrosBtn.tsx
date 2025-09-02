import { DotMenuIcon } from "@/assets/DashboardAssets";

export const ProductionRegistrosBtn = () => {
  return (
    <button className="flex items-center gap-3 bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-100">
      <img src={DotMenuIcon} className="size-5" alt="Ver Registros" />
      Ver Registros
    </button>
  );
};
