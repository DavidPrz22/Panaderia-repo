import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";

import FilterButton from "./FilterButton";
import { ImportCSV } from "../../../components/ImportCSV";
import NewButton from "../../../components/NewButton";
import SearchInput from "./SearchInput";

import { useAuth } from "@/context/AuthContext";
import { userHasPermission } from "@/features/Authentication/lib/utils";

export default function FilterSearch() {
  const { setShowMateriaprimaForm } = useMateriaPrimaContext();

  const { user } = useAuth();

  const handleNewButtonClick = () => {
    setShowMateriaprimaForm(true);
  };

  const hasPermission = userHasPermission(user!, 'materias_primas', 'add')

  return (
    <div className="flex items-center px-8 justify-between">
      <SearchInput />
      <div className="flex gap-4">
        {hasPermission && <ImportCSV descripcion="Selecciona un archivo CSV para importar los datos de las materias primas" />}
        <FilterButton />
        {hasPermission && (
        <NewButton onClick={handleNewButtonClick} />
        )}
      </div>
    </div>
  );
}
