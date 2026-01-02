# Implementation Plan: Reporting System

This document outlines the plan for implementing the reporting system for the Panaderia System, replacing mock data with real-time data from the backend.

## 1. Backend Development (Django)

### A. New App: `reportes`
Create a dedicated application to handle complex queries and PDF generation.
- **Location:** `backend/djangobackend/apps/reportes/`
- **Purpose:** Avoid cluttering `inventario` and `ventas` with analytical viewsets.

### B. Inventory Reports
Calculations will aggregate data from `MateriasPrimas`, `ProductosElaborados`, `ProductosReventa`, and their respective `Lotes`.

**Endpoints:**
- `GET /api/reportes/inventario/stock-status/`: Returns current stock, reorder point, and available lot count for all components.
- `GET /api/reportes/inventario/materia-prima/`: Specific metrics for raw materials.
- `GET /api/reportes/inventario/productos/`: Metrics for Finished and Intermediate products.

**Serializer Logic:**
- Count active lots (Status = DISPONIBLE).
- Calculate "Days of stock" (optional/future).
- Compare `stock_actual` vs `punto_reorden` for status badge.

### C. Sales Reports (Session-Based)
Focused on `AperturaCierreCaja` and linked transactions.

**Endpoints:**
- `GET /api/reportes/ventas/sesiones/`: List sessions with metadata (cashier, times, cash/card totals).
- `GET /api/reportes/ventas/sesiones/{id}/items-vendidos/`: Aggregated list of items sold during a specific caja session.
- `GET /api/reportes/ventas/pdf/`: Generates a PDF report for a specific date range or session.

**Queries:**
- Use `AperturaCierreCaja` as the entry point.
- Join with `Ventas` -> `DetalleVenta` to sum items sold by product name.

### D. PDF Generation
- **Library:** `reportlab` or `xhtml2pdf`.
- **Functionality:** 
    - Header with bakery logo and timestamp.
    - Table of sessions/sales.
    - Summary section for totals.

---

## 2. Frontend Development (React)

### A. Schemas & Types (`features/Reportes/schemas.ts`)
Define Zod schemas matching the backend response.
- `InventoryReportSchema`
- `SalesReportSchema`
- `SessionDetailSchema` (includes inventory items sold)

### B. API Hooks (`features/Reportes/hooks/`)
- `useInventoryReportQuery`: Fetches stock levels based on category.
- `useSalesSessionsQuery`: Fetches sessions with optional date filtering.
- `useSessionDetailsQuery`: Fetches items sold summary for the details panel.

### C. UI Refinement (`features/Reportes/components/ReportesIndex.tsx`)
- **State Management:** Replace mock constants with data from hooks.
- **Date Filtering:** Sync `startDate` and `endDate` with the API query parameters.
- **Details Panel:** 
    - Implement a `Sheet` or `Dialog` component that opens when a sales row is clicked.
    - **Header:** Session ID, Date, and Cashier name.
    - **Metadata Section:** Display opening/closing times, initial cash, final cash, and discrepancies.
    - **Tabs Component:**
        - **Tab 1: Resumen de Totales:** Breakdown of sales by payment method (Efectivo, Tarjeta, etc.).
        - **Tab 2: Transacciones:** List of all individual `Ventas` linked to this session.
        - **Tab 3: Artículos Vendidos:** Aggregated list showing total quantity and revenue for each product sold (e.g., "Pan Francés - 50 units - $12.50").
- **PDF Export:** 
    - Add a loading state during PDF generation.
    - Implement file download service that calls the backend endpoint with current filters.

---

## 3. Implementation Steps

### Phase 1: Backend Foundation ✅
1. [x] Create `reportes` app and register it.
2. [x] Implement `InventoryItemSerializer` and `SessionReportSerializer`.
3. [x] Create `InventoryReportViewSet` with basic filtering.
4. [x] Create `SalesReportViewSet` fetching data from `AperturaCierreCaja`.

### Phase 2: Frontend Data Hookup ✅
1. [x] Define Zod schemas in `features/Reportes/schemas.ts`.
2. [x] Create API service functions in `features/Reportes/api/api.ts`.
3. [x] Update `ReportesIndex.tsx` to use `useInventoryReportQuery` and `useSalesSessionsQuery`.

### Phase 3: Detailed Reporting & PDF ✅
1. [x] Implement items aggregation logic in the backend for "Items Sold by Opening".
2. [x] Add `PDFView` or similar in the backend for document generation.
3. [x] Finish the "Details Panel" in the frontend UI.
4. [x] Connect "Download PDF" button to the backend endpoint.

### Phase 4: Testing & Polish
1. [ ] Verify stock counts match actual data in database.
2. [ ] Test date filtering across months/years.
3. [ ] Ensure PDF format is professional and matches the branding.
