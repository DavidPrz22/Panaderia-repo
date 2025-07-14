import FilterButton from "./MateriaPrimaComponentes/FilterButton";
import NewButton from "./MateriaPrimaComponentes/NewButton";
import SearchInput from "./MateriaPrimaComponentes/SearchInput";
import ImportCSV from "./MateriaPrimaComponentes/ImportCSV";
import { useAppContext } from "@/context/AppContext";

export default function FilterSearch() {
    const {setShowMateriaprimaForm} = useAppContext();

    const handleNewButtonClick = () => {
        setShowMateriaprimaForm(true);
    }

    return (
        <div className="flex items-center pb-3 pl-6 pr-10 justify-between">
            <SearchInput />
            <div className="flex gap-4">
                <ImportCSV />
                <FilterButton />
                <NewButton onClick={handleNewButtonClick} />
            </div>
        </div>
    )
}