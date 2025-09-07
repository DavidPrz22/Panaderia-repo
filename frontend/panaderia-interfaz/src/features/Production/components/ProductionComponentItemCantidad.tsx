import { useRef } from "react"
import type { watchSetvalueTypeProduction } from "../types/types";
import '@/styles/validationStyles.css'

type itemProps = {
    id: number;
    stock: number;
    unidad: string;
    cantidad: number;
}

export const ProductionComponentItemCantidad = (
    { id, stock, unidad, cantidad, setValue, watch }: itemProps & watchSetvalueTypeProduction
) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const prevValueRef = useRef<number>(cantidad);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
        if (watch === undefined || setValue === undefined) return;

        const value = parseFloat(e.target.value);
        if (e.target.value === "" || value <= 0 || isNaN(value)) {
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        console.log(watch('componentes'));

        const componentIndex = watch('componentes')?.findIndex((c) => c.id === id);
        if (componentIndex === -1) return;

        // Reset previous value
        const cantidadActual = watch(`componentes.${componentIndex}.cantidad`);
        if (cantidadActual === 0) {
            let valuesTotal = 0;
            
            const allInputValues = document.querySelectorAll(`#componente-cantidad-${id}`);
            allInputValues.forEach((input) => {
                valuesTotal += parseFloat((input as HTMLInputElement).value) || 0;
            });
            if (valuesTotal > stock) {
                setValue(`componentes.${componentIndex}.cantidad`, 0, { shouldValidate: true });
                prevValueRef.current = 0;
                return;
            }
            allInputValues.forEach(input => {
                input.classList.remove("invalidInput")
                input.classList.add("validInput")
            });
            setValue(`componentes.${componentIndex}.cantidad`, valuesTotal, { shouldValidate: true });
            prevValueRef.current = value;
            return;

        }

        const cantidadRestante = cantidadActual - prevValueRef.current;
        setValue(`componentes.${componentIndex}.cantidad`, cantidadRestante, { shouldValidate: true });

        const nuevaCantidad = cantidadRestante + value;

        if (nuevaCantidad > stock || nuevaCantidad < 0) {
            setValue(`componentes.${componentIndex}.cantidad`, 0, { shouldValidate: true });
            const allInputValues = document.querySelectorAll(`#componente-cantidad-${id}`)
            allInputValues.forEach(input => {
                input.classList.remove("validInput")
                input.classList.add("invalidInput")
            });
        } else {
            setValue(`componentes.${componentIndex}.cantidad`, nuevaCantidad, { shouldValidate: true });
        }
        prevValueRef.current = value;
        console.log(watch(`componentes.${componentIndex}`));

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
            document.querySelectorAll(`#componente-cantidad-${id}`).forEach(input => {
                input.classList.remove("validInput");
                input.classList.add("invalidInput");
            });
        }
    }



    return (
        <div className="flex items-center gap-4 min-w-[250px]">
        <span className="text-lg font-semibold">Cantidad:</span>
        <div className="rounded-md shadow-sm">
          <input
            type="number"
            id = {`componente-cantidad-${id}`}
            min={1}
            max={stock}
            defaultValue={cantidad > 0 ? cantidad : ""}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onChange={handleChange}
            step={0.1}
            ref={inputRef}
            className={`w-20 rounded-md px-2 py-2 outline-none focus:ring-4 transition-[box-shadow] duration-300
                ${ cantidad > stock ? "invalidInput" : "validInput"}
            `}
          />
          {/* ${noStock ? "border border-red-500 focus:border-red-500 focus:ring-red-100" : "border border-gray-300 focus:ring-blue-100 focus:border-blue-300"} */}
        </div>
        <span className=" bg-gray-200 text-sm px-2 py-0.5 rounded-sm font-semibold">
          {unidad}
        </span>
      </div>
    )
}