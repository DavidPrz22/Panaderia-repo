import { useProductionContext } from "@/context/ProductionContext";
import '@/styles/validationStyles.css';

export const ProductionNewComponentDetails = () => {
  const { newComponentSelected, invalidCantidadError, setInvalidCantidadError } = useProductionContext();


  if (!newComponentSelected) return null;

  const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const parsed = parseFloat(raw.replace(",", "."));
    if (raw === "" || isNaN(parsed) || parsed <= 0) {
      setInvalidCantidadError(true);
      return;
    }

    const value = roundTo3(parsed);

    if (value > newComponentSelected.stock) {
      setInvalidCantidadError(true); 
      return;
    }
    else setInvalidCantidadError(false);
    newComponentSelected.cantidad = value;
  };

  return (
    <>
      <div className="p-3 bg-gray-100 rounded-md">
        <div className="border border-gray-400 text-gray-500 p-1 rounded-2xl w-fit text-xs font-semibold">
          {newComponentSelected.tipo}
        </div>
        <div className="mt-2">
          <div className="font-medium text-md">
            {newComponentSelected.nombre}
          </div>
          <div className="text-gray-600 text-sm">
            stock disponible: {newComponentSelected.stock}{" "}
            {newComponentSelected.unidad_medida}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div>Cantidad a usar ({newComponentSelected.unidad_medida}):</div>
        <input
          type="number"
          step={0.01}
          className={`border ${invalidCantidadError ? "invalidInput" : "validInput"} p-2 rounded-md w-full outline-none transition-[box-shadow] duration-250`}
          onChange={handleChange}
          disabled={newComponentSelected.invalid ? true : false}
        />

        {newComponentSelected.invalid && (
          <div className="text-red-500 text-sm mt-1">
            Este Componente ya se encuentra registrado en la receta
          </div>
        )}
  
        {invalidCantidadError && (
          <div className="text-red-500 text-sm mt-1">
            Cantidad debe ser mayor a 0 y no exceder{" "}
            {newComponentSelected.stock} {newComponentSelected.unidad_medida}
          </div>
        )}
      </div>
    </>
  );
};
