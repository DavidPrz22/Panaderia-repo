import { useProductosIntermediosContext } from "@/context/ProductosIntermediosContext";

export const PITableRow = ({
  item,
  index,
}: {
  item: any;
  index: number;
}) => {

  const { setShowProductosIntermediosDetalles, setProductoIntermedioId } = useProductosIntermediosContext();
  const setDetails = () => {
    setShowProductosIntermediosDetalles(true);
    setProductoIntermedioId(item.id || null);
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
