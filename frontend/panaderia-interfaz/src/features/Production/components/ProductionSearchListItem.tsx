type props = {
  nombre: string;
  tipo: string;
  stock: number;
  unidad_medida: string;
  onClick: () => void;
};

export default function ProductionSearchListItem({
  nombre,
  tipo,
  stock,
  unidad_medida,
  onClick,
}: props) {
  return (
    <li
      className={`flex justify-between items-center py-2 px-6 border-b border-gray-300 hover:bg-gray-100 cursor-pointer text-sm`}
      onClick={onClick}
    >
      <div className="space-x-3">
        <span>{nombre}</span>
        <span>
          ({stock}
          {unidad_medida})
        </span>
      </div>
      <span className="border border-gray-400 text-gray-500 text-xs p-1 rounded-lg font-[Roboto]">
        {tipo}
      </span>
    </li>
  );
}
