import { useAppContext } from "@/context/AppContext";
import MateriaPrimaFormShared from "./MateriaPrimaFormShared";

export default function MateriasPrimasForma() {
    const { showMateriaprimaForm, setShowMateriaprimaForm 
    } = useAppContext();

    if (!showMateriaprimaForm) return <></>;

    return (
        <MateriaPrimaFormShared
            title="Nueva Materia Prima"
            onClose={() => setShowMateriaprimaForm(false)}
            onSubmitSuccess={() => setShowMateriaprimaForm(false)}
        />
    );
}