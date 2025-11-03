# ProductosFinales Feature Architecture

## Overview
The ProductosFinales (Final Products) feature manages finished products that are ready for sale. This feature follows a modular, type-safe architecture using React, TypeScript, React Hook Form, Zod validation, and TanStack Query for data management.

---

## 📁 Directory Structure

```
ProductosFinales/
├── api/                    # API client functions
├── components/             # React components
├── hooks/                  # Custom React hooks
│   ├── mutations/         # TanStack Query mutations
│   └── queries/           # TanStack Query queries
├── schemas/               # Zod validation schemas
└── types/                 # TypeScript type definitions
```

---

## 🏗️ Architecture Layers

### 1. **Types Layer** (`types/types.ts`)
Defines all TypeScript interfaces and types used throughout the feature.

#### Core Domain Types
- `ProductoFinal`: List view representation of a final product
- `ProductoFinalDetalles`: Detailed view with full product information
- `LotesProductosFinales`: Production batch/lot information
- `receta_relacionada`: Related recipe data (can be false or object)

#### Supporting Types
- `CategoriaProductoFinal`: Product category
- `UnidadesDeMedida`: Measurement units
- `recetasSearchItem`: Recipe search results

#### Form & Component Props Types
- `ProductosFinalesFormSharedProps`: Shared form component props
- `PFFormInputContainerProps`: Input container props
- `PFFormSelectContainerProps`: Select container props
- `PFFormInputProps`: Basic input props
- `setValueProps`, `watchSetValueProps`: Form state management props

**Design Pattern:** Centralized type definitions ensure type safety across the entire feature.

---

### 2. **Schema Layer** (`schemas/schemas.ts`)
Uses Zod for runtime validation and type inference.

#### Product Schema
```typescript
productoFinalSchema = {
  nombre_producto: string (min 1 char)
  SKU: string (min 4 chars)
  descripcion: string (optional, 3-250 chars)
  tipo_medida_fisica: enum ["UNIDAD", "PESO", "VOLUMEN"]
  categoria: number (min 0)
  receta_relacionada: number (min 0)
  precio_venta_usd: number (min 0)
  unidad_venta: number (min 0)
  punto_reorden: number (min 0)
  unidad_produccion: number (min 1)
  vendible_por_medida_real: boolean
}
```

**Key Features:**
- Runtime validation at form submission
- Automatic TypeScript type inference via `z.infer<>`
- Custom validation rules (character limits, numeric constraints)
- Integration with React Hook Form via `@hookform/resolvers/zod`

**Design Pattern:** Schema-first validation ensures data integrity before it reaches the API.

---

### 3. **API Layer** (`api/api.ts`)
Centralized API communication using axios client.

#### Core CRUD Operations
- `getProductosFinales()`: Fetch all products (list view)
- `getProductoFinalDetalles(id)`: Fetch single product details
- `registerProductoFinal(data)`: Create new product
- `updateProductoFinal(id, data)`: Update existing product
- `deleteProductoFinal(id)`: Delete product

#### Related Operations
- `getRecetasSearch(search)`: Search for recipes
- `removeRecetaRelacionada(id)`: Unlink related recipe
- `getLotesProductosFinales(id)`: Get product lots/batches
- `changeEstadoLoteProductosFinales(id)`: Change lot status

#### Supporting Operations
- `getUnidadesMedida()`: Fetch measurement units
- `getCategoriasProductoFinal()`: Fetch product categories

**Design Pattern:** 
- Single responsibility - each function handles one API operation
- Consistent error handling with try-catch blocks
- Typed return values using TypeScript generics
- All operations are async/await based

---

### 4. **Hooks Layer**

#### 4.1 Queries (`hooks/queries/`)

##### `productosFinalesQueryOptions.ts`
Defines TanStack Query configurations:

```typescript
productosFinalesQueryOptions()          // List all products
productoFinalDetallesQueryOptions(id)   // Product details by ID
unidadesMedidaQueryOptions              // Measurement units
categoriasProductoFinalQueryOptions     // Product categories
lotesProductosFinalesQueryOptions(id)   // Product lots by product ID
```

**Key Features:**
- `staleTime: Infinity` - Data never becomes stale (manual invalidation only)
- Centralized query key management
- Type-safe query function bindings

##### `queries.ts`
Custom hooks that wrap TanStack Query's `useQuery`:

```typescript
useGetProductosFinales()              // List query
useProductoFinalDetalles(id)          // Details query (enabled when id exists)
useGetParametros()                    // Parallel queries for dropdowns
useGetLotesProductosFinales(id)       // Lots query
```

**Design Pattern:** 
- Separation of query configuration (options) from usage (hooks)
- `useQueries` for parallel data fetching (dropdown data)
- Conditional query enablement via `enabled` flag

#### 4.2 Mutations (`hooks/mutations/productosFinalesMutations.ts`)
Handles data modifications with automatic cache invalidation:

##### CRUD Mutations
- `useCreateProductoFinal()`: Create product
  - Invalidates: `productosFinales`, `finalesSearch` (production search)
  
- `useUpdateProductoFinal()`: Update product
  - Invalidates: `productosFinales`, specific product details, `finalesSearch`
  
- `useDeleteProductoFinal()`: Delete product
  - Invalidates: `productosFinales`
  - Removes: specific product details query

##### Specialized Mutations
- `useGetRecetasSearchMutation()`: Search recipes (mutation pattern for search)
- `useRemoveRecetaRelacionadaMutation()`: Unlink recipe
  - Invalidates: specific product details
  
- `useChangeEstadoLoteProductosFinales()`: Toggle lot status
  - Invalidates: product lots, products list

**Design Pattern:**
- Optimistic updates via cache invalidation
- Query removal for deleted entities (prevents stale data)
- Cross-feature invalidation (e.g., invalidating production search)
- Context integration for accessing current product ID

---

### 5. **Components Layer** (`components/`)

#### Component Categories

##### 5.1 Main Container Components
- **`ProductosFinalesPanel.tsx`**: Main feature container
  - Manages global context state
  - Fetches and distributes dropdown data (units, categories)
  - Conditionally renders list/form/details views

##### 5.2 List & Table Components
- **`ProductosFinalesLista.tsx`**: Products list container
- **`PFTableBody.tsx`**: Table body wrapper
- **`PFTablerows.tsx`**: Multiple rows container
- **`PFTablerow.tsx`**: Individual product row
- **`PFHeader.tsx`**: Table header

##### 5.3 Details Components
- **`ProductosFinalesDetalles.tsx`**: Product details view
- **`DetailsTable.tsx`**: Details display table
- **`PFLotesDetailsContainer.tsx`**: Lots section container
- **`PFLotesTable.tsx`**: Lots table
- **`PFLotesHeader.tsx`**: Lots table header
- **`PFLotesBody.tsx`**: Lots table body
- **`PFLotesDetails.tsx`**: Individual lot details

##### 5.4 Form Components
- **`ProductosFinalesForma.tsx`**: Create form wrapper
- **`ProductosFinalesFormShared.tsx`**: Shared form logic (create/update)
- **`PFFormInputContainer.tsx`**: Input field container with label & validation
- **`PFFormSelectContainer.tsx`**: Select field container with label & validation
- **`PFInputForm.tsx`**: Base input component
- **`PFInputFormSearch.tsx`**: Search input variant

##### 5.5 Search & Filter Components
- **`FilterSearch.tsx`**: Main search bar
- **`FilterButton.tsx`**: Filter toggle button
- **`FiltersPanel.tsx`**: Advanced filters panel
- **`SearchInput.tsx`**: Generic search input

##### 5.6 Specialized Components
- **`RecetaSearchContainer.tsx`**: Recipe search/selection
- **`RecetaFieldValue.tsx`**: Recipe field display
- **`DeleteComponent.tsx`**: Delete confirmation dialog
- **`PendingTubeSpinner.tsx`**: Loading indicator

**Component Design Patterns:**

1. **Container/Presentational Pattern**
   - Containers: Handle data fetching and state
   - Presentational: Focus on UI rendering

2. **Composition Pattern**
   - Small, focused components
   - Composed into larger features
   - Reusable across the feature

3. **Props Drilling Prevention**
   - Context API usage (`useProductosFinalesContext`)
   - Reduces prop passing complexity

4. **Form Abstraction**
   - `ProductosFinalesFormShared` handles both create and update
   - Single source of truth for form logic
   - React Hook Form integration for state management

---

## 🔄 Data Flow

### Read Flow (Query)
```
Component → Custom Hook → Query Options → API Function → Backend
                ↓
          TanStack Query Cache
                ↓
          Component Re-render
```

### Write Flow (Mutation)
```
User Action → Form Submission → Mutation Hook → API Function → Backend
                                      ↓
                            Cache Invalidation
                                      ↓
                            Automatic Refetch
                                      ↓
                            Component Re-render
```

### Context Flow
```
ProductosFinalesPanel (loads dropdown data)
            ↓
    Context Provider
            ↓
    Child Components (access via useProductosFinalesContext)
```

---

## 🎨 Key Design Decisions

### 1. **Centralized Query Management**
- All query configurations in `productosFinalesQueryOptions.ts`
- Reusable across components and mutations
- Consistent query key structure prevents cache issues

### 2. **Infinite Stale Time**
- Data never auto-refreshes (manual control)
- Predictable cache behavior
- Reduced unnecessary API calls

### 3. **Atomic Form Components**
- Each form field is a reusable component
- Consistent validation UI
- Type-safe props via generics

### 4. **Search as Mutation**
- Recipe search uses mutation pattern (not query)
- Allows manual trigger control
- Better UX for search-as-you-type scenarios

### 5. **Separation of Concerns**
- Types: Data structure definitions
- Schemas: Validation rules
- API: Network communication
- Hooks: Data fetching logic
- Components: UI rendering

---

## 🔧 Integration Points

### External Dependencies
- **Context**: `@/context/ProductosFinalesContext`
- **API Client**: `@/api/client`
- **Shared Components**: `@/components/Button`
- **Production Feature**: Invalidates production search cache

### Backend Integration
- Base URL: `/api/`
- Endpoints:
  - `/api/productosfinales/` (CRUD)
  - `/api/productosfinales-detalles/:id/` (Read details)
  - `/api/productoselaborados/:id/lotes/` (Lots)
  - `/api/recetas-search/list_recetas/` (Recipe search)
  - `/api/unidades-medida/` (Measurement units)
  - `/api/categorias-producto-final/` (Categories)

---

## 📊 State Management Strategy

### Server State (TanStack Query)
- Products list
- Product details
- Lots data
- Dropdown data (units, categories)

### Local State (React Hook Form)
- Form inputs
- Validation errors
- Field-level state

### Global State (Context)
- Current view (list/form/details)
- Selected product ID
- Dropdown options cache
- UI state (modals, panels)

**Rationale:** Clear separation between server, local, and global state prevents conflicts and improves maintainability.

---

## 🚀 Performance Optimizations

1. **Parallel Queries**: `useGetParametros()` fetches dropdown data simultaneously
2. **Query Caching**: TanStack Query prevents duplicate requests
3. **Selective Invalidation**: Only invalidate affected queries
4. **Lazy Loading**: Details/lots only fetch when needed (enabled flag)
5. **Component Memoization**: Potential for React.memo on list items

---

## 🔐 Type Safety Features

1. **End-to-End Types**: From API response to component props
2. **Schema Inference**: Zod automatically generates types from schemas
3. **Generic Props**: Form components use `Path<T>` for type-safe field names
4. **Discriminated Unions**: `receta_relacionada` type handles false/object cases
5. **Strict Null Checks**: Explicit handling of nullable fields

---

## 🧪 Testing Considerations

### Unit Testing Targets
- Validation schemas (Zod)
- API functions (mock axios)
- Custom hooks (React Testing Library)
- Form components (user interactions)

### Integration Testing Targets
- Form submission flow
- Cache invalidation behavior
- Context provider integration
- Multi-step user workflows

---

## 📝 Future Improvements

1. **Code Splitting**: Lazy load details/form components
2. **Virtual Scrolling**: For large product lists
3. **Optimistic Updates**: Update UI before server confirmation
4. **Error Boundaries**: Graceful error handling
5. **Accessibility**: ARIA labels, keyboard navigation
6. **Internationalization**: Multi-language support

---

## 🔗 Related Features

- **Production**: Lots creation, product elaboration
- **Recipes**: Recipe assignment to products
- **Inventory**: Stock management
- **Sales**: Product pricing and units

---

## 📚 References

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

**Last Updated**: 2025-09-30  
**Maintained By**: Development Team  
**Feature Status**: Production Ready
