import type { LoginUserType } from "@/features/Authentication/types/types";

export function LoginInput({
  placeholder,
  type,
  name,
  register,
}: LoginUserType) {
  return (
    <>
      <input
        {...register(name)}
        className="
            w-full text-xs p-3 pl-8 border font-semibold font-[Roboto] border-gray-300 bg-gray-100 rounded-xs outline-0
            focus:outline-blue-500 focus:outline-2"
        type={type}
        placeholder={placeholder}
      />
    </>
  );
}
