import { z } from "zod";

// Card Schemas
// NOTE: Many numeric values come from Django DecimalFields and arrive as strings.
// Use z.coerce.number() so we accept both numbers and numeric strings.
export const SalesTodaySchema = z.object({
  total_sales: z.coerce.number(),
  total_transactions: z.number(),
  total_items_sold: z.number(),
  percentage_vs_yesterday: z.coerce.number().optional().nullable(),
});

export const PendingOrdersSchema = z.object({
  total_pending: z.number(),
  due_today: z.number(),
  approaching_deadline: z.number(),
  percentage_vs_yesterday: z.coerce.number().optional().nullable(),
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
  percentage_vs_previous: z.coerce.number().optional().nullable(),
  total_items_produced: z.number().optional().nullable(),
});

// Grid Section Schemas
export const SalesTrendDataSchema = z.object({
  data: z.array(
    z.object({
      date: z.string(),
      total_sales: z.coerce.number(),
    }),
  ),
});

export const TopProductsDataSchema = z.object({
  data: z.array(
    z.object({
      product_name: z.string(),
      quantity_sold: z.number(),
      product_type: z.enum(["resale", "final"]),
    }),
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
      total_amount: z.coerce.number(),
    }),
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
      total_amount: z.coerce.number(),
    }),
  ),
});
