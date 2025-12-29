import { useState, useEffect } from "react";
import HeaderButton from "./HeaderButton";
import HeaderPlusButton from "./HeaderPlusButton";
import HeaderUserButton from "./HeaderUserButton";
import { ConfigIcon } from "@/assets/DashboardAssets";

export default function HeaderBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed flex font-[Roboto] items-center justify-between top-0 py-3 px-8 bg-white z-(--z-index-header-bar) left-[var(--sidebar-width)] w-[calc(100%-var(--sidebar-width))] max-h-[var(--header-height)] transition-shadow duration-200 ${
        isScrolled ? "shadow-sm" : "border-b border-gray-200"
      }`}
    >
      {/* <div className="flex items-center justify-center">
        <HeaderPlusButton />
      </div>
    
      <div className="flex items-center justify-end gap-2 pr-8 min-w-[220px]">
        <HeaderUserButton />
        <HeaderButton icon={ConfigIcon} />
      </div>
      */}
      <div className="flex flex-1 items-center justify-end gap-2 pr-8">
        <HeaderUserButton />
        <HeaderButton icon={ConfigIcon} />
      </div>
    </div>
  );
}
