import { useProductionContext } from "@/context/ProductionContext";
import { DotMenuIcon, CerrarIcon } from "@/assets/DashboardAssets";
import Button from "@/components/Button";
import Title from "@/components/Title";
import { ProductionRecord } from "./ProductionRecord";
import { useProductionDetailsQuery } from "../hooks/queries/ProductionQueries";
import { PendingTubeSpinner } from "@/components/PendingTubeSpinner";
import { ProductionPagination } from "./ProductionPagination";

export const ProductionRegistrosContainer = () => {

  const { data: productionDetails, isPending } = useProductionDetailsQuery(); 
  const { setIsClosingModal, isClosingModal } = useProductionContext();
  return (
    <div
      className={`w-[80%] h-[85%] max-h-[85%] p-6 bg-white shadow-lg overflow-auto relative rounded-lg ${isClosingModal ? "animate-fadeOut" : "animate-fadeIn"}`}
    >
      <div className="absolute right-3 top-3 ">
        <Button
          type="close"
          onClick={() => {
            setIsClosingModal(true);
          }}
        >
          <img src={CerrarIcon} className="size-4" alt="close" />
        </Button>
      </div>
      

      <div className="font-[Roboto] mb-2">
        <h2 className="text-lg font-semibold">Productiones Registradas</h2>
        <h1 className="text-sm text-gray-500">
          Lista de todas las producciones registradas en el sistema
        </h1>
      </div>

      <ProductionPagination  />
      <div className="w-full p-5 border border-gray-300 rounded-lg mt-4 min-h-[70vh] relative">
        <div className="flex items-center space-x-2 mb-5">
          <img src={DotMenuIcon} alt="menu" className="size-4" />
          <Title>Producciones Registradas</Title>
        </div>
        <div className="flex flex-col gap-4 ">
          {
            isPending ? (
              <PendingTubeSpinner size={40} extraClass="absolute bg-white opacity-50 w-full h-full flex items-center justify-center" />
            ) : (
            productionDetails?.data?.length && productionDetails?.data?.length > 0 ? (
              productionDetails?.data?.map((production) => (
                <ProductionRecord key={production.id} production={production} />
              ))
          ) : (
              <div className="text-center py-8 text-muted-foreground flex items-center justify-center">
                No hay producciones registradas
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
