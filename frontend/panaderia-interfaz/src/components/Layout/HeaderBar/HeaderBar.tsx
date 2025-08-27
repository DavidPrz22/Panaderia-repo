import HeaderButton from "./HeaderButton";
import HeaderPlusButton from "./HeaderPlusButton";
import HeaderUserButton from "./HeaderUserButton";
import { NotificationIcon, ConfigIcon } from "@/assets/DashboardAssets";

export default function HeaderBar() {
  return (
    <div className="fixed flex font-[Roboto] items-center top-0 py-3 shadow-md bg-white z-[149] left-(--sidebar-width) w-[calc(100%-var(--sidebar-width))] max-h-(--header-height)">
      <div className="flex-1 flex items-center justify-center">
        <HeaderPlusButton />
      </div>
      <div className="flex items-center justify-end gap-2 pr-8 min-w-[220px]">
        <HeaderUserButton />
        <HeaderButton icon={NotificationIcon} />
        <HeaderButton icon={ConfigIcon} />
      </div>
    </div>
  );
}
