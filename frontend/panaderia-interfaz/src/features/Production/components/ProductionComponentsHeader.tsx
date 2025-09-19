import { ProductionComponentTitle } from "./ProductionComponentTitle";
import { Plus } from "../../../assets/GeneralIcons/Index";
import { useProductionContext } from "@/context/ProductionContext";

export const ProductionComponentsHeader = () => {
  const { setShowNewComponentModal } = useProductionContext();

  const handleClick = () => {
    setShowNewComponentModal(true);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <ProductionComponentTitle />
      <button
        className=" border border-gray-200 rounded-md p-2 hover:bg-blue-500 hover:text-white hover:border-transparent cursor-pointer transition-colors duration-100 "
        onClick={handleClick}
      >
        <Plus className="inline-block mr-1" />
        Agregar Componente
      </button>
    </div>
  );
};
