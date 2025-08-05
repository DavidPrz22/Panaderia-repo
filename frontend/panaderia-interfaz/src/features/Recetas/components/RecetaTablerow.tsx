import { useRecetasContext } from "@/context/RecetasContext";

export const RecetaTablerow = ({
  item,
  index,
}: {
  item: any;
  index: number;
}) => {

  const { setShowRecetasDetalles, setRecetaId } = useRecetasContext();
  const setDetails = () => {
    setShowRecetasDetalles(true);
    setRecetaId(item.id || null);
  }
  return (
    <div
      onClick={setDetails}
      key={item.id}
      className={`cursor-pointer hover:bg-gray-100 grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] justify-between items-center px-8 py-4 border-b border-gray-300 ${index % 2 == 0 ? "bg-white" : "bg-gray-50"} font-[Roboto] text-sm`}
    >
      <div>{item.id || "-"}</div>
      <div>{item.name || "-"}</div>
      <div>{item.unit || "-"}</div>
      <div>{item.category || "-"}</div>
      <div>{item.quantity || "-"}</div>
      <div>{item.reorderPoint || "-"}</div>
      <div>{item.creationDate || "-"}</div>
      <div>{item.description || "-"}</div>
    </div>
  );
};
