# Feature Implementation Plan: Delete Lots

## Overview
Implement the ability to delete individual lots (Lotes) for Materias Primas, Productos Elaborados (Finales e Intermedios), and Productos Reventa. This feature allows authorized users (Admin and Gerente) to correct entry errors or remove invalid stock records.

## 1. Backend Implementation

### 1.1 ViewSets Update
Ensure that all Lote ViewSets implement the `destroy` method and that it correctly triggers stock updates.

- **`LotesMateriaPrimaViewSet`** (`apps/inventario/viewsets.py`):
    - Implement `destroy` method.
    - Although the `post_delete` signal in `models.py` handles stock updates, the `destroy` method should explicitly ensure atomicity and handle any potential errors during the deletion process.
- **`LotesProductosElaboradosViewSet`** (`apps/inventario/viewsets.py`):
    - Review existing `destroy` method. Ensure it uses `transaction.atomic()`.
    - Verify that `producto.actualizar_stock()` is called correctly (it currently calls the method from `ComponentesStockManagement` which is correct).
- **`LotesProductosReventaViewSet`** (`apps/inventario/viewsets.py`):
    - Review existing `destroy` method. Ensure it triggers the `post_delete` signal correctly.

### 1.2 Validation (Optional but Recommended)
- Add a check to prevent deletion of lots that have a `stock_actual_lote` different from `cantidad_recibida` (indicating it has been used), or at least require a double confirmation if the lot is partially consumed.

---

## 2. Frontend Implementation

### 2.1 Permission Control
- Use `userHasPermission(user, 'lots', 'delete')` to condition the visibility of the delete button.
- Only users with `admin` or `gerente` roles should be able to see and perform this action.

### 2.2 Mutation Hooks
Create/Update mutation hooks for each lot type in their respective features. Some may already exist but need verification:
- **Materia Prima**: `useDeleteLoteMateriaPrimaMutation` in `MateriaPrima/hooks/mutations/materiaPrimaMutations.tsx` (Exists).
- **Productos Reventa**: `useDeleteLoteProductosReventaMutation` in `ProductosReventa/hooks/mutations/productosReventaMutations.ts` (Exists).
- **Productos Elaborados (Finales/Intermedios)**: **MISSING**. Need to create `useDeleteLoteProductoElaboradoMutation` in:
    - `ProductosFinales/hooks/mutations/productosFinalesMutations.ts`
    - `ProductosIntermedios/hooks/mutations/productosIntermediosMutations.ts`
- Each mutation should:
    - Call the `DELETE` endpoint.
    - On success:
        - Invalidate the relevant query keys:
            - `['lotes', productId]`
            - Product details query (to update total stock in real-time)
            - Main product list query
        - Show a success toast message.
    - On error:
        - Show an error toast message with the backend error message if available.


### 2.3 UI Components
Modify the following components to add the Delete Button:

- **Materia Prima**: `MateriaPrima/components/Lotes/LotesTableRows.tsx`
- **Productos Finales**: `ProductosFinales/components/PFLotesTable.tsx`
- **Productos Intermedios**: `ProductosIntermedios/components/LotesProductosIntermediosTable.tsx`
- **Productos Reventa**: `ProductosReventa/components/LotesProductosReventaTable.tsx`

**UI Requirements**:
- Add a "Trash" icon button to each row.
- Wrap the action in a **Confirmation Dialog** (Shadcn `AlertDialog` or similar) to prevent accidental deletions.
- Show a loading spinner or disable the button while the mutation is `ispending`.

---

## 3. Success Criteria
- [ ] Users with 'vendedor' role CANNOT see the delete button.
- [ ] Users with 'admin'/'gerente' role CAN see the delete button.
- [ ] Clicking delete prompts for confirmation.
- [ ] After deletion, the lot is removed from the table immediately (via cache invalidation).
- [ ] The total stock of the parent product/material is updated correctly in the UI.
- [ ] A success toast is displayed.
- [ ] Deleting a lot that doesn't exist or without permission returns a proper error message.

---

## 4. Risks & Considerations
- **Data Integrity**: Deleting a lot that has already been used in a production or sale will lead to inconsistencies in historical consumption records. 
- **Stock Calculations**: Ensure that the `actualizar_stock` methods correctly recalculate the total based on remaining DISPONIBLE lots.
- **Cache Invalidation**: Make sure all related queries are invalidated to avoid showing stale stock numbers in other parts of the app (like the dashboard or product list).