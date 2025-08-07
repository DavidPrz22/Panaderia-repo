import { useRecetasContext } from "@/context/RecetasContext";
import type { RecetasFormSearchInputProps } from "../types/types";

export default function RecetaSearchInput({
  typeInput,
  placeholder = "",
  onChange,
}: RecetasFormSearchInputProps) {
  const {
    searchListRecetasRef,
    setSearchListActiveRecetas,
    setSearchListItems,
    searchListItems,
  } = useRecetasContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      if (e.target.value === "") {
        setSearchListItems([]);
      } else {
        onChange(e.target.value);
      }
    }

    setSearchListActiveRecetas(true);
  };

  const resetSearchList = () => {
    setSearchListActiveRecetas(false);
    setSearchListItems([]);
    if (searchListRecetasRef.current) {
      searchListRecetasRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <input
        type={typeInput}
        onChange={handleChange}
        ref={searchListRecetasRef as React.RefObject<HTMLInputElement>}
        placeholder={placeholder}
        className="block w-full px-3 py-4 border border-gray-300 rounded-md shadow-xs font-[Roboto]
                            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {searchListItems.length > 0 && (
        <div
          className="absolute right-2 bottom-2.5 flex items-center justify-center border border-gray-300 px-2 py-1 rounded-md cursor-pointer"
          onClick={resetSearchList}
        >
          Cerrar
        </div>
      )}
    </div>
  );
}
