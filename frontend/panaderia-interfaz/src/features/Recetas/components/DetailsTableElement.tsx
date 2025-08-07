import type { recetaDetallesItemComponente } from "../types/types";

export const DetailsTableElement = ({
  header,
  data,
  right,
  attribute,
}: {
  header: string;
  data: recetaDetallesItemComponente[];
  attribute: string;
  right?: boolean;
}) => {
  return (
    <>
      <div className={`${right ? "border-r border-gray-300" : ""}`}>
        <div className="text-lg font-semibold font-[Roboto] border-b border-gray-300 p-4 bg-[var(--table-header-bg)] text-[var(--table-header-text)] rounded-t-md">
          {header}
        </div>
        <div className="text-md font-[Roboto] ">
          {data.map((detalle, index) => {
            return (
              <div
                className={`p-2 ${index === data.length - 1 ? "border-b-0" : "border-b"} border-gray-300`}
                key={detalle.id}
              >
                {detalle[attribute as keyof recetaDetallesItemComponente]}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
