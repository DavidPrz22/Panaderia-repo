export const ProductSearchItem = ({ product }: { product: string }) => {
  return (
    <li className="px-4 py-2 hover:bg-blue-100 border-b border-gray-300">
      {product} 
    </li>
  );
};
