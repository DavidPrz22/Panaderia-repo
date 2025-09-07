import { useRef } from "react"
import type { watchSetvalueTypeProduction, ComponentesLista } from "../types/types";
import '@/styles/validationStyles.css'
import { useProductionContext } from "@/context/ProductionContext";

type itemProps = {
    id: number;
    stock: number;
    unidad: string;
    cantidad: number;
    nombre: string;
}

export const ProductionComponentItemCantidad = (
    { id, stock, unidad, cantidad, nombre, setValue, watch }: itemProps & watchSetvalueTypeProduction
) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const prevValueRef = useRef<number>(cantidad);
    const { insufficientStock, setInsufficientStock } = useProductionContext();

    // Helpers
    const getAllInputsForComponent = () =>
        document.querySelectorAll<HTMLInputElement>(`#componente-cantidad-${id}`);

    const toggleInputsValidityClass = (isValid: boolean) => {
        getAllInputsForComponent().forEach((input) => {
            input.classList.toggle("validInput", isValid);
            input.classList.toggle("invalidInput", !isValid);
        });
    };

    const sumAllInputsForComponent = () => {
        let total = 0;
        getAllInputsForComponent().forEach((input) => {
            const v = parseFloat(input.value);
            total += isNaN(v) ? 0 : v;
        });
        return total;
    };

    const updateFormCantidad = (componentIndex: number, value: number) => {
        setValue?.(`componentes.${componentIndex}.cantidad`, value, { shouldValidate: true });
    };

    type Componente = ComponentesLista[number];

    const addToInsufficient = (componentIndex: number) => {
        if (!setInsufficientStock || !watch) return;
        const currentCantidad = watch(`componentes.${componentIndex}.cantidad`) as number | undefined;
        const current: Componente = {
            id,
            nombre,
            unidad_medida: unidad,
            stock,
            cantidad: typeof currentCantidad === 'number' ? currentCantidad : 0,
        };
        const list = insufficientStock ?? [];
        if (list.some((c) => c.id === current.id)) return;
        setInsufficientStock([...list, current]);
    };

    const removeFromInsufficient = (componentId: number) => {
        if (!setInsufficientStock) return;
        const list = insufficientStock ?? [];
        if (list.length === 0) return;
        const next = list.filter((c) => c.id !== componentId);
        setInsufficientStock(next);
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
        if (!watch || !setValue) return;

        const value = parseFloat(e.target.value);
        if (e.target.value === "" || value <= 0 || isNaN(value)) {
            if (inputRef.current) inputRef.current.value = "";
            return;
        }

        const componentIndex = watch('componentes')?.findIndex((c) => c.id === id) ?? -1;
        if (componentIndex === -1) return;

        // Total actual almacenado en el formulario para este componente
        const cantidadActual = watch(`componentes.${componentIndex}.cantidad`) as number;

        // Si el total es 0, recalcular sumando todos los inputs duplicados (receta base + subrecetas)
        if (cantidadActual === 0) {
            const valuesTotal = sumAllInputsForComponent();
            if (valuesTotal > stock) {
                updateFormCantidad(componentIndex, 0);
                toggleInputsValidityClass(false);
                addToInsufficient(componentIndex);
                prevValueRef.current = 0;
                return;
            }
            toggleInputsValidityClass(true);
            updateFormCantidad(componentIndex, valuesTotal);
            removeFromInsufficient(id);
            prevValueRef.current = value;
            return;
        }

        // Recalcular nuevo total restando el valor previo de este input y sumando el nuevo
        const cantidadRestante = cantidadActual - prevValueRef.current;
        const nuevaCantidad = cantidadRestante + value;

        if (nuevaCantidad > stock || nuevaCantidad < 0) {
            updateFormCantidad(componentIndex, 0);
            toggleInputsValidityClass(false);
            addToInsufficient(componentIndex);
        } else {
            updateFormCantidad(componentIndex, nuevaCantidad);
            toggleInputsValidityClass(true);
            removeFromInsufficient(id);
        }

        prevValueRef.current = value;
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
        const v = parseFloat(e.target.value);
        if (e.target.value === "" || v < 0 || isNaN(v)) {
            toggleInputsValidityClass(false);
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