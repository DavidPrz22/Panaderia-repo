# Dashboard Feature Implementation Plan

## Overview
This document outlines the complete implementation plan for the Dashboard feature, including both frontend and backend components. The dashboard will display real-time business metrics through 4 indicator cards and 4 grid sections with charts and tables.

---

## Frontend Implementation

### Technology Stack
- **Component Library**: Shadcn UI
- **Data Fetching**: React Query (for caching and API requests)
- **Charts**: Nivo Charts Library
- **Validation**: Zod schemas
- **State Management**: React Query + Context API (existing DashBoardContext)

---

### 1. Indicator Cards (4 Cards)

#### Card 1: Sales of the Day
**Purpose**: Display daily sales metrics

**Data to Display**:
- **Main Value**: Total sales amount in VES (Bs.)
- **Small Text**: Number of transactions
- **Bolded Text**: Total items sold

**API Endpoint**: `GET /api/dashboard/sales-today/`

**Response Schema**:
```typescript
{
  total_sales: number;        // Total in VES
  total_transactions: number; // Count of sales
  total_items_sold: number;   // Sum of all items
  percentage_vs_yesterday: number; // Optional comparison
}
```

**Component**: Update `DashBoardCard` to handle this data type

---

#### Card 2: Pending Orders
**Purpose**: Show pending sales orders status

**Data to Display**:
- **Main Value**: Total number of pending orders
- **Small Text**: Number of orders due today
- **Bolded Text**: Number of orders approaching delivery date (within 2 days)

**API Endpoint**: `GET /api/dashboard/pending-orders/`

**Response Schema**:
```typescript
{
  total_pending: number;           // Total pending orders
  due_today: number;               // Orders with delivery_date = today
  approaching_deadline: number;    // Orders with delivery_date within 2 days
  percentage_vs_yesterday: number; // Optional
}
```

---

#### Card 3: Stock Alerts
**Purpose**: Quick summary of inventory issues

**Data to Display**:
- **Main Value**: Total number of alerts
- **Small Text**: Breakdown by type (e.g., "5 bajo mínimo, 3 vencidos")
- **Bolded Text**: Critical alerts requiring immediate attention

**API Endpoint**: `GET /api/dashboard/stock-alerts/`

**Response Schema**:
```typescript
{
  total_alerts: number;
  under_reorder_point: number;  // Stock below reorder point
  out_of_stock: number;         // Stock = 0
  expired: number;              // Past expiration date
  critical_count: number;       // out_of_stock + expired
}
```

---

#### Card 4: Recent Productions
**Purpose**: Show production activity

**Data to Display**:
- **Main Value**: Number of production orders in last 24 hours
- **Small Text**: "últimas 24 horas"
- **Bolded Text**: Comparison vs previous 24 hours

**API Endpoint**: `GET /api/dashboard/recent-productions/`

**Response Schema**:
```typescript
{
  total_productions: number;       // Count of production orders
  percentage_vs_previous: number;  // Comparison
  total_items_produced: number;    // Optional: sum of quantities
}
```

---

### 2. Grid Sections (4 Sections)

#### Section 1: Tendencias (Sales Trends)
**Layout**: `lg:col-span-6` (takes 6 columns in the 10-column grid)

**Purpose**: Display sales trend for the last 7 days

**Chart Type**: Line Chart (Nivo ResponsiveLine)

**Data to Display**:
- X-axis: Dates (last 7 days)
- Y-axis: Total sales in VES
- Show data points and smooth line

**API Endpoint**: `GET /api/dashboard/sales-trends/`

**Response Schema**:
```typescript
{
  data: Array<{
    date: string;        // ISO format: "2026-01-02"
    total_sales: number; // In VES
  }>;
}
```

**Component Structure**:
```
GridItemTrends/
├── index.tsx (wrapper with card styling)
├── SalesTrendChart.tsx (Nivo chart component)
└── types.ts
```

**Nivo Configuration**:
- Use `ResponsiveLine` from `@nivo/line`
- Enable grid, axis, and legends
- Format Y-axis with "Bs." prefix
- Format X-axis with short date format

---

#### Section 2: Productos (Top Selling Products)
**Layout**: `lg:col-span-4` (takes 4 columns)

**Purpose**: Show top 10 most sold products (resale + finals)

**Chart Type**: Bar Chart (Nivo ResponsiveBar)

**Data to Display**:
- X-axis: Product names (truncated if too long)
- Y-axis: Quantity sold
- Different colors for resale vs final products

**API Endpoint**: `GET /api/dashboard/top-products/`

**Response Schema**:
```typescript
{
  data: Array<{
    product_name: string;
    quantity_sold: number;
    product_type: "resale" | "final"; // For color coding
  }>;
}
```

**Component Structure**:
```
GridItemProducts/
├── index.tsx
├── TopProductsChart.tsx
└── types.ts
```

**Nivo Configuration**:
- Use `ResponsiveBar` from `@nivo/bar`
- Horizontal layout for better label readability
- Color scheme: resale (blue), final (green)

---

#### Section 3: Compras (Recent Purchase Orders)
**Layout**: `lg:col-span-5` (takes 5 columns)

**Purpose**: Quick table summary of last 10 purchase orders

**Component Type**: Table (Shadcn Table)

**Data to Display**:
| Column | Description |
|--------|-------------|
| Orden # | Purchase order number |
| Proveedor | Supplier name |
| Fecha | Order date |
| Estado | Status (pendiente, recibido, etc.) |
| Total | Total amount in VES |

**API Endpoint**: `GET /api/dashboard/recent-purchases/`

**Response Schema**:
```typescript
{
  data: Array<{
    id: number;
    order_number: string;
    supplier_name: string;
    order_date: string;
    status: string;
    total_amount: number; // In VES
  }>;
}
```

**Component Structure**:
```
GridItemCompras/
├── index.tsx
├── PurchaseOrdersTable.tsx
├── PurchaseOrderRow.tsx
└── types.ts
```

**Features**:
- Clickable rows (navigate to purchase order detail)
- Status badges with color coding
- Formatted currency display

---

#### Section 4: Ventas (Recent Sales)
**Layout**: `lg:col-span-5` (takes 5 columns)

**Purpose**: Quick table summary of last 10 sales from Ventas model

**Component Type**: Table (Shadcn Table)

**Data to Display**:
| Column | Description |
|--------|-------------|
| Venta # | Sale ID |
| Cliente | Customer name (if available) |
| Fecha/Hora | Sale timestamp |
| Método Pago | Payment method |
| Total | Total amount in VES |

**API Endpoint**: `GET /api/dashboard/recent-sales/`

**Response Schema**:
```typescript
{
  data: Array<{
    id: number;
    sale_number: string;
    customer_name: string | null;
    sale_datetime: string;
    payment_method: string;
    total_amount: number; // In VES
  }>;
}
```

**Component Structure**:
```
GridItemVentas/
├── index.tsx
├── RecentSalesTable.tsx
├── SaleRow.tsx
└── types.ts
```

**Features**:
- Clickable rows (navigate to sale detail if applicable)
- Payment method icons/badges
- Relative time display (e.g., "hace 2 horas")

---

### 3. Shared Components & Utilities

#### Schemas (`/features/DashBoard/types/schemas.ts`)
```typescript
import { z } from "zod";

// Card Schemas
export const SalesTodaySchema = z.object({
  total_sales: z.number(),
  total_transactions: z.number(),
  total_items_sold: z.number(),
  percentage_vs_yesterday: z.number().optional(),
});

export const PendingOrdersSchema = z.object({
  total_pending: z.number(),
  due_today: z.number(),
  approaching_deadline: z.number(),
  percentage_vs_yesterday: z.number().optional(),
});

export const StockAlertsSchema = z.object({
  total_alerts: z.number(),
  under_reorder_point: z.number(),
  out_of_stock: z.number(),
  expired: z.number(),
  critical_count: z.number(),
});

export const RecentProductionsSchema = z.object({
  total_productions: z.number(),
  percentage_vs_previous: z.number().optional(),
  total_items_produced: z.number().optional(),
});

// Grid Section Schemas
export const SalesTrendDataSchema = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      total_sales: z.number(),
    })
  ),
});

export const TopProductsDataSchema = z.object({
  data: z.array(
    z.object({
      product_name: z.string(),
      quantity_sold: z.number(),
      product_type: z.enum(["resale", "final"]),
    })
  ),
});

export const RecentPurchasesSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      order_number: z.string(),
      supplier_name: z.string(),
      order_date: z.string(),
      status: z.string(),
      total_amount: z.number(),
    })
  ),
});

export const RecentSalesSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      sale_number: z.string(),
      customer_name: z.string().nullable(),
      sale_datetime: z.string(),
      payment_method: z.string(),
      total_amount: z.number(),
    })
  ),
});
```

#### Types (`/features/DashBoard/types/index.ts`)
```typescript
import { z } from "zod";
import * as schemas from "./schemas";

// Infer types from schemas
export type SalesToday = z.infer<typeof schemas.SalesTodaySchema>;
export type PendingOrders = z.infer<typeof schemas.PendingOrdersSchema>;
export type StockAlerts = z.infer<typeof schemas.StockAlertsSchema>;
export type RecentProductions = z.infer<typeof schemas.RecentProductionsSchema>;
export type SalesTrendData = z.infer<typeof schemas.SalesTrendDataSchema>;
export type TopProductsData = z.infer<typeof schemas.TopProductsDataSchema>;
export type RecentPurchases = z.infer<typeof schemas.RecentPurchasesSchema>;
export type RecentSales = z.infer<typeof schemas.RecentSalesSchema>;

// Chart data types for Nivo
export type SalesTrendChartData = {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
};

export type TopProductsChartData = {
  product: string;
  quantity: number;
  type: "resale" | "final";
};
```

---

### 4. React Query Setup

#### Query Keys (`/features/DashBoard/hooks/queries/queryKeys.ts`)
```typescript
export const dashboardKeys = {
  all: ["dashboard"] as const,
  salesToday: () => [...dashboardKeys.all, "sales-today"] as const,
  pendingOrders: () => [...dashboardKeys.all, "pending-orders"] as const,
  stockAlerts: () => [...dashboardKeys.all, "stock-alerts"] as const,
  recentProductions: () => [...dashboardKeys.all, "recent-productions"] as const,
  salesTrends: () => [...dashboardKeys.all, "sales-trends"] as const,
  topProducts: () => [...dashboardKeys.all, "top-products"] as const,
  recentPurchases: () => [...dashboardKeys.all, "recent-purchases"] as const,
  recentSales: () => [...dashboardKeys.all, "recent-sales"] as const,
};
```

#### API Functions (`/features/DashBoard/api/dashboardApi.ts`)
```typescript
import { apiClient } from "@/api/client";
import * as schemas from "../types/schemas";
import type * as types from "../types";

const BASE_URL = "/api/dashboard";

export const dashboardApi = {
  // Card endpoints
  getSalesToday: async (): Promise<types.SalesToday> => {
    const response = await apiClient.get(`${BASE_URL}/sales-today/`);
    return schemas.SalesTodaySchema.parse(response.data);
  },

  getPendingOrders: async (): Promise<types.PendingOrders> => {
    const response = await apiClient.get(`${BASE_URL}/pending-orders/`);
    return schemas.PendingOrdersSchema.parse(response.data);
  },

  getStockAlerts: async (): Promise<types.StockAlerts> => {
    const response = await apiClient.get(`${BASE_URL}/stock-alerts/`);
    return schemas.StockAlertsSchema.parse(response.data);
  },

  getRecentProductions: async (): Promise<types.RecentProductions> => {
    const response = await apiClient.get(`${BASE_URL}/recent-productions/`);
    return schemas.RecentProductionsSchema.parse(response.data);
  },

  // Grid section endpoints
  getSalesTrends: async (): Promise<types.SalesTrendData> => {
    const response = await apiClient.get(`${BASE_URL}/sales-trends/`);
    return schemas.SalesTrendDataSchema.parse(response.data);
  },

  getTopProducts: async (): Promise<types.TopProductsData> => {
    const response = await apiClient.get(`${BASE_URL}/top-products/`);
    return schemas.TopProductsDataSchema.parse(response.data);
  },

  getRecentPurchases: async (): Promise<types.RecentPurchases> => {
    const response = await apiClient.get(`${BASE_URL}/recent-purchases/`);
    return schemas.RecentPurchasesSchema.parse(response.data);
  },

  getRecentSales: async (): Promise<types.RecentSales> => {
    const response = await apiClient.get(`${BASE_URL}/recent-sales/`);
    return schemas.RecentSalesSchema.parse(response.data);
  },
};
```

#### Query Hooks (`/features/DashBoard/hooks/queries/queries.ts`)
```typescript
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../../api/dashboardApi";
import { dashboardKeys } from "./queryKeys";

// Card queries
export const useSalesToday = () => {
  return useQuery({
    queryKey: dashboardKeys.salesToday(),
    queryFn: dashboardApi.getSalesToday,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
  });
};

export const usePendingOrders = () => {
  return useQuery({
    queryKey: dashboardKeys.pendingOrders(),
    queryFn: dashboardApi.getPendingOrders,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useStockAlerts = () => {
  return useQuery({
    queryKey: dashboardKeys.stockAlerts(),
    queryFn: dashboardApi.getStockAlerts,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useRecentProductions = () => {
  return useQuery({
    queryKey: dashboardKeys.recentProductions(),
    queryFn: dashboardApi.getRecentProductions,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};

// Grid section queries
export const useSalesTrends = () => {
  return useQuery({
    queryKey: dashboardKeys.salesTrends(),
    queryFn: dashboardApi.getSalesTrends,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 10,
  });
};

export const useTopProducts = () => {
  return useQuery({
    queryKey: dashboardKeys.topProducts(),
    queryFn: dashboardApi.getTopProducts,
    staleTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
  });
};

export const useRecentPurchases = () => {
  return useQuery({
    queryKey: dashboardKeys.recentPurchases(),
    queryFn: dashboardApi.getRecentPurchases,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};

export const useRecentSales = () => {
  return useQuery({
    queryKey: dashboardKeys.recentSales(),
    queryFn: dashboardApi.getRecentSales,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });
};
```

---

### 5. Error Handling & Loading States

#### Error Boundary Component
Create a reusable error display component for dashboard sections:

```typescript
// /features/DashBoard/components/DashboardError.tsx
interface DashboardErrorProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

export const DashboardError = ({ title, message, onRetry }: DashboardErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <AlertCircle className="w-12 h-12 text-destructive" />
      <div className="text-center">
        <h3 className="font-semibold">{title}</h3>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Reintentar
        </Button>
      )}
    </div>
  );
};
```

#### Loading Skeleton Component
```typescript
// /features/DashBoard/components/DashboardSkeleton.tsx
export const CardSkeleton = () => (
  <div className="p-6 border rounded-lg space-y-3">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-3 w-full" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="p-6 border rounded-lg">
    <Skeleton className="h-[300px] w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="p-6 border rounded-lg space-y-3">
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-12 w-full" />
    ))}
  </div>
);
```

#### Usage in Components
```typescript
// Example: GridItemTrends/index.tsx
export const GridItemTrends = () => {
  const { data, isLoading, isError, error, refetch } = useSalesTrends();

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (isError) {
    return (
      <DashboardError
        title="Error al cargar tendencias"
        message={error.message}
        onRetry={refetch}
      />
    );
  }

  return <SalesTrendChart data={data} />;
};
```

---

### 6. Utility Functions

#### Currency Formatter (`/features/DashBoard/utils/formatters.ts`)
```typescript
export const formatCurrency = (amount: number): string => {
  return `Bs. ${amount.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString("es-VE");
};

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "short",
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("es-VE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return `hace ${diffMins} min`;
  } else if (diffHours < 24) {
    return `hace ${diffHours}h`;
  } else {
    return `hace ${diffDays}d`;
  }
};
```

#### Chart Helpers (`/features/DashBoard/utils/chartHelpers.ts`)
```typescript
import type { SalesTrendData, TopProductsData } from "../types";
import type { SalesTrendChartData, TopProductsChartData } from "../types";

export const transformSalesTrendData = (
  data: SalesTrendData
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
  data: TopProductsData
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
};
```

---

### 7. Component Updates

#### Update DashBoardCards.tsx
Replace hardcoded values with actual data from queries:

```typescript
import { useSalesToday, usePendingOrders, useStockAlerts, useRecentProductions } from "../hooks/queries/queries";
import { formatCurrency, formatNumber, formatPercentage } from "../utils/formatters";
import { CardSkeleton } from "./DashboardSkeleton";
import { DashboardError } from "./DashboardError";

export const DashBoardCards = () => {
  const salesToday = useSalesToday();
  const pendingOrders = usePendingOrders();
  const stockAlerts = useStockAlerts();
  const recentProductions = useRecentProductions();

  const isLoading = salesToday.isLoading || pendingOrders.isLoading || 
                    stockAlerts.isLoading || recentProductions.isLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-5">
        {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5">
      {/* Sales Card */}
      {salesToday.data && (
        <DashBoardCard
          type="Ventas del Día"
          value={formatCurrency(salesToday.data.total_sales)}
          smallText={`${salesToday.data.total_transactions} transacciones`}
          boldedText={`${salesToday.data.total_items_sold} items vendidos`}
        />
      )}

      {/* Pending Orders Card */}
      {pendingOrders.data && (
        <DashBoardCard
          type="Pedidos Pendientes"
          value={formatNumber(pendingOrders.data.total_pending)}
          smallText={`${pendingOrders.data.due_today} para hoy`}
          boldedText={`${pendingOrders.data.approaching_deadline} próximos a entregar`}
        />
      )}

      {/* Stock Alerts Card */}
      {stockAlerts.data && (
        <DashBoardCard
          type="Alertas de Stock"
          value={formatNumber(stockAlerts.data.total_alerts)}
          smallText={`${stockAlerts.data.under_reorder_point} bajo mínimo, ${stockAlerts.data.expired} vencidos`}
          boldedText={`${stockAlerts.data.critical_count} críticas`}
        />
      )}

      {/* Recent Productions Card */}
      {recentProductions.data && (
        <DashBoardCard
          type="Producción Reciente"
          value={formatNumber(recentProductions.data.total_productions)}
          smallText="últimas 24 horas"
          boldedText={
            recentProductions.data.percentage_vs_previous
              ? formatPercentage(recentProductions.data.percentage_vs_previous) + " vs ayer"
              : "Sin comparación"
          }
        />
      )}
    </div>
  );
};
```

---

### 8. Nivo Chart Components

#### Sales Trend Chart
```typescript
// /features/DashBoard/components/GridItemTrends/SalesTrendChart.tsx
import { ResponsiveLine } from "@nivo/line";
import { transformSalesTrendData } from "../../utils/chartHelpers";
import { formatCurrency } from "../../utils/formatters";
import type { SalesTrendData } from "../../types";

interface Props {
  data: SalesTrendData;
}

export const SalesTrendChart = ({ data }: Props) => {
  const chartData = transformSalesTrendData(data);

  return (
    <div className="h-[300px]">
      <ResponsiveLine
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 50, left: 70 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: "auto", max: "auto" }}
        curve="monotoneX"
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Fecha",
          legendOffset: 45,
          legendPosition: "middle",
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Ventas (Bs.)",
          legendOffset: -60,
          legendPosition: "middle",
          format: (value) => formatCurrency(value),
        }}
        enablePoints={true}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableGridX={false}
        enableGridY={true}
        colors={{ scheme: "category10" }}
        lineWidth={3}
        useMesh={true}
        tooltip={({ point }) => (
          <div className="bg-white p-2 shadow-lg rounded border">
            <strong>{point.data.xFormatted}</strong>
            <br />
            {formatCurrency(Number(point.data.yFormatted))}
          </div>
        )}
      />
    </div>
  );
};
```

#### Top Products Chart
```typescript
// /features/DashBoard/components/GridItemProducts/TopProductsChart.tsx
import { ResponsiveBar } from "@nivo/bar";
import { transformTopProductsData } from "../../utils/chartHelpers";
import type { TopProductsData } from "../../types";

interface Props {
  data: TopProductsData;
}

export const TopProductsChart = ({ data }: Props) => {
  const chartData = transformTopProductsData(data);

  return (
    <div className="h-[400px]">
      <ResponsiveBar
        data={chartData}
        keys={["quantity"]}
        indexBy="product"
        margin={{ top: 20, right: 20, bottom: 50, left: 150 }}
        padding={0.3}
        layout="horizontal"
        valueScale={{ type: "linear" }}
        colors={({ data }) => (data.type === "resale" ? "#3b82f6" : "#10b981")}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Cantidad Vendida",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendPosition: "middle",
          legendOffset: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        tooltip={({ data }) => (
          <div className="bg-white p-2 shadow-lg rounded border">
            <strong>{data.product}</strong>
            <br />
            Cantidad: {data.quantity}
            <br />
            Tipo: {data.type === "resale" ? "Reventa" : "Final"}
          </div>
        )}
      />
    </div>
  );
};
```

---

## Backend Implementation

### 1. Create Dashboard App

#### Step 1: Create the app
```bash
cd backend/djangobackend
python manage.py startapp dashboard
mv dashboard apps/
```

#### Step 2: Register in settings
Add to `INSTALLED_APPS` in `djangobackend/settings.py`:
```python
INSTALLED_APPS = [
    # ... other apps
    'apps.dashboard',
]
```

#### Step 3: Update apps.py
```python
# apps/dashboard/apps.py
from django.apps import AppConfig

class DashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.dashboard'
```

---

### 2. Create Serializers

```python
# apps/dashboard/serializers.py
from rest_framework import serializers

class SalesTodaySerializer(serializers.Serializer):
    """Serializer for daily sales summary"""
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_transactions = serializers.IntegerField()
    total_items_sold = serializers.IntegerField()
    percentage_vs_yesterday = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, allow_null=True
    )


class PendingOrdersSerializer(serializers.Serializer):
    """Serializer for pending orders summary"""
    total_pending = serializers.IntegerField()
    due_today = serializers.IntegerField()
    approaching_deadline = serializers.IntegerField()
    percentage_vs_yesterday = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, allow_null=True
    )


class StockAlertsSerializer(serializers.Serializer):
    """Serializer for stock alerts summary"""
    total_alerts = serializers.IntegerField()
    under_reorder_point = serializers.IntegerField()
    out_of_stock = serializers.IntegerField()
    expired = serializers.IntegerField()
    critical_count = serializers.IntegerField()


class RecentProductionsSerializer(serializers.Serializer):
    """Serializer for recent productions summary"""
    total_productions = serializers.IntegerField()
    percentage_vs_previous = serializers.DecimalField(
        max_digits=5, decimal_places=2, required=False, allow_null=True
    )
    total_items_produced = serializers.IntegerField(required=False, allow_null=True)


class SalesTrendItemSerializer(serializers.Serializer):
    """Single day sales trend data"""
    date = serializers.DateField()
    total_sales = serializers.DecimalField(max_digits=12, decimal_places=2)


class SalesTrendDataSerializer(serializers.Serializer):
    """Sales trend for last 7 days"""
    data = SalesTrendItemSerializer(many=True)


class TopProductItemSerializer(serializers.Serializer):
    """Single product in top products list"""
    product_name = serializers.CharField()
    quantity_sold = serializers.IntegerField()
    product_type = serializers.ChoiceField(choices=['resale', 'final'])


class TopProductsDataSerializer(serializers.Serializer):
    """Top 10 selling products"""
    data = TopProductItemSerializer(many=True)


class RecentPurchaseItemSerializer(serializers.Serializer):
    """Single purchase order in recent list"""
    id = serializers.IntegerField()
    order_number = serializers.CharField()
    supplier_name = serializers.CharField()
    order_date = serializers.DateField()
    status = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class RecentPurchasesSerializer(serializers.Serializer):
    """Last 10 purchase orders"""
    data = RecentPurchaseItemSerializer(many=True)


class RecentSaleItemSerializer(serializers.Serializer):
    """Single sale in recent sales list"""
    id = serializers.IntegerField()
    sale_number = serializers.CharField()
    customer_name = serializers.CharField(allow_null=True, required=False)
    sale_datetime = serializers.DateTimeField()
    payment_method = serializers.CharField()
    total_amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class RecentSalesSerializer(serializers.Serializer):
    """Last 10 sales from Ventas model"""
    data = RecentSaleItemSerializer(many=True)
```

---

### 3. Create ViewSet

```python
# apps/dashboard/viewsets.py
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count, Q, F
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from apps.ventas.models import Ventas, DetalleVenta, OrdenVenta
from apps.compras.models import OrdenCompra
from apps.produccion.models import OrdenProduccion
from apps.inventario.models import Lote, ProductoFinal, ProductoReventa

from .serializers import (
    SalesTodaySerializer,
    PendingOrdersSerializer,
    StockAlertsSerializer,
    RecentProductionsSerializer,
    SalesTrendDataSerializer,
    TopProductsDataSerializer,
    RecentPurchasesSerializer,
    RecentSalesSerializer,
)


class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet for dashboard data endpoints.
    All actions return aggregated data for dashboard display.
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='sales-today')
    def sales_today(self, request):
        """
        Get sales summary for today.
        Returns: total_sales, total_transactions, total_items_sold, percentage_vs_yesterday
        """
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)

        # Today's sales
        today_sales = Ventas.objects.filter(
            fecha_venta__date=today
        ).aggregate(
            total_sales=Sum('total_venta_ves'),
            total_transactions=Count('id'),
            total_items=Sum('detalleventa__cantidad')
        )

        # Yesterday's sales for comparison
        yesterday_sales = Ventas.objects.filter(
            fecha_venta__date=yesterday
        ).aggregate(
            total_sales=Sum('total_venta_ves')
        )

        # Calculate percentage change
        percentage_vs_yesterday = None
        if yesterday_sales['total_sales'] and yesterday_sales['total_sales'] > 0:
            today_total = today_sales['total_sales'] or Decimal('0')
            yesterday_total = yesterday_sales['total_sales']
            percentage_vs_yesterday = (
                (today_total - yesterday_total) / yesterday_total * 100
            )

        data = {
            'total_sales': today_sales['total_sales'] or Decimal('0'),
            'total_transactions': today_sales['total_transactions'] or 0,
            'total_items_sold': today_sales['total_items'] or 0,
            'percentage_vs_yesterday': percentage_vs_yesterday,
        }

        serializer = SalesTodaySerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='pending-orders')
    def pending_orders(self, request):
        """
        Get pending orders summary.
        Returns: total_pending, due_today, approaching_deadline
        """
        today = timezone.now().date()
        two_days_from_now = today + timedelta(days=2)

        # Assuming OrdenVenta has status and fecha_entrega fields
        pending_orders = OrdenVenta.objects.filter(
            estado__in=['pendiente', 'en_proceso']  # Adjust status values as needed
        )

        total_pending = pending_orders.count()
        due_today = pending_orders.filter(fecha_entrega=today).count()
        approaching_deadline = pending_orders.filter(
            fecha_entrega__lte=two_days_from_now,
            fecha_entrega__gt=today
        ).count()

        data = {
            'total_pending': total_pending,
            'due_today': due_today,
            'approaching_deadline': approaching_deadline,
        }

        serializer = PendingOrdersSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='stock-alerts')
    def stock_alerts(self, request):
        """
        Get stock alerts summary.
        Returns: total_alerts, under_reorder_point, out_of_stock, expired, critical_count
        """
        today = timezone.now().date()

        # Query lotes for stock issues
        # Assuming Lote has cantidad_disponible, punto_reorden, fecha_vencimiento
        under_reorder = Lote.objects.filter(
            cantidad_disponible__lte=F('punto_reorden'),
            cantidad_disponible__gt=0
        ).count()

        out_of_stock = Lote.objects.filter(cantidad_disponible=0).count()

        expired = Lote.objects.filter(
            fecha_vencimiento__lt=today,
            cantidad_disponible__gt=0
        ).count()

        total_alerts = under_reorder + out_of_stock + expired
        critical_count = out_of_stock + expired

        data = {
            'total_alerts': total_alerts,
            'under_reorder_point': under_reorder,
            'out_of_stock': out_of_stock,
            'expired': expired,
            'critical_count': critical_count,
        }

        serializer = StockAlertsSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='recent-productions')
    def recent_productions(self, request):
        """
        Get recent productions summary (last 24 hours).
        Returns: total_productions, percentage_vs_previous, total_items_produced
        """
        now = timezone.now()
        last_24h = now - timedelta(hours=24)
        previous_24h = last_24h - timedelta(hours=24)

        # Last 24 hours
        recent_productions = OrdenProduccion.objects.filter(
            fecha_creacion__gte=last_24h
        ).aggregate(
            count=Count('id'),
            total_items=Sum('cantidad_producida')
        )

        # Previous 24 hours for comparison
        previous_productions = OrdenProduccion.objects.filter(
            fecha_creacion__gte=previous_24h,
            fecha_creacion__lt=last_24h
        ).aggregate(
            count=Count('id')
        )

        # Calculate percentage change
        percentage_vs_previous = None
        if previous_productions['count'] and previous_productions['count'] > 0:
            current_count = recent_productions['count'] or 0
            previous_count = previous_productions['count']
            percentage_vs_previous = (
                (current_count - previous_count) / previous_count * 100
            )

        data = {
            'total_productions': recent_productions['count'] or 0,
            'percentage_vs_previous': percentage_vs_previous,
            'total_items_produced': recent_productions['total_items'] or 0,
        }

        serializer = RecentProductionsSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='sales-trends')
    def sales_trends(self, request):
        """
        Get sales trends for last 7 days.
        Returns: array of {date, total_sales}
        """
        today = timezone.now().date()
        seven_days_ago = today - timedelta(days=6)  # Including today = 7 days

        # Get sales grouped by date
        sales_by_date = Ventas.objects.filter(
            fecha_venta__date__gte=seven_days_ago,
            fecha_venta__date__lte=today
        ).values('fecha_venta__date').annotate(
            total_sales=Sum('total_venta_ves')
        ).order_by('fecha_venta__date')

        # Create a complete date range (fill missing dates with 0)
        date_range = [seven_days_ago + timedelta(days=i) for i in range(7)]
        sales_dict = {
            item['fecha_venta__date']: item['total_sales']
            for item in sales_by_date
        }

        trend_data = [
            {
                'date': date,
                'total_sales': sales_dict.get(date, Decimal('0'))
            }
            for date in date_range
        ]

        data = {'data': trend_data}
        serializer = SalesTrendDataSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='top-products')
    def top_products(self, request):
        """
        Get top 10 most sold products (resale + finals).
        Returns: array of {product_name, quantity_sold, product_type}
        """
        # Get top resale products
        top_resale = DetalleVenta.objects.filter(
            producto_reventa__isnull=False
        ).values(
            'producto_reventa__nombre'
        ).annotate(
            quantity_sold=Sum('cantidad')
        ).order_by('-quantity_sold')[:10]

        # Get top final products
        top_final = DetalleVenta.objects.filter(
            producto_final__isnull=False
        ).values(
            'producto_final__nombre'
        ).annotate(
            quantity_sold=Sum('cantidad')
        ).order_by('-quantity_sold')[:10]

        # Combine and format
        products = []
        
        for item in top_resale:
            products.append({
                'product_name': item['producto_reventa__nombre'],
                'quantity_sold': item['quantity_sold'],
                'product_type': 'resale'
            })
        
        for item in top_final:
            products.append({
                'product_name': item['producto_final__nombre'],
                'quantity_sold': item['quantity_sold'],
                'product_type': 'final'
            })

        # Sort by quantity and take top 10
        products.sort(key=lambda x: x['quantity_sold'], reverse=True)
        products = products[:10]

        data = {'data': products}
        serializer = TopProductsDataSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='recent-purchases')
    def recent_purchases(self, request):
        """
        Get last 10 purchase orders.
        Returns: array of purchase order details
        """
        recent_purchases = OrdenCompra.objects.select_related(
            'proveedor'
        ).order_by('-fecha_orden')[:10]

        purchases_data = [
            {
                'id': order.id,
                'order_number': order.numero_orden or f"OC-{order.id}",
                'supplier_name': order.proveedor.nombre if order.proveedor else 'N/A',
                'order_date': order.fecha_orden,
                'status': order.estado,
                'total_amount': order.total_orden_ves or Decimal('0'),
            }
            for order in recent_purchases
        ]

        data = {'data': purchases_data}
        serializer = RecentPurchasesSerializer(data)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='recent-sales')
    def recent_sales(self, request):
        """
        Get last 10 sales from Ventas model.
        Returns: array of sale details
        """
        recent_sales = Ventas.objects.select_related(
            'cliente', 'apertura_cierre'
        ).order_by('-fecha_venta')[:10]

        sales_data = [
            {
                'id': sale.id,
                'sale_number': f"V-{sale.id}",
                'customer_name': sale.cliente.nombre if sale.cliente else None,
                'sale_datetime': sale.fecha_venta,
                'payment_method': self._get_payment_method_display(sale),
                'total_amount': sale.total_venta_ves or Decimal('0'),
            }
            for sale in recent_sales
        ]

        data = {'data': sales_data}
        serializer = RecentSalesSerializer(data)
        return Response(serializer.data)

    def _get_payment_method_display(self, sale):
        """
        Helper to determine primary payment method for a sale.
        Adjust based on your Ventas model structure.
        """
        # Assuming Ventas has fields like monto_efectivo, monto_tarjeta, etc.
        if hasattr(sale, 'monto_efectivo') and sale.monto_efectivo and sale.monto_efectivo > 0:
            return 'efectivo'
        elif hasattr(sale, 'monto_tarjeta') and sale.monto_tarjeta and sale.monto_tarjeta > 0:
            return 'tarjeta'
        elif hasattr(sale, 'monto_transferencia') and sale.monto_transferencia and sale.monto_transferencia > 0:
            return 'transferencia'
        elif hasattr(sale, 'monto_pago_movil') and sale.monto_pago_movil and sale.monto_pago_movil > 0:
            return 'pago_movil'
        else:
            return 'mixto'
```

---

### 4. Create URLs

```python
# apps/dashboard/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import DashboardViewSet

router = DefaultRouter()
router.register(r'', DashboardViewSet, basename='dashboard')

urlpatterns = [
    path('', include(router.urls)),
]
```

#### Register in main URLs
```python
# djangobackend/urls.py
urlpatterns = [
    # ... other paths
    path('api/dashboard/', include('apps.dashboard.urls')),
]
```

---

### 5. Database Considerations

#### Required Model Fields
Ensure the following models have these fields (adjust viewset queries if different):

**Ventas Model**:
- `fecha_venta` (DateTimeField)
- `total_venta_ves` (DecimalField)
- `cliente` (ForeignKey, nullable)
- Payment method fields (e.g., `monto_efectivo`, `monto_tarjeta`, etc.)

**DetalleVenta Model**:
- `venta` (ForeignKey to Ventas)
- `producto_reventa` (ForeignKey, nullable)
- `producto_final` (ForeignKey, nullable)
- `cantidad` (IntegerField/DecimalField)

**OrdenVenta Model**:
- `estado` (CharField with choices)
- `fecha_entrega` (DateField)

**OrdenCompra Model**:
- `proveedor` (ForeignKey)
- `fecha_orden` (DateField)
- `estado` (CharField)
- `total_orden_ves` (DecimalField)
- `numero_orden` (CharField, optional)

**OrdenProduccion Model**:
- `fecha_creacion` (DateTimeField)
- `cantidad_producida` (IntegerField/DecimalField)

**Lote Model**:
- `cantidad_disponible` (DecimalField)
- `punto_reorden` (DecimalField)
- `fecha_vencimiento` (DateField, nullable)

---

### 6. Error Handling & Optimization

#### Add Error Handling to ViewSet
```python
from rest_framework.exceptions import APIException
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)

class DashboardViewSet(viewsets.ViewSet):
    # ... existing code ...

    def handle_exception(self, exc):
        """Custom exception handler for dashboard endpoints"""
        logger.error(f"Dashboard error: {str(exc)}", exc_info=True)
        
        if isinstance(exc, ValidationError):
            return Response(
                {'error': 'Invalid data', 'details': exc.messages},
                status=400
            )
        
        return super().handle_exception(exc)
```

#### Add Database Indexes
Create a migration to add indexes for frequently queried fields:

```python
# apps/dashboard/migrations/0001_add_indexes.py
from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('ventas', 'XXXX_previous_migration'),
        ('compras', 'XXXX_previous_migration'),
        # ... other dependencies
    ]

    operations = [
        # Add indexes for dashboard queries
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_ventas_fecha_venta ON ventas_ventas(fecha_venta);",
            reverse_sql="DROP INDEX IF EXISTS idx_ventas_fecha_venta;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_ordenventa_estado ON ventas_ordenventa(estado);",
            reverse_sql="DROP INDEX IF EXISTS idx_ordenventa_estado;"
        ),
        # Add more indexes as needed
    ]
```

---

### 7. Testing Endpoints

#### Manual Testing with cURL
```bash
# Test sales today
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/sales-today/

# Test pending orders
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/pending-orders/

# Test stock alerts
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/stock-alerts/

# Test recent productions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/recent-productions/

# Test sales trends
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/sales-trends/

# Test top products
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/top-products/

# Test recent purchases
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/recent-purchases/

# Test recent sales
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/recent-sales/
```

---

## Implementation Checklist

### Backend Tasks
- [ X ] Create dashboard app in `apps/dashboard/`
- [ X ] Register app in `settings.py`
- [ X ] Create serializers in `serializers.py`
- [ X ] Create viewset with 8 actions in `viewsets.py`
- [ X ] Create URLs in `urls.py`
- [ X ] Register URLs in main `urls.py`
- [ ] Add database indexes for performance
- [ ] Test all endpoints with sample data
- [ ] Add error handling and logging

### Frontend Tasks

#### Setup & Configuration
- [ X ] Install Nivo charts: `npm install @nivo/core @nivo/line @nivo/bar`
- [ X ] Create types folder with schemas and types
- [ X ] Create API client functions
- [ X ] Create React Query hooks and query keys
- [ X ] Create utility functions (formatters, chart helpers)

#### Components - Cards
- [ X ] Update `DashBoardCards.tsx` to use real data
- [ X ] Add loading skeletons for cards
- [ X ] Add error handling for cards
- [ ] Test all 4 cards with real API data

#### Components - Grid Sections
- [ X ] Implement `GridItemTrends` with Nivo Line chart
- [ X ] Implement `GridItemProducts` with Nivo Bar chart
- [ X ] Implement `GridItemCompras` with table
- [ X ] Implement `GridItemVentas` with table
- [ X ] Add loading states for all grid items
- [ X ] Add error handling for all grid items

#### Polish & Testing
- [ ] Test all components with loading states
- [ ] Test all components with error states
- [ ] Test all components with real data
- [ ] Verify responsive design on mobile/tablet
- [ ] Test auto-refresh functionality (5-10 min intervals)
- [ ] Verify currency formatting (Bs.)
- [ ] Verify date/time formatting
- [ ] Test navigation from tables to detail pages

---

## Notes & Considerations

### Performance
- Dashboard queries should be optimized with proper indexes
- Consider caching frequently accessed data (e.g., Redis)
- React Query handles client-side caching automatically
- Auto-refresh intervals are set to 5-10 minutes to balance freshness and performance

### Data Accuracy
- All monetary values should be in VES (Bolívares)
- Ensure proper Decimal handling in backend to avoid rounding errors
- Validate that aggregations match business logic

### Future Enhancements
- Add date range filters for trends
- Add drill-down capabilities (click chart to see details)
- Add export functionality (PDF/Excel reports)
- Add real-time updates with WebSockets
- Add customizable dashboard layouts
- Add more comparison metrics (week-over-week, month-over-month)

### Adjustments Needed
The viewset code assumes certain model structures. You may need to adjust:
- Field names (e.g., `total_venta_ves` vs `total_ves`)
- Status values (e.g., `'pendiente'` vs `'PENDING'`)
- Relationship names (e.g., `producto_reventa` vs `resale_product`)
- Payment method logic in `_get_payment_method_display()`

Review your actual models and adjust the viewset queries accordingly.

---

## Summary

This implementation plan provides:

1. **4 Indicator Cards** with real-time business metrics
2. **4 Grid Sections** with charts and tables for detailed insights
3. **Complete Backend** with Django app, serializers, viewsets, and URLs
4. **Complete Frontend** with React Query, Nivo charts, Shadcn UI, and proper error handling
5. **Optimized Performance** with caching, indexes, and efficient queries
6. **Production-Ready** code with error handling, loading states, and validation

Follow the checklist to implement each component systematically, testing as you go.
