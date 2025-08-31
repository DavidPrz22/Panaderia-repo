import { ProductionComponentItem } from "./ProductionComponentItem";
import { ProductionComponentTitle } from "./ProductionCompenentTitle";
export const ProductionComponents = () => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white mt-6 shadow-md">
        <ProductionComponentTitle/>

        <div className="flex flex-col gap-2 mt-4">
            <ProductionComponentItem title="Pan" stock={100} unit="kg" />
            <ProductionComponentItem title="Bollo" stock={50} unit="g" />
            <ProductionComponentItem title="Tarta" stock={20} unit="g" />
        </div>
    </div>
  );
};
