import FilterButton from "./FilterButton";
import NewButton from "@/components/NewButton";
import SearchInput from "./SearchInput";
import { useProductosReventaContext } from "@/context/ProductosReventaContext";

export default function FilterSearch() {
  const { setShowProductosReventaForm } = useProductosReventaContext();
  return (
    <div className="flex items-center px-8 justify-between">
      <SearchInput />
      <div className="flex gap-4">
        <FilterButton />
        <NewButton
          onClick={() => {
            setShowProductosReventaForm(true);
          }}
        />
      </div>
    </div>
  );
}
