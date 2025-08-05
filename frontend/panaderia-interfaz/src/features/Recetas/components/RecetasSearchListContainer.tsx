import { useRecetasContext } from "@/context/RecetasContext";
import { RecetasSearchListContent } from "./RecetasSearchListContent";
import type { watchSetValueProps } from "../types/types";

export default function RecetasSearchListContainer({watch, setValue}: watchSetValueProps) {
    const { searchListItems } = useRecetasContext();
    return (
        <div 
            className="
            flex flex-col border border-gray-300 w-full max-h-[var(--search-list-long-height)] shadow-lg
            overflow-y-auto absolute top-[86px] left-0 bg-white z-10">
            {
            searchListItems.map((item, index) => (
                <RecetasSearchListContent key={index} category={Object.keys(item)[0]} items={Object.values(item)[0]} watch={watch} setValue={setValue} />
                ))
            }
            </div>
    )
}