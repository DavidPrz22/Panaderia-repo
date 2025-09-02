import type { recetaDetallesItemComponente } from "../types/types";

export const DetailsTableElement = ({
  header,
  data,
  attribute,
}: {
  header: string;
  data: recetaDetallesItemComponente[];
  attribute: string;
}) => {
  return (
    <>
      <div className="border-r border-gray-300">
        <div className="text-lg font-semibold font-[Roboto] border-b border-gray-300 p-4 bg-[var(--table-header-bg)] text-[var(--table-header-text)] rounded-t-md">
          {header}
        </div>
        <div className="text-md font-[Roboto]">
          {data.map((detalle) => {
            return (
              <div
                className={`py-2 px-4 border-b border-gray-300`}
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
