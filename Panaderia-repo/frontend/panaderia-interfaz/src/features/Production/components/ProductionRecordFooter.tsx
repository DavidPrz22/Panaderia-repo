export const ProductionRecordFooter = ({ id }: { id: string }) => {
  return (
    <div className="mt-4 pt-3 border-t border-gray-300">
      <div className="flex justify-between items-center text-xs">
        <span>ID: #{id}</span>
      </div>
    </div>
  );
};
