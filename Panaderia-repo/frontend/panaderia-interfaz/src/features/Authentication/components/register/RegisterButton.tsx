import { TubeSpinnerWhite } from "@/assets";

export function RegisterButton({
  type,
  isPending,
}: {
  type: "submit";
  isPending: boolean;
}) {
  return (
    <button
      type={type}
      className="bg-blue-500 w-full text-white font-semibold p-2 text-xs rounded-xs cursor-pointer"
      disabled={isPending}
    >
      {isPending ? (
        <div className="flex gap-2 items-center justify-center">
          <span className="ml-2">Creando cuenta</span>
          <img src={TubeSpinnerWhite} alt="Loading" className="size-7" />
        </div>
      ) : (
        "Crear Cuenta"
      )}
    </button>
  );
}
