import FilterButton from "./FilterButton";
import ImportCSV from "@/components/ImportCSV";
import NewButton from "@/components/NewButton";
import SearchInput from "@/features/ProductosIntermedios/components/SearchInput";
import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export default function FilterSearch() {
  const { setShowProductosIntermediosForm } = useProductosIntermediosContext();
  return (
    <div className="flex items-center px-8 justify-between">
      <SearchInput />
      <div className="flex gap-4">
        <ImportCSV />
        <FilterButton />
        <NewButton
          onClick={() => {
            setShowProductosIntermediosForm(true);
          }}
        />
      </div>
    </div>
  );
}
