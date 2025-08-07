import { XRedIcon } from "@/assets/DashboardAssets/";
import { useRecetasContext } from "@/context/RecetasContext";
import type {
  recetasComponentListProps,
  watchSetValueProps,
} from "../types/types";

export default function RecetasComponentList({
  nombre,
  type,
  id,
  last,
  watch,
  setValue,
}: recetasComponentListProps & watchSetValueProps) {
  const { setComponentesListadosReceta, componentesListadosReceta } =
    useRecetasContext();

  const handleDelete = () => {
    if (componentesListadosReceta.length < 1) return;

    const listaFiltrada = componentesListadosReceta.filter(
      (componente) => componente.id_componente !== id,
    );
    setComponentesListadosReceta(listaFiltrada);

    const listaFiltradaValidacion = watch("componente_receta")?.filter(
      ({ componente_id }: { componente_id: number }) =>
        componente_id !== Number(id),
    );
    setValue("componente_receta", listaFiltradaValidacion || []);
  };

  return (
    <div
      className={`flex items-center justify-between text-md p-3 ${last ? "" : "border-b border-gray-300"}`}
    >
      {type === "MateriaPrima" ? "Materia Prima" : "Producto Intermedio"} :{" "}
      {nombre}
      <div onClick={handleDelete} className="cursor-pointer">
        <img src={XRedIcon} alt="delete" className="size-6" />
      </div>
    </div>
  );
}
