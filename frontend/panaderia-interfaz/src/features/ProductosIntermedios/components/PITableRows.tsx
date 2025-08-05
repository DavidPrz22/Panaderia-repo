import { PITableRow } from "./PITablerow";

export const PITableRows = ({ data }: { data: any[] }) => {
  return (
    <>
      {data.map((item, index) => (
        <PITableRow item={item} index={index} key={item.id} />
      ))}

      <PITableRow item={{}} index={123} key={123} />
    </>
  );
};