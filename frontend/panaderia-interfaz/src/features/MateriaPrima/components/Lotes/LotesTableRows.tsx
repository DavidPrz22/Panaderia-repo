import type { LoteMateriaPrima } from "@/features/MateriaPrima/types/types";

export const LotesTableRows = ({
  data,
  onClick,
}: {
  data: LoteMateriaPrima[];
  onClick: (id: number) => void;
}) => {
  if (data.length === 0) return <></>;

  if (data.length > 1) {
    data.sort((a, b) => {
      const dateA = new Date(a.fecha_caducidad);
      const dateB = new Date(b.fecha_caducidad);
      return dateA.getTime() - dateB.getTime();
    });
  }

  return (
    <>
      {data.map((item) => (
        <div
          onClick={() => onClick(item.id)}
          key={item.id}
          className={`cursor-pointer grid grid-cols-7 justify-between items-center px-8 py-4 border-b border-gray-300 bg-white font-[Roboto] text-sm`}
        >
          <div>{item.fecha_recepcion}</div>
          <div>{item.fecha_caducidad}</div>
          <div>{item.cantidad_recibida}</div>
          <div>{item.stock_actual_lote}</div>
          <div>{item.costo_unitario_usd}</div>
          <div>{item.proveedor}</div>
          <div className="font-medium">{item.estado}</div>
        </div>
      ))}
    </>
  );
};
