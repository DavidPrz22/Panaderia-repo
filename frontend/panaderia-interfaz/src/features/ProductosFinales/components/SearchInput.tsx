import { XIcon, SearchIcon } from "@/assets/DashboardAssets";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SearchInput() {
  const {
    productosFinalesSearchTerm,
    setProductosFinalesSearchTerm,
  } = useProductosFinalesContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localValue, setLocalValue] = useState(productosFinalesSearchTerm);
  const debounceTimer = useRef<number | null>(null);

  const commitSearch = useCallback(
    (value: string) => {
      setProductosFinalesSearchTerm(value.trim());
    },
    [setProductosFinalesSearchTerm],
  );

  // Sync external term changes ONLY when they differ (prevents wiping while user types)

  useEffect(() => {
    if (productosFinalesSearchTerm !== localValue) {
      setLocalValue(productosFinalesSearchTerm);
    }
  }, [productosFinalesSearchTerm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => commitSearch(value), 350);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      commitSearch(localValue);
    } else if (e.key === "Escape") {
      resetSearch();
    }
  };

  const resetSearch = () => {
    setLocalValue("");
    commitSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="w-[var(--search-input-width)] shadow-sm bg-white rounded-full flex items-center justify-between gap-4 p-1 relative border border-gray-200">
      <div className="flex-1 pl-4">
        <input
          id="searchInput"
          type="text"
          placeholder="Buscar producto final..."
          className="font-medium font-[Roboto] outline-none w-full"
          ref={inputRef}
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      {localValue && (
        <button
          onClick={resetSearch}
            aria-label="Limpiar búsqueda"
          className="absolute right-[13%] flex items-center justify-center p-0.5 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 "
        >
          <img className="size-4" src={XIcon} alt="X" />
        </button>
      )}

      <button
        className="bg-blue-500 cursor-pointer transition-colors duration-200 p-2 rounded-full hover:bg-blue-600"
        onClick={() => commitSearch(localValue)}
        aria-label="Buscar"
      >
        <img src={SearchIcon} alt="Search" />
      </button>
    </div>
  );
}
