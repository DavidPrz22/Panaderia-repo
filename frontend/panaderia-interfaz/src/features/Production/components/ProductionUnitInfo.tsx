import { Scale } from "@/assets/GeneralIcons/Index";
import { useProductionContext } from "@/context/ProductionContext";
import type { watchSetvalueTypeProduction } from "../types/types";

export const ProductionUnitInfo = ({ setValue }: watchSetvalueTypeProduction) => {
  const { medidaFisica } = useProductionContext();
  
  const handleTitle = () => {
    if (medidaFisica === "PESO") {
      return "Especifica el peso para mejor control de inventario.";
    }
    if (medidaFisica === "VOLUMEN") {
      return "Especifica el volumen para mejor control de inventario.";
    }
  }

  const handleInputTitle = () => {
    if (medidaFisica === "PESO") {
      return "Peso por unidad (gramos):";
    }
    if (medidaFisica === "VOLUMEN") {
      return "Volumen por unidad (litros):";
    }
  }

  const handleBottomTitle = () => {
    if (medidaFisica === "PESO") {
      return "Peso total de producción del lote";
    }
    if (medidaFisica === "VOLUMEN") {
      return "Volumen total de producción del lote";
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (medidaFisica === "PESO") {
      if (setValue) setValue("peso", parseFloat(e.target.value));
    }
    if (medidaFisica === "VOLUMEN") {
      if (setValue) setValue("volumen", parseFloat(e.target.value));
    }
  }

  return (
    <div className="flex flex-col gap-3 border border-blue-200 bg-blue-50 rounded-md p-5">
        <div className="text-xl font-medium text-blue-800 flex items-center gap-2">
          <Scale className="size-6 text-blue-500" />
          Información Adicional por Unidad
        </div>

        <div className="text-md text-blue-600">
          {handleTitle()}
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-medium text-gray-600">{handleInputTitle()}</span>
          <div className="w-1/3 my-2">
            <input onChange={ (e) => handleChange(e)} type="number" className="rounded-md p-2 bg-white shadow-sm w-full" step={0.01}/>
          </div>
          <span className="text-sm font-medium text-blue-500">{handleBottomTitle()}</span>
        </div>
      </div>
  );
};