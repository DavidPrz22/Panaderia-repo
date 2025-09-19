import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";

import FilterButton from "./FilterButton";
import ImportCSV from "../../../components/ImportCSV";
import NewButton from "../../../components/NewButton";
import SearchInput from "./SearchInput";

export default function FilterSearch() {
  const { setShowMateriaprimaForm } = useMateriaPrimaContext();

  const handleNewButtonClick = () => {
    setShowMateriaprimaForm(true);
  };

  return (
    <div className="flex items-center px-8 justify-between">
      <SearchInput />
      <div className="flex gap-4">
        <ImportCSV />
        <FilterButton />
        <NewButton onClick={handleNewButtonClick} />
      </div>
    </div>
  );
}
