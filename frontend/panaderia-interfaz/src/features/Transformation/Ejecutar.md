# Implementation Plan: Execute Transformation

## Overview
This plan details the implementation of the "Ejecutar Transformacion" logic, ensuring robust backend stock management (handling lots, FIFO, and traceability) and seamless frontend integration using React Query.

## Phase 1: Backend Implementation (Stock & Lots Logic)
**Objective**: Ensure strict data integrity when executing a transformation, properly managing lot consumption and creation.

**Files involved**:
- `backend/djangobackend/apps/transformacion/viewsets.py`
- `backend/djangobackend/apps/transformacion/services.py` (New Service suggested)
- `backend/djangobackend/apps/transformacion/models.py`

### 1.1 Refactor Logic into Service Layer
Instead of keeping complex logic in the ViewSet, create a `TransformationService` to handle the execution. Maintain the operation atomic.

- [x] **Create `TransformationService.execute_transformation`**:
    - Inputs: `transformacion_id`, `cantidad_a_transformar` (if variable) or just use logic from `Transformacion`.
    - Logic:
        1. **Validate Data**: Ensure source and destination products exist and are valid.
        2. **Check Stock**: Verify `stock_actual` of `producto_origen` is sufficient.
        3. **Lot Consumption (FIFO Strategy)**:
            - Fetch available lots for `producto_origen` ordered by `fecha_caducidad` (asc).
            - Iterate through lots, deducting quantity until the required `cantidad_origen` is met.
            - Update `stock_actual_lote` for each consumed lot.
            - If a lot reaches 0, update status to `AGOTADO` (or reliance on existing signals/logic).
        4. **Lot Creation (Destination)**:
            - Create new `LotesProductosElaborados` for `producto_destino`.
            - ** expiration date policy**: The new lot should conservatively inherit the **earliest** `fecha_caducidad` of the consumed lots to ensure food safety.
            - Set `stock_actual_lote` to `cantidad_destino`.
            - Set `produccion_origen` (Need to decide if it links to a specific production or just generic "Transformation").
        5. **Record Traceability**:
            - Create `LotesConsumidosTransformacion` records linking the specific source lots used to the new destination lot.
        6. **Update Product Totals**:
            - `producto_origen.stock_actual` -= quantity.
            - `producto_destino.stock_actual` += quantity.
        7. **Record Execution**:
            - Create `EjecutarTransformacion` record.
        

### 1.2 Update ViewSet
- [x] Clean up `EjecutarTransformacionViewSet`.
- [x] Call `TransformationService.execute_transformation`.
- [x] Handle exceptions (ValidationError, InsufficientStockError) and return appropriate HTTP responses.
- [x] Trigger `NotificationService` checks after successful transaction.

## Phase 2: Frontend Integration (React Query)
**Objective**: Connect the UI to the refined backend logic and provide user feedback.

**Files involved**:
- `frontend/panaderia-interfaz/src/features/Transformation/hooks/mutations.ts`
- `frontend/panaderia-interfaz/src/features/Transformation/components/EjecutarTransformacionBtn.tsx` (or similar)

### 2.1 React Query Mutations
- [x] **Implement `useExecuteTransformacionMutation`**:
    - Endpoint: `POST /api/transformacion/ejecutar/`
    - Body: `{ transformacion_id, ... }`
    - **On Success**:
        - `queryClient.invalidateQueries(['transformaciones'])`
        - `queryClient.invalidateQueries(['productos'])` (to update stock tables)
        - `toast.success("Transformación realizada con éxito")`
    - **On Error**:
        - `toast.error(error.message)`

## Phase 3: Testing & Verification
### 3.1 Scenarios
- [ ] **Standard Case**: Transform 1 unit where source has 1 lot with plenty of stock.
- [ ] **Multi-Lot Case**: Transform quantity requiring consumption of 2+ partial lots. Verify FIFO usage.
- [ ] **Traceability Check**: Verify `LotesConsumidosTransformacion` correctly maps the used lots.
- [ ] **Insufficient Stock**: Try to transform more than available; expect specific error message.
- [ ] **Expiration Logic**: Confirm destination lot gets the correct expiration date.