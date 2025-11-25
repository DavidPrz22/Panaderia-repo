import FilterButton from "./FilterButton";
import NewButton from "@/components/NewButton";
import SearchInput from "./SearchInput";
import { Button } from "@/components/ui/button";
import { useProductosReventaContext } from "@/context/ProductosReventaContext";
import { PackageX, TrendingDown } from "lucide-react";

export default function FilterSearch() {
  const { setShowProductosReventaForm, bajoStockFilter, setBajoStockFilter, agotadosFilter, setAgotadosFilter } = useProductosReventaContext();

  const toggleBajoStock = () => {
    setBajoStockFilter(!bajoStockFilter);
  }
  const toggleAgotados = () => {
    setAgotadosFilter(!agotadosFilter);
  }

  return (
    <div className="flex items-center px-8 justify-between">
      <SearchInput />
      <div className="flex gap-4">
        <Button variant="outline" size="lg" className={`${bajoStockFilter ? "bg-black border-transparent text-white hover:bg-gray-300" : "border-gray-200 shadow-xs "} border cursor-pointer`} onClick={() => toggleBajoStock()}>
          <TrendingDown />
          Bajo Stock
        </Button>
        <Button variant="outline" size="lg" className={`${agotadosFilter ? "bg-black border-transparent text-white hover:bg-gray-300" : "border-gray-200 shadow-xs "} border cursor-pointer`} onClick={() => toggleAgotados()}>
          <PackageX />
          Agotados
        </Button>
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
