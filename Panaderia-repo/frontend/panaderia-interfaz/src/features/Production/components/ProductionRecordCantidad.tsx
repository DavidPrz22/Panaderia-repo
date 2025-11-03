export const ProductionRecordCantidad = ({
  cantidad_producida,
  unidad_medida,
}: {
  cantidad_producida: number;
  unidad_medida: string;
}) => {
  return (
    <div className="rounded-lg p-4 mb-4 bg-blue-100">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Cantidad Producida</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold">{cantidad_producida}</span>
          <span className="text-sm text-gray-600">{unidad_medida}</span>
        </div>
      </div>
    </div>
  );
};
