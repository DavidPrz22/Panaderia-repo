import type { PRLotesFormInputProps } from "../types/types";

const PRLotesInputForm = ({
  register,
  name,
  typeInput,
  placeholder,
}: PRLotesFormInputProps) => {
  return (
    <input
      {...register(name)}
      type={typeInput}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default PRLotesInputForm;