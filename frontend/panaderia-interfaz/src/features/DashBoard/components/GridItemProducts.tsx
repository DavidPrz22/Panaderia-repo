import { Card } from "@/components/ui/card";
import { ResponsivePie } from "@nivo/pie";
import { useTopProducts } from "../hooks/queries/queries";
import { ChartSkeleton } from "./DashboardSkeleton";
import { DashboardError } from "./DashboardError";
import { transformTopProductsData, nivoTheme } from "../utils/chartHelpers";

const COLORS = [
  "#2563eb", // blue-600
  "#16a34a", // green-600
  "#d97706", // amber-600
  "#dc2626", // red-600
  "#7c3aed", // violet-600
  "#db2777", // pink-600
  "#0891b2", // cyan-600
  "#ea580c", // orange-600
];

export const GridItemProducts = () => {
  const { data, isLoading, isError, error, refetch } = useTopProducts();

  if (isLoading) {
    return (
      <div className="lg:col-start-7 lg:col-end-11 h-full min-h-[400px]">
        <ChartSkeleton />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Card className="bg-white lg:col-start-7 lg:col-end-11 h-full min-h-[400px] shadow-sm border-gray-200">
        <DashboardError
          title="Error al cargar productos más vendidos"
          message={error instanceof Error ? error.message : undefined}
          onRetry={refetch}
        />
      </Card>
    );
  }

  const chartData = transformTopProductsData(data);

  // Assign colors to data items (safe cyclic access)
  const pieData = chartData.map((item, index) => ({
    id: item.product,
    label: item.product,
    value: item.quantity,
    type: item.type,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="bg-white lg:col-start-7 lg:col-end-11 h-full shadow-sm border-gray-200 flex flex-col overflow-hidden">
      <div className="p-6 pb-2">
        <h2 className="text-lg font-bold text-slate-800">
          Productos más vendidos
        </h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center p-4 min-h-0">
        {/* Chart Section */}
        <div className="w-full md:w-1/2 h-[300px] relative">
          <ResponsivePie
            data={pieData}
            theme={nivoTheme}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ datum: "data.color" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableArcLinkLabels={false} // Disable default link labels to use custom legend
            enableArcLabels={true}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="#ffffff"
            tooltip={({ datum }) => (
              <div className="bg-white px-3 py-2 shadow-xl rounded-lg border border-slate-100 text-sm z-50">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: datum.color }}
                  />
                  <span className="font-semibold text-slate-700">
                    {datum.id}
                  </span>
                </div>
                <div className="text-slate-500">
                  Cantidad: <span className="font-medium text-slate-900">{datum.value}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 capitalize">
                  {/* @ts-ignore - access custom data safely */}
                  {(datum.data as any).type === "resale" ? "Reventa" : "Final"}
                </div>
              </div>
            )}
          />
          {pieData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              No hay datos disponibles
            </div>
          )}
        </div>

        {/* Custom Legend Section */}
        <div className="w-full md:w-1/2 p-4 h-[300px] overflow-y-auto">
          <div className="flex flex-col gap-3">
            {pieData.map((item) => (
              <div key={item.id} className="flex items-start gap-3 group px-1">
                <div
                  className="w-3 h-3 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 leading-snug break-words">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.value} unidades
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
