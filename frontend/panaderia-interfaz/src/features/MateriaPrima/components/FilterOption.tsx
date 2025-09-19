export default function FilterOption({
  mouseEnter,
  icon,
  title,
}: {
  mouseEnter: () => void;
  icon: string;
  title: string;
}) {
  return (
    <li
      onMouseEnter={mouseEnter}
      className="flex items-center gap-2 p-2 font-semibold font-[Roboto] hover:bg-gray-200 cursor-pointer rounded-md"
    >
      <img src={icon} alt={icon} className="size-6" />
      {title}
    </li>
  );
}
