import { SearchIcon } from "@/assets/DashboardAssets";

export default function SearchIconContainer() {
  return (
    <div className="absolute right-2 top-2.5 flex items-center justify-center p-1 rounded-full bg-gray-500 cursor-pointer ">
      <img className="size-4" src={SearchIcon} alt="Search" />
    </div>
  );
}
