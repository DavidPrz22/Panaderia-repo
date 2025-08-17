import type { recetaRelacionada } from "../types/types";
import type { UseFormSetValue } from "react-hook-form";
import type { TRecetasFormSchema } from "../schemas/schemas";
import { useRecetasContext } from "@/context/RecetasContext";

export default function RecetaListSearchContainer({
    searchList,
    setValue,
    }: {
    searchList: recetaRelacionada[];
    setValue?: UseFormSetValue<TRecetasFormSchema>;
    }) {
    const { setSearchListRecetaList } =
        useRecetasContext();
    return (
        <div className="absolute flex flex-col top-[86px] left-0 w-full max-h-[247px] overflow-y-auto border border-gray-300 rounded-md shadow-md bg-white z-10">
        {searchList.map((item) => (
            <div
            key={item.id}
            className="border-b border-gray-300 py-2 px-4 cursor-pointer hover:bg-gray-100"
            onClick={() => {
                setSearchListRecetaList([]);
                if (setValue) {
                    setValue("receta_relacionada", item.id);
                }
            }}
            >
            {item.nombre}
            </div>
        ))}
        </div>
    );
}