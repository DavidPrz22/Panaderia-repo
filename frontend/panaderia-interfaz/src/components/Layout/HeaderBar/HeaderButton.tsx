type HeaderButtonProps = {
  icon: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export default function HeaderButton({ icon, onClick, ariaLabel }: HeaderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center justify-center cursor-pointer hover:bg-gray-200 rounded-full p-2 transition-colors duration-200 w-10 h-10 bg-transparent border-none outline-none"
    >
      <img src={icon} alt={ariaLabel ?? "Icono de acción"} />
    </button>
  );
}
