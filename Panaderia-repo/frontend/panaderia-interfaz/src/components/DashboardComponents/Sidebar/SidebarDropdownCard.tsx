import { useState } from "react";
import SidebarCard from "./SidebarCard";

export default function SidebarDropdownCard({
  children,
  icon,
  onclick,
  elements,
}: {
  children: React.ReactNode;
  icon: string;
  onclick: (e: React.MouseEvent<HTMLDivElement>) => void;
  elements: { url: string; title: string; link?: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen((prev) => !prev);
    onclick(e);
  };

  return (
    <>
      <div
        className="flex items-center justify-between gap-2.5 p-2 hover:bg-white/20 transition-colors duration-200 ease-in-out rounded-md cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2.5">
          <img src={icon} alt={icon} />
          <div className="font-[Roboto] text-md text-white">{children}</div>
        </div>
        <img
          className={`transition-transform duration-200 ease-in-out ${
            isOpen ? "rotate-90" : ""
          }`}
          src="/DashboardAssets/RightArrow.svg"
          alt="RightArrow"
        />
      </div>
      <div
        className={`overflow-hidden transition-[max-height, opacity] duration-300 ease-in-out ${
          isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 pl-4.5">
          {elements.map((el, index) => {
            return (
              <SidebarCard
                key={index}
                icon={el.url}
                onclick={() => handleClick}
                link={el.link}
              >
                {el.title}
              </SidebarCard>
            );
          })}
        </div>
      </div>
    </>
  );
}
