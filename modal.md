# Implementation Plan: Recipe Details Modal

This plan details the steps to implement a modal that displays recipe details when clicking on a related recipe in the Product Details view.

## 1. Type Definitions
**File:** `frontend/panaderia-interfaz/src/features/ProductosFinales/types/types.ts` (or `Recetas/types/types.ts` if shared)
- Ensure a type exists for the recipe details response. It should likely match the structure returned by the `recetas` endpoint (or the specific action `get_receta_detalles`).
- *Action:* Verify or add `RecipeDetails` interface containing:
    - `id`: number
    - `nombre`: string
    - `rendimiento`: number (optional)
    - `notas`: string
    - `componentes`: Array of ingredients/sub-recipes with quantities.

## 2. Context Updates
**File:** `frontend/panaderia-interfaz/src/context/ProductosFinalesContext.tsx`
- **Goal:** Manage the modal visibility and selected recipe ID globally within the feature.
- **Changes:**
    - Add state: `showRecipeModal`: boolean
    - Add state: `selectedRecipeId`: number | null
    - Expose setters: `setShowRecipeModal`, `setSelectedRecipeId`
    - Initialize `showRecipeModal` to `false` and `selectedRecipeId` to `null`.

## 3. Trigger Implementation
**File:** `frontend/panaderia-interfaz/src/features/ProductosFinales/components/RecetaFieldValue.tsx`
- **Goal:** Make the recipe name clickable.
- **Changes:**
    - Import `useProductosFinalesContext`.
    - Destructure `setSelectedRecipeId` and `setShowRecipeModal`.
    - In the `return` JSX:
        - Wrap the recipe name in a clickable element (e.g., `<span>` or `<button>`).
        - Add styling: `className="cursor-pointer hover:underline text-blue-600 font-medium transition-colors"`
        - Add `onClick` handler:
            ```typescript
            const handleRecipeClick = () => {
                if (recetaRelacionada && typeof recetaRelacionada !== 'boolean') {
                    setSelectedRecipeId(recetaRelacionada.id); // Ensure ID is available on recetaRelacionada
                    setShowRecipeModal(true);
                }
            };
            ```

## 4. Query Integration
**File:** `frontend/panaderia-interfaz/src/features/Recetas/hooks/queries/RecetasQueryOptions.ts` (or similar)
- **Goal:** Ensure a query exists to fetch details for a *single* recipe by ID.
- **Changes:**
    - Check for an existing `recetaDetallesQueryOptions`.
    - If missing, create one:
        ```typescript
        export const recetaDetallesQueryOptions = (id: number) => queryOptions({
            queryKey: ['receta', id],
            queryFn: () => getRecetaDetalles(id), // Implement api call if needed
            enabled: !!id, // Only run if ID is valid
        });
        ```

## 5. Modal Rendering & Data Fetching
**File:** `frontend/panaderia-interfaz/src/features/ProductosFinales/components/ProductosFinalesDetalles.tsx`
- **Goal:** Render the modal and fetch data when triggered.
- **Changes:**
    - Import `RecipeModal` (ensure it's exported from `src/components/RecipeModal.tsx`).
    - Import `useQuery` from `@tanstack/react-query`.
    - Import `recetaDetallesQueryOptions`.
    - Import context values: `showRecipeModal`, `setShowRecipeModal`, `selectedRecipeId`.
    - Implement Query:
        ```typescript
        const { data: recipeDetails, isLoading: isLoadingRecipe } = useQuery({
            ...recetaDetallesQueryOptions(selectedRecipeId!),
            enabled: !!selectedRecipeId && showRecipeModal,
        });
        ```
    - Render Modal (at the bottom of the component):
        ```tsx
        <RecipeModal
            isOpen={showRecipeModal}
            onClose={() => setShowRecipeModal(false)}
            data={recipeDetails}
            isLoading={isLoadingRecipe}
        />
        ```

## 6. Modal Component Refinement
**File:** `frontend/panaderia-interfaz/src/components/RecipeModal.tsx`
- **Goal:** Display the recipe details gracefully.
- **Changes:**
    - Update props interface:
        ```typescript
        interface RecipeModalProps {
            isOpen: boolean;
            onClose: () => void;
            data?: RecipeDetails; // Define strictly
            isLoading: boolean;
        }
        ```
    - Implement UI:
        - Use a standard Modal/Dialog component (Radix UI / Shadcn).
        - **Header:** Recipe Name.
        - **Body:**
            - **Loading State:** Show a spinner or skeleton if `isLoading` is true.
            - **Content:**
                - Display `Rendimiento` (if available).
                - Display `Notas` (if available).
                - **Ingredients Table:** List components (Materias Primas / Intermediate Products) with quantities and units.
        - **Footer:** Close button.

## 7. Verification Steps
1. Navigate to "Productos Elaborados".
2. Select a product with a related recipe.
3. Click the recipe name in the details panel.
4. Verify the modal opens.
5. Verify the spinner appears while loading.
6. Verify the correct recipe details (ingredients, quantities) are displayed.
7. Verify closing the modal works and resets the state correcty (optional: or keeps it cached).
