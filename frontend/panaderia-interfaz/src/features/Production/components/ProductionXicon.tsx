import { XIcon } from "@/assets/DashboardAssets";

export default function ProductionXicon({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="absolute right-2 top-4.5 flex items-center justify-center p-0.5 rounded-full bg-gray-200 cursor-pointer hover:bg-gray-300 "
    >
      <img className="size-4" src={XIcon} alt="X" />
    </div>
  );
}