import { useState } from "react";
import SidebarCard from "./SidebarCard";
import { useAppContext } from "@/context/AppContext";
import { RightArrowIcon } from "@/assets/DashboardAssets";

export default function SidebarDropdownCard({
  children,
  icon,
  onclick,
  elements,
  id,
}: {
  children: React.ReactNode;
  icon: string;
  onclick: (e: React.MouseEvent<HTMLDivElement>) => void;
  elements: { url: string; title: string; id: string; link?: string }[];
  id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    setSelectedModule,
    setIsOpenDropdownCard,
    isOpenDropdownCard,
    refDropdownCard,
  } = useAppContext();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isOpenDropdownCard) {
      setIsOpenDropdownCard(false);
      setIsOpen(false);
    } else {
      setIsOpen((prev) => !prev);
    }
    setSelectedModule(e.currentTarget.id);
    onclick(e);
  };

  return (
    <div className="flex flex-col gap-1.5" id={id} data-id="DropdownContainer">
      <div
        className="flex items-center justify-between gap-2.5 p-2 hover:bg-white/20 transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <img src={icon} alt={icon} />
          <div className="font-[Roboto] text-md text-white">{children}</div>
        </div>
        <img
          className={`transition-transform duration-200 ease-in-out ${isOpen || (isOpenDropdownCard && refDropdownCard.current?.id === id) ? "rotate-90" : ""}`}
          src={RightArrowIcon}
          alt="RightArrow"
        />
      </div>
      <div
        className={`overflow-hidden transition-[max-height, opacity] duration-300 ease-in-out ${isOpen || (isOpenDropdownCard && refDropdownCard.current?.id === id) ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col gap-2 pl-4.5">
          {elements.map((el, index) => {
            return (
              <SidebarCard
                key={index}
                icon={el.url}
                onclick={handleClick}
                id={el.id}
                link={el.link}
                dropdown={true}
              >
                {el.title}
              </SidebarCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
