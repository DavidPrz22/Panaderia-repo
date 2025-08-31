import { ProductionRadioInput } from "./ProductionRadioInput"
export const ProductionTypeContainer = ( ) => {
    return (
        <>
                <div className="text-lg font-semibold">
                    Tipo de Producto
                </div>
                <div className="flex items-center gap-4">
                    <ProductionRadioInput 
                        name="producto-final" 
                        id="producto-final" 
                        label="Producto Final" />
                    <ProductionRadioInput 
                        name="producto-intermedio" 
                        id="producto-intermedio" 
                        label="Producto Intermedio" />
                </div>
        </>
    )
}