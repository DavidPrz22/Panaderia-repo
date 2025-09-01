export const ProductSearchItem = ({ product, id, onClick }: { product: string, id: number, onClick: (value: string) => void }) => {
  return (
    <li className="px-4 py-2 hover:bg-blue-100 border-b border-gray-300" id={id.toString()} onClick={() => onClick(product)}>
      {product} 
    </li>
  );
};
