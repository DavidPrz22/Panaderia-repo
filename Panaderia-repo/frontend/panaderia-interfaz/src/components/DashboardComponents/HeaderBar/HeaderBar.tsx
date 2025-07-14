import HeaderButton from "./HeaderButton";
import HeaderPlusButton from "./HeaderPlusButton";
import HeaderUserButton from "./HeaderUserButton";
import { HEADER_BAR_HEIGHT } from "@/lib/constants";
import { SIDEBAR_WIDTH } from "@/lib/constants";

export default function HeaderBar() {
    const headerStyles = {
        left: `${SIDEBAR_WIDTH}px`,
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        maxHeight: `${HEADER_BAR_HEIGHT}px`,
    };

    return (
        <div 
            className="fixed flex font-[Roboto] items-center top-0 py-3 shadow-md bg-white z-10"
            style={headerStyles}
        >
            <div className="flex-1 flex items-center justify-center">
                <HeaderPlusButton />
            </div>
            <div className="flex items-center justify-end gap-2 pr-8 min-w-[220px]">
                <HeaderUserButton />
                <HeaderButton icon="/DashboardAssets/Notification.svg" />
                <HeaderButton icon="/DashboardAssets/Config.svg" />
            </div>
        </div>
    )
}