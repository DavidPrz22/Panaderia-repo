import { TubeSpinner, TubeSpinnerWhite } from "@/assets";

export const PendingTubeSpinner = ({
  size,
  extraClass,
  white,
}: {
  size: number;
  extraClass?: string;
  white?: boolean;
}) => {
  return (
    <div
      className={`flex justify-center items-center ${white ? "text-white" : "text-gray-700"} ${extraClass}`}
    >
      {white ? (
        <img src={TubeSpinnerWhite} alt="Cargando..." className={`size-${size}`} />
      ) : (
        <img src={TubeSpinner} alt="Cargando..." className={`size-${size}`} />
      )}
    </div>
  );
};
