import type { watchSetvalueTypeProduction } from "../types/types";

export const ProductionCantidad = ({setValue}: watchSetvalueTypeProduction) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === "" || parseFloat(e.target.value) < 0 || isNaN(parseFloat(e.target.value))) {
            if (setValue) setValue("cantidadProduction", 0);
            return;
        }
        const value =  parseFloat(e.target.value)
        if (setValue) setValue("cantidadProduction", value);
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
          [
            "Backspace",
            "Delete",
            "Tab",
            "ArrowLeft",
            "ArrowRight",
            "Home",
            "End",
          ].includes(e.key)
        ) {
          return;
        }
    
        if (!/^\d$/.test(e.key)) {
          e.preventDefault(); // Previene que el char aparezca en el input
        }
      };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.value === "" || parseFloat(e.target.value) < 0 || isNaN(parseFloat(e.target.value))) {
            e.target.classList.add("border-red-500");
        } else {
            e.target.classList.remove("border-red-500");
        }
    }

  return (
    <div className="flex flex-1 flex-col gap-2 w-full">
          <div className="font-semibold font-[Roboto]">Cantidad a Producir</div>
          <div className="flex gap-2">
            <div className="w-full">
              <input
                type="number"
                className="px-2 py-[0.95rem] w-full outline-none border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-[box-shadow] duration-300"
                min={0}
                step={0.1}
                placeholder="Cantidad a producir..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
              />
            </div>
          </div>
        </div>
  );
}   