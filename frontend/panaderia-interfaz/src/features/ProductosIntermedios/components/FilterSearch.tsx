import FilterButton from "./FilterButton";
import PIFiltersPanel from "./PIFiltersPanel";
import ImportCSV from "@/components/ImportCSV";
import NewButton from "@/components/NewButton";
import SearchInput from "@/features/ProductosIntermedios/components/SearchInput";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export default function FilterSearch() {
  const { setShowProductosIntermediosForm } = useProductosIntermediosContext();
  return (
    <div className="flex items-center px-8 justify-between relative">
      <SearchInput />
      <div className="flex gap-4 relative" id="pi-filters-anchor">
        <ImportCSV />
        <FilterButton />
        <NewButton
          onClick={() => {
            setShowProductosIntermediosForm(true);
          }}
        />
        <PIFiltersPanel />
      </div>
    </div>
  );
}
