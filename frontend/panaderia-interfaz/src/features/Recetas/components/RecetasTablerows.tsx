import { RecetaTablerow } from "./RecetaTablerow";

export const RecetasTablerows = ({ data }: { data: any[] }) => {
  return (
    <>
      {data.map((item, index) => (
        <RecetaTablerow item={item} index={index} key={item.id} />
      ))}

      <RecetaTablerow item={{}} index={123} key={123} />
    </>
  );
};