import { TubeSpinner } from "@/assets";

export const PendingTubeSpinner = ({
  size,
  extraClass,
}: {
  size: number;
  extraClass?: string;
}) => {
  return (
    <div
      className={`flex justify-center items-center text-gray-700 ${extraClass}`}
    >
      <img src={TubeSpinner} alt="Cargando..." className={`size-${size}`} />
    </div>
  );
};
