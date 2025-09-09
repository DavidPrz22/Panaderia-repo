import { useEffect, useRef, useState } from "react"
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
    const [inputValue, setInputValue] = useState<number>(cantidad > 0 ? cantidad : 0);
    const { insufficientStock, setInsufficientStock } = useProductionContext();
    const roundTo3 = (n: number) => Math.round(n * 1000) / 1000;

    // Cuando cambie la cantidad proveniente del producto (re-cálculo), sincronizar el input
    useEffect(() => {
        const next = cantidad > 0 ? cantidad : 0;
        setInputValue(next);
    }, [cantidad]);

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

        const raw = e.target.value.replace(",", ".");
        const parsed = parseFloat(raw);
        const value = roundTo3(parsed);
        // Cero o vacío: inválido, reflejar 0 y marcar inválido y poner form en 0
        if (raw === "" || isNaN(parsed) || parsed <= 0) {
            setInputValue(0);
            const componentIndex = watch('componentes')?.findIndex((c) => c.id === id) ?? -1;
            if (componentIndex !== -1) {
                updateFormCantidad(componentIndex, 0);
            }
            toggleInputsValidityClass(false);
            // No es un caso de insuficiencia de stock; asegurarse que no esté listado
            removeFromInsufficient(id);
            return;
        }

        // Asignar inmediatamente el valor al input local
        setInputValue(value);

        const componentIndex = watch('componentes')?.findIndex((c) => c.id === id) ?? -1;
        if (componentIndex === -1) return;

        // Recalcular sumando todos los inputs duplicados (receta base + subrecetas)
        const nuevaCantidad = roundTo3(sumAllInputsForComponent());

        if (nuevaCantidad > stock || nuevaCantidad < 0) {
            updateFormCantidad(componentIndex, 0);
            toggleInputsValidityClass(false);
            addToInsufficient(componentIndex);
        } else {
            updateFormCantidad(componentIndex, nuevaCantidad);
            toggleInputsValidityClass(true);
            removeFromInsufficient(id);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
                const controls = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"];
                if (controls.includes(e.key)) return;
                // Allow one decimal separator
                if (e.key === "." || e.key === ",") {
                    const v = (e.currentTarget as HTMLInputElement).value;
                    if (v.includes(".") || v.includes(",")) e.preventDefault();
                    return;
                }
                if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
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
            value={inputValue}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onChange={handleChange}
            step={0.001}
            ref={inputRef}
            className={`w-20 rounded-md px-2 py-2 outline-none focus:ring-4 transition-[box-shadow] duration-300
                ${ inputValue > stock || inputValue <= 0 ? "invalidInput" : "validInput"}
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