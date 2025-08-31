import { SearchIconDark } from "@/assets/DashboardAssets";
export const ProductionInputProduct = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-1 flex-col gap-2 w-full">
      <div className="font-semibold font-[Roboto]">{title}</div>
      <div className="flex gap-2 relative">
        <div className="absolute top-3 left-3">
          <img src={SearchIconDark} className="size-5" alt="Buscar" />
        </div>
        <div className="w-full">
          <input
            type="text"
            className="pl-11 pr-2 py-2 w-full outline-none border border-gray-300 rounded-md focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-[box-shadow] duration-300"
            placeholder="Busca un producto..."
          />
        </div>
      </div>
    </div>
  );
};
