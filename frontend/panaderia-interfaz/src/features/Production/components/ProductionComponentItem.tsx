export const ProductionComponentItem = ({
  titulo,
  stock,
  unidad,
  cantidad,
}: {
  titulo: string;
  stock: number;
  unidad: string;
  cantidad: number;
}) => {
  return (
    <div className="flex lg:flex-row flex-col lg:items-center justify-between px-10 py-3 border border-gray-200 rounded-lg gap-2">
      <div>
        <h2 className="flex gap-2 text-lg font-semibold mb-2">
          {titulo}
          <span className=" bg-gray-200 text-sm px-2 py-0.5 rounded-sm font-semibold">
            {unidad}
          </span>
        </h2>
        <p className="text-gray-600">
          Stock disponible: {stock} {unidad}
        </p>
      </div>

      <div className="flex items-center gap-4 min-w-[250px]">
        <span className="text-lg font-semibold">Cantidad:</span>
        <div className="rounded-md shadow-sm">
          <input
            type="number"
            min={1}
            max={stock}
            defaultValue={cantidad > 0 ? cantidad : ''}
            className="w-20 border border-gray-300 rounded-md px-2 py-2 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-[box-shadow] duration-300"
          />
        </div>
        <span className=" bg-gray-200 text-sm px-2 py-0.5 rounded-sm font-semibold">
          {unidad}
        </span>
      </div>
    </div>
  );
};
