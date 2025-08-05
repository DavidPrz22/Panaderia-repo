import { RecetaTablerow } from "./RecetaTablerow";
import type { recetaItem } from "../types/types";

export const RecetasTablerows = ({ data }: { data: recetaItem[] }) => {
  return (
    <>
      {data.map((item, index) => (
        <RecetaTablerow item={item} index={index} key={item.id} />
      ))}
    </>
  );
};