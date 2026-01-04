import type { SalesTrendData, TopProductsData, SalesTrendChartData, TopProductsChartData } from "../types";
import { formatDate } from "./formatters";

export const transformSalesTrendData = (
  data: SalesTrendData,
): SalesTrendChartData[] => {
  return [
    {
      id: "ventas",
      data: data.data.map((item) => ({
        x: formatDate(item.date),
        y: item.total_sales,
      })),
    },
  ];
};

export const transformTopProductsData = (
  data: TopProductsData,
): TopProductsChartData[] => {
  return data.data.map((item) => ({
    product: item.product_name,
    quantity: item.quantity_sold,
    type: item.product_type,
  }));
};

// Nivo theme configuration
export const nivoTheme = {
  fontSize: 12,
  textColor: "#64748b",
  grid: {
    line: {
      stroke: "#e2e8f0",
      strokeWidth: 1,
    },
  },
  axis: {
    domain: {
      line: {
        stroke: "#cbd5e1",
        strokeWidth: 1,
      },
    },
    ticks: {
      line: {
        stroke: "#cbd5e1",
        strokeWidth: 1,
      },
    },
  },
} as const;
