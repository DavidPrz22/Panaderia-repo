import FilterButton from "./FilterButton";
import ImportCSV from "@/components/ImportCSV";
import NewButton from "@/components/NewButton";
import SearchInput from "@/features/Recetas/components/SearchInput";
import { useRecetasContext } from "@/context/RecetasContext";

export default function FilterSearch() {
  const { setShowRecetasForm } = useRecetasContext();
  return (
    <div className="flex items-center px-8 justify-between">
      <SearchInput />
      <div className="flex gap-4">
        <ImportCSV/>
        <FilterButton />
        <NewButton
          onClick={() => {
            setShowRecetasForm(true);
          }}
        />
      </div>
    </div>
  );
}
