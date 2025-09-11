import { ProductSearchItem } from "./ProductSearchItem";
import { useProductionContext } from "@/context/ProductionContext";
import { useEffect } from "react";

type searchContainerProp = {
  data: { id: number; nombre_producto: string }[];
  onSelection: (id: number) => void;
};

type producto = { id: number; nombre_producto: string };

export const ProductSearchContainer = ({
  data,
  onSelection,
}: searchContainerProp) => {
  const {
    searchQuery,
    productSearchRef,
    setProductoId,
    showSearch,
    setShowSearch,
  } = useProductionContext();
  useEffect(() => {
    const timer = setTimeout(() => setShowSearch(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = searchQuery
    ? data.filter((item) =>
        item.nombre_producto.toLowerCase().includes(searchQuery!.toLowerCase()),
      )
    : data;

  const handleClick = (producto: producto) => {
    if (productSearchRef.current) {
      productSearchRef.current.value = producto.nombre_producto;
      onSelection(producto.id);
      setProductoId(producto.id);
    }
  };

  return (
    <div
      className={`absolute top-[107%] left-0 max-h-[400px] cursor-pointer w-full overflow-auto bg-white border border-gray-300 border-b-0 rounded-md shadow-md z-10 transition-[opacity, transform] origin-top duration-200 ${showSearch ? "opacity-100 scale-100" : "opacity-0 scale-80"}`}
    >
      {filteredData.length > 0 ? (
        filteredData.map((producto) => (
          <ProductSearchItem
            key={producto.id}
            product={producto.nombre_producto}
            id={producto.id}
            onClick={() => handleClick(producto)}
          />
        ))
      ) : (
        <div className="p-4 text-gray-800">Ningun Resultado</div>
      )}
    </div>
  );
};
