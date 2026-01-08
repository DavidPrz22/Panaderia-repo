# Pagination Implementation with React Query

This document explains how pagination is implemented in features like **Ordenes**, leveraging `@tanstack/react-query` to handle server-side paginated data from a Django REST Framework (DRF) backend.

## 1. Query Configuration

Pagination is typically implemented using `useInfiniteQuery` (or a wrapper around it) to easily manage multiple pages of data.

### Query Options (`queryOptions.ts`)
The query options define how to retrieve the next and previous pages based on the backend response (which usually includes `next` and `previous` URL strings).

```typescript
export const ordenesTableQueryOptions = {
  queryKey: ["ordenes-table"],
  queryFn: getOrdenes,
  staleTime: Infinity,
  initialPageParam: null,
  getNextPageParam: (lastPage: OrdenesPagination) => lastPage.next,
  getPreviousPageParam: (firstPage: OrdenesPagination) => firstPage.previous,
};
```

## 2. API Handler

The API function must support an optional `pageParam`. If provided, this absolute URL from the backend is used instead of the base endpoint.

```typescript
export const getOrdenes = async ({ pageParam }: { pageParam?: string | null } = {}) => {
  const url = pageParam || "/api/ordenes/";
  const response = await apiClient.get(url);
  return response.data;
};
```

## 3. Managing Pagination State in Components

In the main feature component (e.g., `OrdenesIndex.tsx`), we manage the current "view" page and trigger fetches for new data.

### State Management
A `useReducer` is often used to manage the current active page index and handle complex transitions:

- **next**: Increments the page index. If the index exceeds cached pages, it calls `fetchNextPage()`.
- **previous**: Decrements the page index.
- **base**: Jumps to a specific page index, triggering a fetch if necessary.

```typescript
const [page, setPage] = useReducer((state, action) => {
  switch (action.type) {
    case "next":
      if (hasNextPage && state === ordenesPagination.pages.length - 1) {
        fetchNextPage();
      }
      return state + 1;
    case "previous":
      return state - 1;
    // ... base case
  }
}, 0);
```

### Derived Stats
We calculate the total number of pages based on the total count provided by the backend:

```typescript
const pages_count = useMemo(() => {
  const result_count = ordenesPagination?.pages[0].count || 1;
  const entry_per_page = 15; // Standard page size
  return Math.ceil(result_count / entry_per_page);
}, [ordenesPagination]);
```

## 4. UI Rendering

The `Table` component displays only the data for the current page:

```tsx
const currentPageData = ordenesPagination?.pages?.[page]?.results || [];

return (
  <>
    <OrdersTable orders={currentPageData} />
    <Paginator
      currentPage={page}
      pagesCount={pages_count}
      onNext={() => setPage({ type: "next" })}
      onPrev={() => setPage({ type: "previous" })}
      onPageClick={(p) => setPage({ type: "base", payload: p })}
    />
  </>
);
```

## 5. Key Benefits
- **Caching**: Previously viewed pages remain in memory (`staleTime: Infinity`), making back-and-forth navigation instant.
- **On-Demand Loading**: Pages are only fetched when the user actually requests them.
- **Seamless Integration**: Works naturally with DRF's `StandardResultsSetPagination`.
