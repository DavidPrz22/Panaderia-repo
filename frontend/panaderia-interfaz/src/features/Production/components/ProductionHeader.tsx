import { FactoryIcon } from "@/assets/DashboardAssets";

export default function ProductionHeader() {
  return (
    <div className="flex items-center p-4 gap-2 mb-2">
      <img src={FactoryIcon} alt="Factory Icon" />
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Producción desde Componentes</h1>
        <span className="text-gray-500 italic">
          Gestiona y registra la producción de productos
        </span>
      </div>
    </div>
  );
}
