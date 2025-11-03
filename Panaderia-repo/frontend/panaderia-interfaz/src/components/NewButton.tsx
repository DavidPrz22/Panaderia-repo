import { PlussignIcon } from "@/assets/DashboardAssets";

export default function NewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="flex items-center shadow-md gap-2 bg-blue-500 font-semibold font-[Roboto] text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer"
      onClick={onClick}
    >
      <img src={PlussignIcon} alt="Nuevo" />
      Nuevo
    </button>
  );
}
