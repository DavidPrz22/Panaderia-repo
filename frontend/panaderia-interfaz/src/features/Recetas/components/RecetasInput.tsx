import type { RecetasFormInputProps } from "../types/types";
export default function RecetasInput({
  register,
  name,
  typeInput,
  placeholder = "",
}: RecetasFormInputProps) {
  if (!register || !name) {
    return null;
  }

  let inputElement: React.ReactNode = <></>;
  if (typeInput === "textarea") {
    inputElement = (
      <textarea
        {...register(name)}
        name={name}
        placeholder={placeholder}
        rows={4}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs font-[Roboto]
                                            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500
                                            sm:text-sm resize-none"
      />
    );
  } else {
    inputElement = (
    <input
      {...register(name)}
      type={typeInput}
      placeholder={placeholder}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs font-[Roboto]
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                    ${
                      typeInput === "number"
                        ? `[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]`
                        : ""
                    }`}
      />
    );
  }
  return inputElement;
}
