export const ProductionRecordFooter = ({ id, costo_total_componentes_usd }: { id: string, costo_total_componentes_usd: string }) => {
  return (
    <div className="mt-4 pt-3 border-t border-gray-300">
      <div className="flex justify-between items-center text-xs">
        <span>ID: #{id}</span>

        <span className="font-medium text-md">Costo Total Componentes: ${Number(costo_total_componentes_usd).toFixed(2)}</span>
      </div>
    </div>
  );
};
