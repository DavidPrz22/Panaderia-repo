import { ImportIcon } from "@/assets/DashboardAssets";

export default function ImportCSV() {
  return (
    <button className="flex items-center gap-2 bg-blue-500 font-semibold font-[Roboto] shadow-md text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer">
      <img src={ImportIcon} alt="Import" />
      Importar CSV
    </button>
  );
}
