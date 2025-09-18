import { Glass, UpDown } from "../../../assets/GeneralIcons/Index";
import { useProductionContext } from "@/context/ProductionContext";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner.tsx";
import "@/styles/animations.css";
import { ProductionSearchListContent } from "./ProductionSearchContent.tsx";
import { useComponentesProductionSearchMutation } from "../hooks/mutations/mutations.ts";
import { useState } from "react";

export const ProductionNewComponentSearch = () => {
  const {
    componentSearchList,
    setComponentSearchList,
    showComponentSearch,
    setShowComponentSearch,
    newComponentSelected,
  } = useProductionContext();

  const [isClosingSearch, setIsClosingSearch] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const {
    mutateAsync: componentesProductionSearchMutation,
    isPending: isComponenteSearchPending,
  } = useComponentesProductionSearchMutation();

  const handleOnSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === "") {
      setComponentSearchList([]);
      clearTimeout(timer as NodeJS.Timeout);
      return;
    }
    if (timer) clearTimeout(timer);
    const timerRef = setTimeout(() => componentesProductionSearchMutation(event.target.value), 1000);
    setTimer(timerRef);
  };

  const handClickDisplay = () => {
    if (!showComponentSearch) {
        setShowComponentSearch(true);
    } else {
        setIsClosingSearch(true);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2 relative">
      <div>Componente: </div>
      <div
        onClick={handClickDisplay}
        className="flex items-center justify-between border border-gray-200 p-2 cursor-pointer rounded-md hover:bg-blue-500 hover:text-white hover:border-transparent transition-colors duration-150"
      >
        <div>
          {newComponentSelected
            ? newComponentSelected.nombre
            : "Componente Seleccionado"}
        </div>
        <UpDown />
      </div>

      {showComponentSearch && (
        <div
          onAnimationEnd={() => {
            if (isClosingSearch) {
              setShowComponentSearch(false);
              setIsClosingSearch(false);
              setComponentSearchList([]);
            }
          }}
          className={`absolute top-[106%] border border-gray-200 w-full rounded-md bg-white shadow-md ${isClosingSearch ? "animate-fadeOut" : "animate-fadeIn"}`}
        >
          <div className="w-full border-b border-gray-200 flex gap-2 items-center p-3">
            <Glass className="size-5 text-gray-500" />
            <input
              onChange={handleOnSearch}
              type="text"
              placeholder="Busca componente por nombre..."
              className="w-full outline-none border-none"
            />
          </div>
          <div className="max-h-[180px] overflow-y-auto">
            {isComponenteSearchPending ? (
              <PendingTubeSpinner size={10} extraClass="p-1" />
            ) : componentSearchList.length > 0 ? (
              componentSearchList.map((item, index) => (
                <ProductionSearchListContent
                  key={index}
                  category={Object.keys(item)[0]}
                  items={Object.values(item)[0]}
                />
              ))
            ) : (
              <div className="px-4 py-2 text-gray-800 ">...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
