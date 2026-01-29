# Implementation Plan: Recipe Details Modal (Productos Intermedios)

This plan details the steps to implement a modal that displays recipe details when clicking on a related recipe in the Product Details view of the **Productos Intermedios** feature.

## 1. Type Definitions
**File:** `frontend/panaderia-interfaz/src/features/ProductosIntermedios/types/types.ts`
- *Action:* Verify `RecetaRelacionada` and ensuring `recetaDetallesItem` (from `Recetas/types/types.ts`) can be used. (Status: Already exists/verified).

## 2. Context Updates
**File:** `frontend/panaderia-interfaz/src/context/ProductosIntermediosContext.tsx`
- **Goal:** Manage the modal visibility and selected recipe ID globally within the feature.
- **Changes:**
    - Add state: `showRecipeModal`: boolean
    - Add state: `selectedRecipeId`: number | null
    - Expose setters: `setShowRecipeModal`, `setSelectedRecipeId`
    - Initialize `showRecipeModal` to `false` and `selectedRecipeId` to `null`.

## 3. Trigger Implementation
**File:** `frontend/panaderia-interfaz/src/features/ProductosIntermedios/components/RecetaFieldValue.tsx`
- **Goal:** Make the recipe name clickable.
- **Changes:**
    - Import `useProductosIntermediosContext`.
    - Destructure `setSelectedRecipeId` and `setShowRecipeModal`.
    - In the `return` JSX:
        - Wrap the recipe name `recetaRelacionada?.nombre` in a clickable element.
        - Add styling: `className="cursor-pointer hover:underline text-blue-600 font-medium transition-colors"`
        - Add `onClick` handler:
            ```typescript
            const handleRecipeClick = () => {
                if (recetaRelacionada) {
                    setSelectedRecipeId(recetaRelacionada.id);
                    setShowRecipeModal(true);
                }
            };
            ```

## 4. Query Integration
**File:** `frontend/panaderia-interfaz/src/features/Recetas/hooks/queries/RecetasQueryOptions.ts`
- **Goal:** Ensure a query exists to fetch details for a *single* recipe by ID.
- **Status:** Already implemented as `recetasDetallesQueryOptions`.

## 5. Modal Rendering & Data Fetching
**File:** `frontend/panaderia-interfaz/src/features/ProductosIntermedios/components/ProductosIntermediosDetalles.tsx`
- **Goal:** Render the modal and fetch data when triggered.
- **Changes:**
    - Import `RecipeModal` from `@/components/RecipeModal`.
    - Import `useQuery` from `@tanstack/react-query`.
    - Import `recetasDetallesQueryOptions` from `@/features/Recetas/hooks/queries/RecetasQueryOptions`.
    - Import context values: `showRecipeModal`, `setShowRecipeModal`, `selectedRecipeId`.
    - Implement Query:
        ```typescript
        const { data: recipeDetails, isLoading: isLoadingRecipe } = useQuery({
            ...recetasDetallesQueryOptions(selectedRecipeId!),
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

## 6. Verification Steps
1. Navigate to "Productos Intermedios".
2. Select a product with a related recipe.
3. Click the recipe name in the details panel.
4. Verify the modal opens.
5. Verify the spinner appears while loading.
6. Verify the correct recipe details (ingredients, quantities) are displayed.
7. Verify closing the modal works.

