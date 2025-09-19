import MateriaPrimaFormShared from "./MateriaPrimaFormShared";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";

export default function MateriasPrimasForma() {
  const { showMateriaprimaForm, setShowMateriaprimaForm } =
    useMateriaPrimaContext();

  const handleSuccessClose = () => {
    setShowMateriaprimaForm(false);
  };

  if (!showMateriaprimaForm) return <></>;

  return (
    <MateriaPrimaFormShared
      title="Nueva Materia Prima"
      onClose={handleSuccessClose}
      onSubmitSuccess={handleSuccessClose}
    />
  );
}
