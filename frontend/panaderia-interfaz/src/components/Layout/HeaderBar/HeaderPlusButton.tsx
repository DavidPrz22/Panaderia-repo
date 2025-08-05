import Agregar from "@/assets/DashboardAssets/Agregar.svg";

export default function HeaderPlusButton() {
  return (
    <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-200 rounded-full p-2 transition-colors duration-200">
      <div className="text-md font-semibold">Agregar item</div>
      <div className="flex items-center cursor-pointer">
        <img src={Agregar} alt="Agregar" />
      </div>
    </div>
  );
}
