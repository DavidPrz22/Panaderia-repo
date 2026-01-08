# Pagination Implementation for Lots

## Overview
Implement page number-based pagination for lots across all product types: Materia Prima, Productos Finales, Productos Intermedios, and Productos de Reventa. This follows the established pattern from the Ordenes feature using React Query's `useInfiniteQuery` with Django REST Framework's `PageNumberPagination`.

---

## Backend Requirements

### 1. Configure ViewSets with Pagination

For each lots ViewSet, add the `StandardResultsSetPagination` class:

**Files to modify:**
- `backend/djangobackend/apps/inventario/views.py` (or wherever the ViewSets are located)

**ViewSets to update:**
- `LotesMateriaPrimaViewSet`
- `LotesProductosElaboradosViewSet` (Productos Finales)
- `LotesProductosIntermediosViewSet`
- `LotesProductosReventaViewSet`

**Implementation:**
```python
from djangobackend.pagination import StandardResultsSetPagination

class LotesMateriaPrimaViewSet(viewsets.ModelViewSet):
    pagination_class = StandardResultsSetPagination
    # ... rest of the viewset configuration
```

### 2. Verify Pagination Response Format

Ensure each ViewSet's `list` action returns the standard DRF pagination format:
```json
{
  "count": 45,
  "next": "http://localhost:8000/api/lotes-materia-prima/?page=2",
  "previous": null,
  "results": [
    { /* lot object */ }
  ]
}
```

### 3. API Endpoints

Verify these endpoints are available and paginated:
- `/api/lotes-materia-prima/`
- `/api/lotes-productos-finales/` (or `/api/lotes-productos-elaborados/`)
- `/api/lotes-productos-intermedios/`
- `/api/lotes-productos-reventa/`

---

## Frontend Requirements

### 1. Type Definitions

**For each product type, create pagination types in their respective `types/types.ts`:**

```typescript
// Example for Materia Prima
export type LoteMateriaPrimaPagination = {
  count: number;
  next: string | null;
  previous: string | null;
  results: LoteMateriaPrima[]; // Use the existing Lote type
};
```

**Repeat for:**
- `LoteProductoFinalPagination`
- `LoteProductoIntermedioPagination`
- `LoteProductoReventaPagination`

### 2. API Functions

**In each feature's `api/api.ts`, create/update the fetch function:**

```typescript
import type { LoteMateriaPrimaPagination } from "../types/types";

export const getLotesMateriaPrima = async ({
  pageParam,
}: {
  pageParam?: string | null;
} = {}): Promise<LoteMateriaPrimaPagination> => {
  try {
    const url = pageParam || "/api/lotes-materia-prima/";
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching lotes materia prima:", error);
    throw error;
  }
};
```

**Create similar functions for:**
- `getLotesProductosFinales`
- `getLotesProductosIntermedios`
- `getLotesProductosReventa`

### 3. Query Options

**In each feature's `hooks/queries/queryOptions.ts`:**

```typescript
import { getLotesMateriaPrima } from "../../api/api";
import type { LoteMateriaPrimaPagination } from "../../types/types";

export const lotesMateriaPrimaQueryOptions = {
  queryKey: ["lotes-materia-prima"],
  queryFn: getLotesMateriaPrima,
  staleTime: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage: LoteMateriaPrimaPagination) => lastPage.next,
  getPreviousPageParam: (firstPage: LoteMateriaPrimaPagination) => firstPage.previous,
};
```

**Create similar options for:**
- `lotesProductosFinalesQueryOptions`
- `lotesProductosIntermediosQueryOptions`
- `lotesProductosReventaQueryOptions`

### 4. Query Hooks

**In each feature's `hooks/queries/queries.ts`:**

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";
import { lotesMateriaPrimaQueryOptions } from "./queryOptions";

export const useGetLotesMateriaPrima = () => {
  return useInfiniteQuery(lotesMateriaPrimaQueryOptions);
};
```

**Create similar hooks for:**
- `useGetLotesProductosFinales`
- `useGetLotesProductosIntermedios`
- `useGetLotesProductosReventa`

### 5. Component Integration

**In each feature's main index component (e.g., `MateriaPrimaIndex.tsx`):**

#### a. Import Required Dependencies
```typescript
import { useReducer, useMemo } from "react";
import { Paginator } from "@/components/Paginator";
import { useGetLotesMateriaPrima } from "../hooks/queries/queries";
```

#### b. Setup Pagination State
```typescript
type PaginatorActions = "next" | "previous" | "base";

const MateriaPrimaIndex = () => {
  const {
    data: lotesPagination,
    fetchNextPage,
    hasNextPage,
    isFetching: isFetchingLotes,
    isFetched: isFetchedLotes,
  } = useGetLotesMateriaPrima();

  const [page, setPage] = useReducer(
    (state: number, action: { type: PaginatorActions; payload?: number }) => {
      switch (action.type) {
        case "next":
          if (lotesPagination) {
            if (state < lotesPagination.pages.length - 1) return state + 1;
            if (hasNextPage) fetchNextPage();
            return state + 1;
          }
          return state;

        case "previous":
          return state - 1;

        case "base":
          if (lotesPagination) {
            if (
              action.payload! > lotesPagination.pages.length - 1 ||
              action.payload! < 0
            ) {
              if (hasNextPage) fetchNextPage();
              return state + 1;
            }
            return action.payload!;
          }
          return state;

        default:
          return state;
      }
    },
    0
  );
```

#### c. Extract Current Page Data
```typescript
  const lotesTable = lotesPagination?.pages?.[page]?.results || [];

  const pages_count = useMemo(() => {
    const result_count = lotesPagination?.pages[0].count || 1;
    const entry_per_page = lotesPagination?.pages[0].results.length || 1;
    return Math.ceil(result_count / entry_per_page);
  }, [isFetchedLotes]);
```

#### d. Render Paginator Component
```tsx
{/* After the table/list component */}
{pages_count > 1 && (
  <Paginator
    previousPage={page > 0}
    nextPage={hasNextPage || page < pages_count - 1}
    pages={Array.from({ length: pages_count }, (_, i) => i)}
    currentPage={page}
    onClickPrev={() => setPage({ type: "previous" })}
    onClickPage={(p) => setPage({ type: "base", payload: p })}
    onClickNext={() => setPage({ type: "next" })}
  />
)}
```

### 6. Loading States

**Display loading indicator while fetching:**
```tsx
{isFetchingLotes ? (
  <DoubleSpinnerLoading extraClassName="size-20" />
) : (
  <>
    <LotesTable lotes={lotesTable} />
    {pages_count > 1 && <Paginator {...paginatorProps} />}
  </>
)}
```

---

## Implementation Checklist

### Backend
- [ ] Add `StandardResultsSetPagination` to `LotesMateriaPrimaViewSet`
- [ ] Add `StandardResultsSetPagination` to `LotesProductosElaboradosViewSet`
- [ ] Add `StandardResultsSetPagination` to `LotesProductosIntermediosViewSet`
- [ ] Add `StandardResultsSetPagination` to `LotesProductosReventaViewSet`
- [ ] Test each endpoint returns paginated response with 15 items per page

### Frontend - Materia Prima
- [ ] Create `LoteMateriaPrimaPagination` type
- [ ] Create `getLotesMateriaPrima` API function
- [ ] Create `lotesMateriaPrimaQueryOptions`
- [ ] Create `useGetLotesMateriaPrima` hook
- [ ] Update `MateriaPrimaIndex` component with pagination logic
- [ ] Add `Paginator` component to UI
- [ ] Test pagination (next, previous, direct page selection)

### Frontend - Productos Finales
- [ ] Create `LoteProductoFinalPagination` type
- [ ] Create `getLotesProductosFinales` API function
- [ ] Create `lotesProductosFinalesQueryOptions`
- [ ] Create `useGetLotesProductosFinales` hook
- [ ] Update `ProductosFinalesIndex` component with pagination logic
- [ ] Add `Paginator` component to UI
- [ ] Test pagination

### Frontend - Productos Intermedios
- [ ] Create `LoteProductoIntermedioPagination` type
- [ ] Create `getLotesProductosIntermedios` API function
- [ ] Create `lotesProductosIntermediosQueryOptions`
- [ ] Create `useGetLotesProductosIntermedios` hook
- [ ] Update `ProductosIntermediosIndex` component with pagination logic
- [ ] Add `Paginator` component to UI
- [ ] Test pagination

### Frontend - Productos Reventa
- [ ] Create `LoteProductoReventaPagination` type
- [ ] Create `getLotesProductosReventa` API function
- [ ] Create `lotesProductosReventaQueryOptions`
- [ ] Create `useGetLotesProductosReventa` hook
- [ ] Update `ProductosReventaIndex` component with pagination logic
- [ ] Add `Paginator` component to UI
- [ ] Test pagination

---

## Key Implementation Notes

1. **Page Size**: Fixed at 15 items per page (configured in `StandardResultsSetPagination`)
2. **Paginator Visibility**: Only show when `pages_count > 1` (i.e., more than 15 items total)
3. **Caching**: React Query automatically caches each page; pages are only fetched once
4. **Infinite Query**: Using `useInfiniteQuery` with page number-based pagination for efficient data fetching
5. **Page Param**: The `next` and `previous` URLs from Django contain page numbers (e.g., `?page=2`)
6. **Stale Time**: Set to `Infinity` to prevent unnecessary refetches (invalidate manually on mutations)

---

## Testing Scenarios

For each product type:
1. **< 15 items**: Paginator should not appear
2. **15-30 items**: Should show 2 pages
3. **Navigation**: Test next, previous, and direct page selection
4. **Cache**: Navigate to page 2, then back to page 1 - should be instant (cached)
5. **Mutations**: After creating/deleting a lot, pagination should update correctly
6. **Loading States**: Verify spinner shows during initial fetch and page transitions