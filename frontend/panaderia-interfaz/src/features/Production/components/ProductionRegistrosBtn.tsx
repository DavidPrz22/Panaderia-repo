import { DotMenuIcon } from "@/assets/DashboardAssets";
import { useProductionContext } from "@/context/ProductionContext";

export const ProductionRegistrosBtn = () => {
  const { setShowProductionRegistros } = useProductionContext();
  return (
    <button
      onClick={() => setShowProductionRegistros(true)}
      className="flex items-center gap-3 bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded cursor-pointer shadow-sm font-[Roboto] font-medium hover:bg-gray-100"
    >
      <img src={DotMenuIcon} className="size-5" alt="Ver Registros" />
      Ver Registros
    </button>
  );
};
