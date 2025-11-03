# Production Interface: Required Checks and Features

This document outlines the necessary checks and features for the production module's user interface, based on the defined Django models and business logic.

## 1. Interface for "Production from Components"

This is the primary interface for logging a new production event, corresponding to the `Produccion` and `DetalleProduccionCosumos` models.

### Initial Form Checks (Header Section)

-   **[ ] `Producto a Producir` (Product to Produce):**
    -   **Check:** Must be a dropdown list populated only with items from `ProductosElaborados`.
    -   **Check:** This field is mandatory.
    -   **Feature:** When a product is selected, the interface should automatically fetch its associated `Receta` and populate the components list below as a suggestion.

-   **[ ] `Cantidad Producida` (Quantity Produced):**
    -   **Check:** Must be a mandatory field.
    -   **Check:** Must only accept positive numbers (`> 0`).
    -   **Check:** The input should handle decimals, as the model field `cantidad_producida` is a `DecimalField`.

-   **[ ] `Fecha de Producción` (Production Date):**
    -   **Check:** Must be a mandatory date field.
    -   **Check:** Should default to the current date.
    -   **Check (Business Rule):** Prevent users from selecting a future date.

### Components/Ingredients Section (Core Logic)

This section lists the `MateriasPrimas` and `ProductosIntermedios` used in the production event.

-   **[ ] Populating the List:**
    -   **Feature:** When a `Producto a Producir` is selected, this list should auto-populate with the components from its `RecetaDetalles`.
    -   **Feature:** The user must be able to add components manually that are not in the recipe (for variations or corrections). This requires a search/add input.

-   **[ ] For Each Component in the List:**
    -   **`Cantidad a Consumir` (Quantity to Consume):**
        -   **Feature:** This input must be editable by the user.
        -   **Check:** Must be a mandatory field for every component in the list.
        -   **Check:** Must be a positive number (`> 0`).
    -   **Stock Availability Check (Real-time Validation):**
        -   **Feature:** For each component, display the total available stock (sum of all its lots).
        -   **Check (Crucial):** The `Cantidad a Consumir` entered by the user **must not exceed** the total available stock for that component. If it does, display a clear error message for that line item and disable the final "Save" button.

-   **[ ] Submitting the Form (Backend Pre-Save Checks):**
    -   **Check:** The backend must re-validate all checks (e.g., stock availability) to prevent race conditions.
    -   **FEFO Logic:** The backend is responsible for the FEFO logic. The interface relies on the backend to:
        -   Find the correct lots for each component based on expiration date.
        -   Create individual `DetalleProduccionCosumos` records for each lot consumed.
        -   Correctly decrease stock from each specific lot.
    -   **Final Product Stock:** The backend must create a new lot for the `Producto a Producir` or add to an existing one, increasing its stock.

---

## 2. Interface for "Product Transformation"

This interface handles the transformation of one product into another, corresponding to the `DefinicionTransformacion` and `LogTransformacion` models.

-   **[ ] `Transformación a Ejecutar` (Transformation to Execute):**
    -   **Check:** A mandatory dropdown listing all active `DefinicionTransformacion` records (e.g., "Slice Whole Cake into Portions").

-   **[ ] `Cantidad de Entrada a Transformar` (Input Quantity to Transform):**
    -   **Check:** A mandatory, positive number input (e.g., "2" whole cakes).
    -   **Stock Check:** The interface must check that the quantity entered is available in the stock of the `producto_elaborado_entrada`. If not, show an error.

-   **[ ] Calculated Output (Display Only):**
    -   **Feature:** The interface should show a read-only calculation of the expected output.
    -   *Example:* "This will generate `(Cantidad de Entrada * cantidad_salida)` units of `producto_elaborado_salida`." (e.g., "This will generate `2 * 8 = 16` portions").

-   **[ ] Submission Checks:**
    -   The backend will receive the `DefinicionTransformacion` ID and the `cantidad_producto_entrada_efectiva`.
    -   It must perform the stock check again.
    -   It will then decrease the stock of the input product and increase the stock of the output product, creating a `LogTransformacion` record with all the calculated costs.
