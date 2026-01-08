# Summary of Data Listing Implementation

This document summarizes the architecture and implementation details for data listing in tables across the main features of the Panaderia System: **Materias Primas**, **Productos Finales**, **Productos Intermedios**, **Productos Reventa**, and **Recetas**.

## 1. Architectural Pattern

All listing features follow a modular and consistent architecture:
- **Data Fetching**: Powered by `@tanstack/react-query` using standardized `QueryOptions` and a central `apiClient` (Axios wrapper).
- **State Management**: Uses React **Context API** (e.g., `ProductosFinalesContext`, `MateriaPrimaContext`) to manage search terms, filter states, and cached data.
- **Component Hierarchy**:
  - `XLista.tsx`: Main container that handles layout and manages the "Loading Details" overlay.
  - `XTableHeader.tsx`: Renders the table headers.
  - `XTableBody.tsx`: Handles data selection (filtered vs. cached), loading states (spinners), and empty states.
  - `XTableRows.tsx` / `XTableRow.tsx`: Renders the actual rows and handles row-click interactions (usually opening a details panel).

## 2. Shared Data Fetching Logic

Most features define their query options in a `hooks/queries/` directory.

### Common Patterns:
- **`staleTime: Infinity`**: Often used for base lists to reduce unnecessary refetching, relying on manual invalidation after mutations.
- **Pagination**: For **Lots** (Lotes), `useInfiniteQuery` is used to handle paginated results from the backend.
- **Mapping**: API responses (often in Spanish SNR) are mapped to cleaner frontend types (e.g., `nombre` -> `name`).

## 3. Feature-Specific Details

| Feature | Endpoint | Main Type | Key Columns in Table |
| :--- | :--- | :--- | :--- |
| **Materias Primas** | `/api/materiaprima/` | `MateriaPrimaList` | ID, Nombre, Unidad, Categoría, Stock, P. Reorden |
| **Productos Finales** | `/api/productosfinales/` | `ProductoFinal` | ID, Nombre, SKU, Precio (USD), Stock, Categoría |
| **Productos Intermedios** | `/api/productosintermedios/` | `ProductosIntermedios` | ID, Nombre, SKU, Stock, P. Reorden, Categoría |
| **Productos Reventa** | `/api/productosreventa/` | `ProductosReventa` | ID, Nombre, SKU, Precio (USD), Stock, Categoría |
| **Recetas** | `/api/recetas/` | `recetaItem` | ID, Nombre, Fecha de Creación |

## 4. Implementation of Filtering and Search

The system employs two main strategies for filtering:

1.  **Context-Side Filtering (Materia Prima)**:
    - The `MateriaPrimaContext` manages multiple lists: `cached`, `filtered`, and `filteredInputSearch`.
    - Logic determines which list to display based on flags like `inputfilterDoubleApplied`.
2.  **Component-Side Filtering (Productos Finales/Intermedios/Reventa)**:
    - The `TableBody` component retrieves the full list and the filter state from Context.
    - It applies `.filter()` and `.sort()` logic inline before rendering.
    - Filters include: **Search Term** (text), **Categoría** (multi-select), **Unidad** (multi-select), and status toggles (**Bajo Stock**, **Agotados**).

## 5. Lots (Lotes) Pagination

For inventory items (Materias Primas and Products), the system displays a secondary paginated table for Lots:
- **Endpoint**: `/api/lotes<feature>/?<query_params>`
- **Logic**: Implemented using React Query's pagination structure (`count`, `next`, `previous`, `results`).
- **Standardized Size**: Backend typically uses a `StandardResultsSetPagination` with a `page_size` of 15.
- **Navigation**: Uses a `Paginator` component that triggers `pageParam` updates in the infinite/paginated query.

## 6. Types and Schemas

Each feature maintains a `types/types.ts` file defining:
- **Server Types**: Mirroring the Django API response.
- **Display Types**: Simplified versions for UI usage.
- **Schema Types**: Zod-based (in `schemas/`) used for forms and validation, often shared with listing for type safety.