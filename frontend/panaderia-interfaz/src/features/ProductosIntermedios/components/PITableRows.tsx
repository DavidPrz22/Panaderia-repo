import type { ProductosIntermedios } from "../types/types";
import { PITableRow } from "./PITablerow";

export const PITableRows = ({ data }: { data: ProductosIntermedios[] }) => {
  return (
    <>
      {data.map((item, index) => (
        <PITableRow item={item} index={index} key={item.id} />
      ))}
    </>
  );
};
