import { CapasIcon } from "@/assets/DashboardAssets";

export const ProductionComponentTitle = () => {
  return (
      <div>
          <div className="flex gap-1 text-xl font-semibold ">
              <img src={CapasIcon} className="size-8" alt="" />
              Componentes de Producción
          </div>
          <div className="text-gray-700">
            Lista de todos los componentes de producción disponibles.
          </div>
      </div>
  );
};
