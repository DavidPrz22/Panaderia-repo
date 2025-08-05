import { useRecetasContext } from "@/context/RecetasContext";
import type { recetaItem } from "../types/types";
import { useRecetaDetallesMutation } from "../hooks/mutations/recetasMutations";

export const RecetaTablerow = ({
  item,
  index,
}: {
  item: recetaItem;
  index: number;
}) => {

  const { setShowRecetasDetalles, setRecetaId } = useRecetasContext();
  const { mutate: getRecetaDetalles } = useRecetaDetallesMutation();
  const setDetails = () => {
    setShowRecetasDetalles(true);
    setRecetaId(item.id);
    getRecetaDetalles(item.id);
  }
  return (
    <div
      onClick={setDetails}
      key={item.id}
      className={`cursor-pointer hover:bg-gray-100 grid grid-cols-[1fr_1fr_1fr] justify-between items-center px-8 py-4 border-b border-gray-300 ${index % 2 == 0 ? "bg-white" : "bg-gray-50"} font-[Roboto] text-sm`}
    >
      <div>{item.id || "-"}</div>
      <div>{item.nombre || "-"}</div>
      <div>{item.fecha_creacion.split('T')[0] || "-"}</div>
    </div>
  );
};
