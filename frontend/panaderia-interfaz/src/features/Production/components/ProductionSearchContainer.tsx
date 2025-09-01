import { ProductSearchItem } from "./ProductSearchItem"
import { useProductionContext } from "@/context/ProductionContext";
type searchContainerProp = {
    data: { id: number; nombre_producto: string }[];
    onSelection: () => void;
};

export const ProductSearchContainer = ({data, onSelection}: searchContainerProp) => {
    const { searchQuery, productSearchRef} = useProductionContext();

    const filteredData = searchQuery? data.filter(item => 
        item.nombre_producto.toLowerCase().includes(searchQuery!.toLowerCase())
    ) : data;

    const handleClick = (valueInput: string) => {
        if (productSearchRef.current) {
            productSearchRef.current.value = valueInput;
            onSelection();
        };
    }

    return (
        <div className="absolute top-[107%] left-0 max-h-[400px] cursor-pointer w-full overflow-auto bg-white border border-gray-300 border-b-0 rounded-md shadow-md z-10">
                {
                filteredData.length > 0 ? (
                    filteredData.map((product, index) => (
                        <ProductSearchItem key={index} product={product.nombre_producto} id={product.id} onClick={() => handleClick(product.nombre_producto)} />
                    ))
                ) : (
                    <div className="p-4 text-gray-800">Ningun Resultado</div>
                )}
        </div>    
    )
}