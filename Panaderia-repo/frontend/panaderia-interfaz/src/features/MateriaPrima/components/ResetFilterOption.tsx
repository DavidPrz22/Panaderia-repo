import { useMateriaPrimaContext } from "@/context/MateriaPrimaContext";

export default function ResetFilterOption({
  onClick,
  icon,
  title,
}: {
  onClick: () => void;
  icon: string;
  title: string;
}) {
  const { filteredApplied } = useMateriaPrimaContext();

  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-2 p-2 font-semibold font-[Roboto] hover:bg-gray-200 rounded-md ${filteredApplied ? "text-black cursor-pointer" : "text-gray-400 cursor-not-allowed"}`}
    >
      <img src={icon} alt={icon} className="size-6" />
      {title}
    </li>
  );
}
