import FilterButton from "./FilterButton";
import ImportCSV from "@/components/ImportCSV";
import NewButton from "@/components/NewButton";
import SearchInput from "./SearchInput";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";
import FiltersPanel from "./FiltersPanel";

export default function FilterSearch() {
  const { setShowProductoForm } = useProductosFinalesContext();
  return (
    <div className="flex items-start px-8 justify-between relative">
      <SearchInput />
      <div className="flex gap-4 relative">
        <ImportCSV />
        <div className="relative">
          <FilterButton />
          <FiltersPanel />
        </div>
        <NewButton onClick={() => setShowProductoForm(true)} />
      </div>
    </div>
  );
}
