import FilterButton from "./FilterButton";
import ImportCSV from "@/components/ImportCSV";
import NewButton from "@/components/NewButton";
import SearchInput from "@/features/ProductosIntermedios/components/SearchInput";
import { useProductosFinalesContext } from "@/context/ProductosFinalesContext";

export default function FilterSearch() {
  const { setShowProductoForm } = useProductosFinalesContext();
  return (
    <div className="flex items-center px-8 justify-between">
      <SearchInput />
      <div className="flex gap-4">
        <ImportCSV />
        <FilterButton />
        <NewButton
          onClick={() => {
            setShowProductoForm(true);
          }}
        />
      </div>
    </div>
  );
}
