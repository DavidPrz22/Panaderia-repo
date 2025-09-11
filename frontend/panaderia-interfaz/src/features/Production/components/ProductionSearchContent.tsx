import ProductionSearchListItem from "./ProductionSearchListItem";
import { useProductionContext } from "@/context/ProductionContext";
import type { componentesSearchItem } from "../types/types";

export const ProductionSearchListContent = ({
  category,
  items,
}: {
  category: string;
  items: componentesSearchItem[];
}) => {
  const {
    setNewComponentSelected,
    setComponentSearchList,
    setShowComponentSearch,
  } = useProductionContext();
  const handleClick = (item: componentesSearchItem) => {
    setNewComponentSelected({...item, cantidad: 0});
    setShowComponentSearch(false);
    setComponentSearchList([]);
  };
  return (
    <div className="flex flex-col">
      <div className="font-[Roboto] text-sm font-semibold border-b border-gray-300 py-2 px-5 ">
        {category}
      </div>
      <ul className="flex flex-col">
        {items.map((item, index) => (
          <ProductionSearchListItem
            key={index}
            nombre={item.nombre}
            tipo={item.tipo}
            stock={item.stock | 0}
            unidad_medida={item.unidad_medida}
            onClick={() => handleClick(item)}
          />
        ))}
      </ul>
    </div>
  );
};
