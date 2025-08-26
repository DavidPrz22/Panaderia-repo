import type { ProductosFinalesList } from "../types/types";
import { PFTableRow } from "./PFTablerow";

export const PFTableRows = ({ data }: { data: ProductosFinalesList }) => {
  data = data.sort((a,b) => a.id - b.id);
  return (
    <>
      {data.map((item, index) => (
        <PFTableRow item={item} index={index} key={item.id} />
      ))}
    </>
  );
};
