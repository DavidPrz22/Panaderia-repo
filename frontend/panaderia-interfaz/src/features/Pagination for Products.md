# Implementation Plan: Page-Based Pagination for Core Features

This plan outlines the steps to implement server-side (offset) pagination for the main data lists in **Materias Primas**, **Productos Intermedios**, **Productos Finales**, **Productos de Reventa**, and **Recetas**.

## 1. Objective
Enable server-side pagination with a standard size of **15 items per page** to improve performance and scalability across all inventory and production lists.

## 2. Backend Requirements (Django REST Framework)

### Pagination Service
- **Location**: `backend/djangobackend/djangobackend/pagination.py`
- **Class**: `StandardResultsSetPagination` (already configured with `page_size = 15`).

### ViewSets to Update
Update the following ViewSets in `backend/djangobackend/apps/inventario/viewsets.py` and `backend/djangobackend/apps/produccion/viewsets.py` (if applicable) by adding `pagination_class = StandardResultsSetPagination`:

- `MateriaPrimaViewSet`
- `ProductosIntermediosViewSet`
- `ProductosFinalesViewSet`
- `ProductosReventaViewSet`
- `RecetasViewSet` (Check `apps/produccion/viewsets.py`)

### API Response Format
The endpoints will now return:
```json
{
  "count": 100,
  "next": "http://api.example.com/api/feature/?page=2",
  "previous": null,
  "results": [...]
}
```

## 3. Frontend Requirements (React)

### Common Components
- **Paginator**: `frontend/panaderia-interfaz/src/components/Paginator.tsx`
- **Loading State**: `frontend/panaderia-interfaz/src/components/DoubleSpinnerLoading.tsx`

### Feature Implementation Steps (Repeated for each feature)

#### A. API Service (`api/api.ts`)
Update the list fetching function to accept an optional `pageParam`.
```typescript
export const getFeatureData = async ({ pageParam }: { pageParam?: string | null } = {}) => {
  const url = pageParam || "/api/feature-endpoint/";
  const response = await apiClient.get(url);
  return response.data;
};
```

#### B. Query Options (`hooks/queries/queryOptions.ts`)
Update to include infinite query parameters:
```typescript
export const featureQueryOptions = {
  queryKey: ["feature-list"],
  queryFn: getFeatureData,
  initialPageParam: null,
  getNextPageParam: (lastPage) => lastPage.next,
  getPreviousPageParam: (firstPage) => firstPage.previous,
};
```

#### C. Hooks (`hooks/queries/queries.ts`)
Switch from `useQuery` to `useInfiniteQuery`.

#### D. Main View (`components/XIndex.tsx` or `XLista.tsx`)
- Implement a `page` state (using `useReducer` for clean transitions).
- Calculate `pages_count` using the `count` from the first page of results.
- Render the `Paginator` component below the table.
- Display only the `results` from the current page: `data.pages[page].results`.

## 4. Features & Locations

| Feature | Frontend Directory | Backend ViewSet |
| :--- | :--- | :--- |
| **Materias Primas** | `features/MateriaPrima` | `MateriaPrimaViewSet` |
| **Productos Finales** | `features/ProductosFinales` | `ProductosFinalesViewSet` |
| **Productos Intermedios** | `features/ProductosIntermedios` | `ProductosIntermediosViewSet` |
| **Productos Reventa** | `features/ProductosReventa` | `ProductosReventaViewSet` |
| **Recetas** | `features/Recetas` | `RecetasViewSet` |

## 5. UI/UX Behavior
- **Caching**: Data for visited pages will be cached (`staleTime: Infinity`) to allow instant back-navigation.
- **Search & Filters**: Ensure that changing filters resets the `page` state to 0.
- **Detail Panel**: Clicking a row should still open the details panel as per current behavior.

---

## 6. Step-by-Step Implementation Guide

### Phase 1: Backend Configuration

#### Step 1.1: Update ViewSets with Pagination and Ordering

For each ViewSet listed in section 2, add the pagination class **and ensure proper queryset ordering**:

**File**: `backend/djangobackend/apps/inventario/viewsets.py`

```python
from djangobackend.pagination import StandardResultsSetPagination

class MateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = MateriasPrimas.objects.all().order_by('id')  # ADD ORDERING
    serializer_class = MateriaPrimaSerializer
    permission_classes = [IsStaffOrVendedorReadOnly]
    pagination_class = StandardResultsSetPagination  # ADD PAGINATION
```

**Important**: Apply the same pattern to all ViewSets:

```python
# ProductosIntermediosViewSet
class ProductosIntermediosViewSet(viewsets.ModelViewSet):
    queryset = ProductosIntermedios.objects.all().order_by('id')
    serializer_class = ProductosIntermediosSerializer
    permission_classes = [IsStaffOrVendedorReadOnly]
    pagination_class = StandardResultsSetPagination

# ProductosFinalesViewSet
class ProductosFinalesViewSet(viewsets.ModelViewSet):
    queryset = ProductosFinales.objects.all().order_by('id')
    serializer_class = ProductosFinalesSerializer
    permission_classes = [IsStaffOrVendedorReadOnly]
    pagination_class = StandardResultsSetPagination

# ProductosReventaViewSet
class ProductosReventaViewSet(viewsets.ModelViewSet):
    queryset = ProductosReventa.objects.all().order_by('id')
    serializer_class = ProductosReventaSerializer
    permission_classes = [IsStaffOrVendedorReadOnly]
    pagination_class = StandardResultsSetPagination
```

**File**: `backend/djangobackend/apps/produccion/viewsets.py`

```python
class RecetasViewSet(viewsets.ModelViewSet):
    queryset = Recetas.objects.all().order_by('id')  # ADD ORDERING
    serializer_class = RecetasSerializer
    permission_classes = [IsStaffLevelOnly]
    pagination_class = StandardResultsSetPagination  # ADD PAGINATION
```

**Why Ordering is Critical:**
- **Consistency**: Without explicit ordering, Django uses database-dependent default ordering, which can change between queries
- **Pagination Integrity**: Unordered querysets can return duplicate or missing items across pages
- **Predictability**: Users expect the same order when navigating back to a previously viewed page

**Ordering Options:**
- `order_by('id')` - Default, ensures consistent ordering by primary key (ascending)
- `order_by('-id')` - Reverse order (newest first)
- `order_by('fecha_creacion_registro')` - Order by creation date
- `order_by('nombre')` - Alphabetical ordering

**Recommendation**: Use `order_by('id')` for consistency unless there's a specific business requirement for different ordering.


#### Step 1.2: Test Backend Endpoints
Verify pagination is working by testing endpoints:
```bash
curl http://localhost:8000/api/materiaprima/
curl http://localhost:8000/api/productosfinales/
curl http://localhost:8000/api/productosintermedios/
curl http://localhost:8000/api/productosreventa/
curl http://localhost:8000/api/recetas/
```

Expected response structure:
```json
{
  "count": 45,
  "next": "http://localhost:8000/api/materiaprima/?page=2",
  "previous": null,
  "results": [/* 15 items */]
}
```

---

### Phase 2: Frontend Implementation (Per Feature)

Follow these steps for **each** feature (Materias Primas, Productos Finales, Productos Intermedios, Productos Reventa, Recetas):

#### Step 2.1: Update Types

**File**: `features/[Feature]/types/types.ts`

Add pagination type:
```typescript
export type [Feature]Pagination = {
  count: number;
  next: string | null;
  previous: string | null;
  results: [FeatureType][];
};
```

Example for Materias Primas:
```typescript
export type MateriaPrimaPagination = {
  count: number;
  next: string | null;
  previous: string | null;
  results: MateriaPrimaList[];
};
```

#### Step 2.2: Update API Service

**File**: `features/[Feature]/api/api.ts`

Modify the list fetching function to support `pageParam`:

```typescript
// BEFORE
export const handleMateriaPrimaList = async (): Promise<MateriaPrimaList[]> => {
  const response = await apiClient.get("/api/materiaprima/");
  return response.data.map(/* mapping logic */);
};

// AFTER
export const handleMateriaPrimaList = async ({ 
  pageParam 
}: { 
  pageParam?: string | null 
} = {}): Promise<MateriaPrimaPagination> => {
  const url = pageParam || "/api/materiaprima/";
  const response = await apiClient.get(url);
  return response.data; // Return the full pagination object
};
```

**Important**: Remove any data mapping at this stage - the backend now returns the pagination wrapper.

#### Step 2.3: Update Query Options

**File**: `features/[Feature]/hooks/queries/[feature]QueryOptions.ts`

Update the query options to support infinite queries:

```typescript
// BEFORE
export const createMateriaPrimaListQueryOptions = () => {
  return {
    queryKey: ["materiaPrimaList"],
    queryFn: () => handleMateriaPrimaList(),
    staleTime: Infinity,
  };
};

// AFTER
export const createMateriaPrimaListQueryOptions = () => {
  return {
    queryKey: ["materiaPrimaList"],
    queryFn: ({ pageParam }: { pageParam?: string | null }) => 
      handleMateriaPrimaList({ pageParam }),
    staleTime: Infinity,
    initialPageParam: null,
    getNextPageParam: (lastPage: MateriaPrimaPagination) => lastPage.next,
    getPreviousPageParam: (firstPage: MateriaPrimaPagination) => firstPage.previous,
  };
};
```

#### Step 2.4: Update Query Hook

**File**: `features/[Feature]/hooks/queries/queries.ts`

Switch from `useQuery` to `useInfiniteQuery`:

```typescript
// BEFORE
import { useQuery } from "@tanstack/react-query";

export const useGetMateriaPrima = () => {
  return useQuery(createMateriaPrimaListQueryOptions());
};

// AFTER
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetMateriaPrima = () => {
  return useInfiniteQuery(createMateriaPrimaListQueryOptions());
};
```

#### Step 2.5: Update Main Component (Context-Based Filtering Features)

For features using **context-side filtering** (like Materias Primas):

**File**: `features/MateriaPrima/components/MateriaPrimaLista.tsx`

```typescript
import { useMemo, useReducer } from "react";
import { Paginator } from "@/components/Paginator";

type PaginatorActions = "next" | "previous" | "base";

export default function MateriaPrimaLista() {
  const { 
    data: materiaPrimaPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useGetMateriaPrima();

  const [page, setPage] = useReducer(
    (state: number, action: { type: PaginatorActions; payload?: number }) => {
      switch (action.type) {
        case "next":
          if (materiaPrimaPagination) {
            if (state < materiaPrimaPagination.pages.length - 1) return state + 1;
            if (hasNextPage) fetchNextPage();
            return state + 1;
          }
          return state;
        case "previous":
          return state - 1;
        case "base":
          if (materiaPrimaPagination) {
            if (action.payload! > materiaPrimaPagination.pages.length - 1) {
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

  const pages_count = useMemo(() => {
    const result_count = materiaPrimaPagination?.pages[0]?.count || 1;
    const entry_per_page = 15;
    return Math.ceil(result_count / entry_per_page);
  }, [materiaPrimaPagination]);

  const currentPageData = materiaPrimaPagination?.pages?.[page]?.results || [];

  return (
    <>
      <div className="relative mx-8 border border-gray-200 rounded-md min-h-[80%]">
        <TableHeader headers={[/* ... */]} />
        <TableBody data={currentPageData} />
      </div>
      
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
    </>
  );
}
```

#### Step 2.6: Update TableBody Component (Component-Side Filtering Features)

For features using **component-side filtering** (like Productos Finales):

**File**: `features/ProductosFinales/components/PFTableBody.tsx`

```typescript
export const PFTableBody = () => {
  const { data: productosPagination, isFetching } = useGetProductosFinales();
  const { 
    productosFinalesSearchTerm,
    selectedUnidadesVenta,
    selectedCategoriasProductoFinal,
    currentPage, // ADD TO CONTEXT
    setCurrentPage, // ADD TO CONTEXT
  } = useProductosFinalesContext();

  // Get current page data
  const currentPageData = productosPagination?.pages?.[currentPage]?.results || [];

  // Apply filters to current page data
  let displayData = currentPageData;

  if (productosFinalesSearchTerm) {
    const term = productosFinalesSearchTerm.toLowerCase();
    displayData = displayData.filter(
      (p) =>
        p.nombre_producto.toLowerCase().includes(term) ||
        p.SKU.toLowerCase().includes(term) ||
        (p.categoria || "").toLowerCase().includes(term)
    );
  }

  if (selectedUnidadesVenta.length > 0) {
    displayData = displayData.filter((p) =>
      selectedUnidadesVenta.includes(p.unidad_venta)
    );
  }

  // ... rest of filtering logic

  return (
    <>
      {isFetching ? (
        <PendingTubeSpinner />
      ) : displayData.length > 0 ? (
        <PFTableRows data={displayData} />
      ) : (
        <EmptyState />
      )}
    </>
  );
};
```

#### Step 2.7: Update Context (if applicable)

**File**: `context/[Feature]Context.tsx`

Add pagination state to context:

```typescript
type ContextType = {
  // ... existing state
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export const FeatureProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedFilters]);

  return (
    <Context.Provider value={{ 
      /* ... */,
      currentPage,
      setCurrentPage,
    }}>
      {children}
    </Context.Provider>
  );
};
```

---

### Phase 3: Testing & Validation

#### Step 3.1: Functional Testing
For each feature, verify:
- [ ] Initial page loads with 15 items
- [ ] Clicking "Next" loads page 2
- [ ] Clicking "Previous" returns to page 1
- [ ] Clicking specific page number jumps correctly
- [ ] Paginator hides when total items ≤ 15
- [ ] Search/filters reset to page 0
- [ ] Row click still opens detail panel
- [ ] Loading states display correctly

#### Step 3.2: Performance Testing
- [ ] Verify network requests only fire for new pages
- [ ] Confirm visited pages load instantly (cached)
- [ ] Check no memory leaks with rapid page switching

#### Step 3.3: Edge Cases
- [ ] Empty state (0 items)
- [ ] Single page (1-15 items)
- [ ] Exactly 15 items (boundary)
- [ ] Large datasets (100+ items)

---

### Phase 4: Cleanup & Optimization

#### Step 4.1: Remove Old Mapping Logic
If the API previously returned raw arrays and you mapped them in the frontend, remove that mapping since the backend now handles it.

#### Step 4.2: Update Query Invalidation
Ensure mutations still invalidate the correct query keys:

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["materiaPrimaList"] });
}
```

#### Step 4.3: Document Changes
Update any relevant documentation or comments explaining the pagination implementation.

---

## 7. Implementation Checklist

Use this checklist to track progress across all features:

### Backend
- [ ] `MateriaPrimaViewSet` - Add pagination class
- [ ] `ProductosFinalesViewSet` - Add pagination class
- [ ] `ProductosIntermediosViewSet` - Add pagination class
- [ ] `ProductosReventaViewSet` - Add pagination class
- [ ] `RecetasViewSet` - Add pagination class
- [ ] Test all endpoints return pagination format

### Frontend - Materias Primas
- [ ] Update types with pagination type
- [ ] Update API service with `pageParam`
- [ ] Update query options for infinite query
- [ ] Switch to `useInfiniteQuery`
- [ ] Add page state management
- [ ] Integrate Paginator component
- [ ] Update context with page state
- [ ] Test all functionality

### Frontend - Productos Finales
- [ ] Update types with pagination type
- [ ] Update API service with `pageParam`
- [ ] Update query options for infinite query
- [ ] Switch to `useInfiniteQuery`
- [ ] Add page state management
- [ ] Integrate Paginator component
- [ ] Update context with page state
- [ ] Test all functionality

### Frontend - Productos Intermedios
- [ ] Update types with pagination type
- [ ] Update API service with `pageParam`
- [ ] Update query options for infinite query
- [ ] Switch to `useInfiniteQuery`
- [ ] Add page state management
- [ ] Integrate Paginator component
- [ ] Update context with page state
- [ ] Test all functionality

### Frontend - Productos Reventa
- [ ] Update types with pagination type
- [ ] Update API service with `pageParam`
- [ ] Update query options for infinite query
- [ ] Switch to `useInfiniteQuery`
- [ ] Add page state management
- [ ] Integrate Paginator component
- [ ] Update context with page state
- [ ] Test all functionality

### Frontend - Recetas
- [ ] Update types with pagination type
- [ ] Update API service with `pageParam`
- [ ] Update query options for infinite query
- [ ] Switch to `useInfiniteQuery`
- [ ] Add page state management
- [ ] Integrate Paginator component
- [ ] Update context with page state (if applicable)
- [ ] Test all functionality
