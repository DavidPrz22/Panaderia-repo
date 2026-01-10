import type { MateriaPrimaList } from "@/features/MateriaPrima/types/types";
import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";
import { createMateriaPrimaListPKQueryOptions } from "@/features/MateriaPrima/hooks/queries/materiaPrimaQueryOptions";
import { useQueryClient } from "@tanstack/react-query";

export const TableRow = ({
  item,
  index,
  last
}: {
  item: MateriaPrimaList;
  index: number;
  last: boolean;
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
      className={`cursor-pointer hover:bg-gray-100 grid grid-cols-[0.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr] justify-between items-center px-8 py-4 ${last ? "rounded-b-md":"border-b"} border-gray-300 ${index % 2 == 0 ? "bg-white" : "bg-gray-50"} font-[Roboto] text-sm`}
    >
      <div>{item.id}</div>
      <div>{item.SKU}</div>
      <div>{item.nombre}</div>
      <div>{item.unidad_medida_base_detail.nombre_completo}</div>
      <div>{item.stock_actual}</div>
      <div>{item.punto_reorden}</div>
      <div>{item.fecha_creacion_registro}</div>
    </div>
  );
};
