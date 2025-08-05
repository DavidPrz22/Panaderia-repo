export default function Button({
  children,
  type,
  onClick,
}: {
  children: React.ReactNode;
  type: "submit" | "cancel" | "delete" | "edit" | "close" | "add";
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className={`
        ${type === "submit" ? "bg-blue-500 text-white hover:bg-blue-600 border-none rounded-md px-4 py-2" : ""} 
        ${type === "cancel" ? "text-black hover:bg-gray-100 border border-gray-300 rounded-md px-4 py-2" : ""}
        ${type === "delete" ? "bg-red-500 text-white hover:bg-red-600 border-none rounded-md px-4 py-2" : ""}
        ${type === "edit" ? "bg-blue-500 text-white hover:bg-blue-600 border-none rounded-md px-4 py-2" : ""}
        ${type == "add" ? "bg-green-600 text-white hover:bg-green-700 border-none rounded-md px-4 py-2" : ""} 
        ${type === "close" ? "border rounded-full p-2 border-gray-300" : ""}

        font-semibold cursor-pointer w-fit`}
    >
      {children}
    </button>
  );
}
