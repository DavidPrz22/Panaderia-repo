import type { MateriaPrimaList } from "@/features/MateriaPrima/types/types";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import { createMateriaPrimaListPKQueryOptions } from "@/features/MateriaPrima/hooks/queries/materiaPrimaQueryOptions";
import { useQueryClient } from "@tanstack/react-query";

export const TableRow = ({
  item,
  index,
}: {
  item: MateriaPrimaList;
  index: number;
}) => {
  const queryClient = useQueryClient();
  const {
    setShowMateriaprimaDetalles,
    setMateriaprimaDetalles,
    setMateriaprimaId,
    setLotesForm,
    setIsLoadingDetalles,
  } = useMateriaPrimaContext();

  async function setDetails(pk: number) {
    setIsLoadingDetalles(true);
    const materiaPrimaListPK = await queryClient.fetchQuery(
      createMateriaPrimaListPKQueryOptions(pk),
    );
    setShowMateriaprimaDetalles(true);
    setMateriaprimaDetalles(materiaPrimaListPK || null);
    setMateriaprimaId(pk);
    setLotesForm([]);
    setIsLoadingDetalles(false);
  }

  return (
    <div
      onClick={() => setDetails(item.id)}
      key={item.id}
      className={`cursor-pointer hover:bg-gray-100 grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] justify-between items-center px-8 py-4 border-b border-gray-300 ${index % 2 == 0 ? "bg-white" : "bg-gray-50"} font-[Roboto] text-sm`}
    >
      <div>{item.id}</div>
      <div>{item.name}</div>
      <div>{item.unit}</div>
      <div>{item.category}</div>
      <div>{item.quantity}</div>
      <div>{item.reorderPoint}</div>
      <div>{item.creationDate}</div>
    </div>
  );
};
