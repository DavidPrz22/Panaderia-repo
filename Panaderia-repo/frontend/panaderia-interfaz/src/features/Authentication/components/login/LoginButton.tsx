import { TubeSpinnerWhite } from "@/assets";

export function LoginButton({
  type,
  isPending,
}: {
  type: "submit";
  isPending: boolean;
}) {
  return (
    <>
      <button
        type={type}
        className="flex items-center justify-center gap-2 bg-blue-500 w-full text-white font-semibold p-2 rounded-xs cursor-pointer"
        disabled={isPending}
      >
        Iniciar sesión
        {isPending ? (
          <img src={TubeSpinnerWhite} alt="spinner" className="size-7" />
        ) : (
          ""
        )}
      </button>
    </>
  );
}
