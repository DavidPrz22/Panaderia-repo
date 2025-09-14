import type { watchSetvalueTypeProduction } from "../types/types";
import { useProductionContext } from "@/context/ProductionContext";
import "@/styles/validationStyles.css";

export const ProductionCantidad = ({
  setValue,
  watch,
}: watchSetvalueTypeProduction) => {

  const { productUnitRef } = useProductionContext();
  const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(",", ".");
    const parsed = parseFloat(raw);
    if (raw === "" || parsed < 0 || isNaN(parsed)) {
      if (setValue) setValue("cantidadProduction", 0);
      return;
    }
    const value = roundTo3(parsed);
    if (setValue)
      setValue("cantidadProduction", value, {
        shouldValidate: true,
        shouldDirty: true,
      });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const controls = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];
    if (controls.includes(e.key)) return;

    // Allow one decimal separator
    if (e.key === "." || e.key === ",") {
      const v = (e.currentTarget as HTMLInputElement).value;
      if (v.includes(".") || v.includes(",")) e.preventDefault();
      return;
    }
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.target.value === "" ||
      parseFloat(e.target.value) <= 0 ||
      isNaN(parseFloat(e.target.value))
    ) {
      e.target.value = "0";
      if (e.target.classList.contains("validInput")) {
        e.target.classList.remove("validInput");
        e.target.classList.add("invalidInput");
      }
    } else {
      e.target.classList.remove("invalidInput");
      e.target.classList.add("validInput");
    }
  };

  console.log("productUnitRef", productUnitRef.current?.textContent === '');
  return (
    <div className="flex flex-1 flex-col gap-2 w-full">
      <div className="font-semibold font-[Roboto]">Cantidad a Producir</div>
      <div className="flex gap-2">
        <div className="w-full relative">
          <input
            id="cantidadProduction"
            type="number"
            className="px-2 py-[0.95rem] w-full outline-none border border-gray-300 rounded-md focus:ring-4 transition-[box-shadow] duration-300 validInput"
            min={0}
            step={0.01}
            placeholder="Cantidad a producir..."
            defaultValue={watch?.("cantidadProduction") ?? 0}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
          />
          <div
            className="absolute top-1/2 right-9 -translate-y-1/2 text-sm font-medium font-[Roboto] pointer-events-none"
          >
            <div
              ref={productUnitRef}
              className={`flex items-center justify-center bg-gray-200 rounded-md ${
                productUnitRef.current?.textContent === "" ? "" : "size-7"
              }`}
            >
              {productUnitRef.current?.textContent}          
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
