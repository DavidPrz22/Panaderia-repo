# Database Schema Documentation - PanaderiaSystem

## Overview

This document provides a comprehensive overview of the database schema for the PanaderiaSystem (Bakery System). The system is built using Django and consists of 6 main applications that manage different aspects of a bakery operation.

## System Architecture

The system is organized into the following Django apps:

- **Core**: Basic configuration and lookup tables
- **Users**: User authentication and management
- **Inventario**: Inventory management (raw materials, finished products, resale products)
- **Produccion**: Production management and recipes
- **Ventas**: Sales management and customer orders
- **Compras**: Purchase orders and supplier management

## Database Entities by Application

### 1. Core App (`apps.core`)

Contains fundamental lookup tables and configuration data used across the system.

#### UnidadesDeMedida (Units of Measurement)
- **Purpose**: Define measurement units used throughout the system
- **Key Fields**:
  - `nombre_completo`: Full name of the unit (unique)
  - `abreviatura`: Abbreviation
  - `tipo_medida`: Type of measurement (peso/volumen/unidad/longitud/otro)
  - `descripcion`: Optional description

#### CategoriasMateriaPrima (Raw Material Categories)
- **Purpose**: Categorize raw materials
- **Key Fields**:
  - `nombre_categoria`: Category name
  - `descripcion`: Optional description

#### CategoriasProductosElaborados (Finished Product Categories)
- **Purpose**: Categorize finished/elaborated products
- **Key Fields**:
  - `nombre_categoria`: Category name
  - `es_intermediario`: Boolean indicating if it's an intermediate product
  - `descripcion`: Optional description

#### CategoriasProductosReventa (Resale Product Categories)
- **Purpose**: Categorize products for resale
- **Key Fields**:
  - `nombre_categoria`: Category name
  - `descripcion`: Optional description

#### MetodosDePago (Payment Methods)
- **Purpose**: Define available payment methods
- **Key Fields**:
  - `nombre_metodo`: Payment method name
  - `requiere_referencia`: Boolean indicating if reference is required

#### EstadosOrdenVenta (Sales Order States)
- **Purpose**: Define possible states for sales orders
- **Key Fields**:
  - `nombre_estado_ov`: State name
  - `descripcion`: Optional description

#### EstadosOrdenCompra (Purchase Order States)
- **Purpose**: Define possible states for purchase orders
- **Key Fields**:
  - `nombre_estado_oc`: State name
  - `descripcion`: Optional description

### 2. Users App (`apps.users`)

Manages user authentication and authorization.

#### User (Custom User Model)
- **Purpose**: Custom user model extending Django's AbstractBaseUser
- **Key Fields**:
  - `username`: Unique username
  - `email`: Unique email address
  - `full_name`: User's full name
  - `rol`: User role (Gerente/Vendedor/Admin)
  - `is_staff`, `is_superuser`, `is_active`: Django permission fields
  - `date_joined`: Registration date

#### UserRoles (Text Choices)
- **Purpose**: Define available user roles
- **Choices**: MANAGER, SALES, ADMIN

### 3. Inventario App (`apps.inventario`)

Manages all inventory-related entities including raw materials, finished products, and resale products.

#### MateriasPrimas (Raw Materials)
- **Purpose**: Master data for raw materials
- **Key Fields**:
  - `nombre`: Material name (unique)
  - `unidad_medida_base`: Base unit of measurement (FK)
  - `stock_actual`: Current stock level
  - `SKU`: Stock Keeping Unit
  - `punto_reorden`: Reorder point
  - `categoria`: Material category (FK)
  - Standard packaging fields for bulk purchases

#### LotesMateriasPrimas (Raw Material Batches)
- **Purpose**: Track individual batches/lots of raw materials with expiration dates
- **Key Fields**:
  - `materia_prima`: Related raw material (FK)
  - `proveedor`: Supplier (FK to compras.Proveedores)
  - `fecha_recepcion`, `fecha_caducidad`: Reception and expiration dates
  - `cantidad_recibida`, `stock_actual_lote`: Received and current quantities
  - `costo_unitario_usd`: Unit cost in USD
  - `detalle_oc`: Related purchase order detail (FK)

#### ProductosElaborados (Finished Products)
- **Purpose**: Products manufactured in-house
- **Key Fields**:
  - `nombre_producto`: Product name (unique)
  - `SKU`: Stock Keeping Unit
  - `tipo_manejo_venta`: Sale handling type (UNIDAD/PESO_VOLUMEN)
  - `precio_venta_usd`: Sale price in USD
  - `stock_actual`: Current stock
  - `categoria`: Product category (FK)
  - `es_intermediario`: Boolean for intermediate products
- **Constraints**: Intermediate products cannot have sale price; final products must have sale price

#### ProductosIntermedios & ProductosFinales
- **Purpose**: Proxy models for ProductosElaborados to separate intermediate and final products
- **Type**: Django proxy models with custom managers

#### LotesProductosElaborados (Finished Product Batches)
- **Purpose**: Track batches of finished products
- **Key Fields**:
  - `produccion_origen`: Origin production (FK to produccion.Produccion)
  - `producto_elaborado`: Related product (FK)
  - `cantidad_inicial_lote`, `stock_actual_lote`: Initial and current quantities
  - `fecha_produccion`, `fecha_caducidad`: Production and expiration dates
  - `coste_unitario_lote_usd`: Unit cost in USD

#### ProductosReventa (Resale Products)
- **Purpose**: Products purchased for resale (not manufactured)
- **Key Fields**:
  - `nombre_producto`: Product name (unique)
  - `tipo_manejo_venta`: Sale handling type (UNIDAD/PESO_VOLUMEN)
  - `unidad_base_inventario`: Base inventory unit (FK)
  - `precio_venta_usd`: Sale price in USD
  - `stock_actual`: Current stock
  - `proveedor_preferido`: Preferred supplier (FK)
  - `pecedero`: Boolean indicating if perishable

#### LotesProductosReventa (Resale Product Batches)
- **Purpose**: Track batches of resale products
- **Key Fields**:
  - `producto_reventa`: Related product (FK)
  - `fecha_recepcion`, `fecha_caducidad`: Reception and expiration dates
  - `cantidad_recibida`, `stock_actual_lote`: Received and current quantities
  - `coste_unitario_lote_usd`: Unit cost in USD
  - `detalle_oc`: Related purchase order detail (FK)

### 4. Produccion App (`apps.produccion`)

Manages production processes, recipes, and transformations.

#### Recetas (Recipes)
- **Purpose**: Define recipes for finished products
- **Key Fields**:
  - `nombre`: Recipe name
  - `producto_elaborado`: Target finished product (FK)
  - `fecha_creacion`, `fecha_modificacion`: Creation and modification dates
  - `notas`: Additional notes

#### RecetasDetalles (Recipe Details)
- **Purpose**: Define recipe components (ingredients)
- **Key Fields**:
  - `receta`: Parent recipe (FK)
  - `componente_materia_prima`: Raw material component (FK, nullable)
  - `componente_producto_intermedio`: Intermediate product component (FK, nullable)
- **Constraints**: Must have exactly one component type (raw material OR intermediate product)

#### Produccion (Production)
- **Purpose**: Record production events
- **Key Fields**:
  - `producto_elaborado`: Product being produced (FK)
  - `cantidad_producida`: Quantity produced
  - `fecha_produccion`: Production date
  - `costo_total_componentes_usd`: Total component cost in USD
  - `usuario_creacion`: User who recorded the production (FK)

#### DetalleProduccionCosumos (Production Consumption Details)
- **Purpose**: Track materials consumed in production
- **Key Fields**:
  - `produccion`: Related production (FK)
  - `materia_prima_consumida`: Raw material consumed (FK, nullable)
  - `producto_intermedio_consumido`: Intermediate product consumed (FK, nullable)
  - `lote_materia_prima_consumida`: Specific raw material batch (FK, nullable)
  - `lote_producto_intermedio_consumido`: Specific intermediate product batch (FK, nullable)
  - `cantidad_consumida`: Quantity consumed
- **Constraints**: Must consume either raw material OR intermediate product with corresponding batch

#### DefinicionTransformacion (Transformation Definition)
- **Purpose**: Define product transformations (e.g., whole cake to slices)
- **Key Fields**:
  - `nombre`: Transformation name
  - `producto_elaborado_entrada`: Input product (FK)
  - `cantidad_entrada`: Input quantity
  - `producto_elaborado_salida`: Output product (FK)
  - `cantidad_salida`: Output quantity
  - `usuario_creacion`: User who defined the transformation (FK)

#### LogTransformacion (Transformation Log)
- **Purpose**: Record actual transformation events
- **Key Fields**:
  - `definicion_transformacion`: Transformation definition (FK)
  - `cantidad_producto_entrada_efectiva`: Actual input quantity
  - `cantidad_producto_salida_total_generado`: Total output generated
  - `costo_unitario_entrada_usd`: Input unit cost
  - `costo_total_entrada_calculado_usd`: Total input cost
  - `costo_unitario_salida_calculado_usd`: Calculated output unit cost

### 5. Ventas App (`apps.ventas`)

Manages sales transactions, customer orders, and payments.

#### Clientes (Customers)
- **Purpose**: Customer master data
- **Key Fields**:
  - `nombre_cliente`, `apellido_cliente`: Customer name
  - `telefono`, `email`: Contact information
  - `rif_cedula`: Tax ID/National ID
  - `fecha_registro`: Registration date
  - `notas`: Additional notes

#### Ventas (Sales)
- **Purpose**: Record completed sales transactions
- **Key Fields**:
  - `cliente`: Customer (FK)
  - `usuario_cajero`: Cashier user (FK)
  - `fecha_venta`: Sale date
  - `monto_total_usd`, `monto_total_ves`: Total amounts in USD and VES
  - `tasa_cambio_aplicada`: Applied exchange rate

#### DetalleVenta (Sale Details)
- **Purpose**: Individual line items within a sale
- **Key Fields**:
  - `venta`: Parent sale (FK)
  - `producto_elaborado`: Finished product sold (FK, nullable)
  - `producto_reventa`: Resale product sold (FK, nullable)
  - `lote_producto_elaborado_vendido`: Specific finished product batch (FK, nullable)
  - `lote_producto_reventa_vendido`: Specific resale product batch (FK, nullable)
  - `cantidad_vendida`: Quantity sold
  - `precio_unitario_usd`: Unit price in USD
  - `subtotal_linea_usd`: Line subtotal (calculated)
- **Constraints**: Must sell exactly one product type; finished products require batch specification

#### OrdenVenta (Sales Orders)
- **Purpose**: Manage customer orders (pre-sales)
- **Key Fields**:
  - `cliente`: Customer (FK)
  - `fecha_creacion_orden`: Order creation date
  - `fecha_entrega_solicitada`: Requested delivery date
  - `fecha_entrega_definitiva`: Final delivery date
  - `usuario_creador`: User who created the order (FK)
  - `monto_total_usd`, `monto_total_ves`: Total amounts
  - `monto_descuento_usd`: Discount amount

#### DetallesOrdenVenta (Sales Order Details)
- **Purpose**: Line items within sales orders
- **Key Fields**:
  - `produccion_asociada`: Associated production (FK)
  - `orden_venta_asociada`: Parent sales order (FK)
  - `producto_elaborado`: Finished product (FK, nullable)
  - `producto_reventa`: Resale product (FK, nullable)
  - `cantidad_solicitada`: Requested quantity
  - `precio_unitario_usd`: Unit price in USD
- **Constraints**: Must specify exactly one product type

#### Pagos (Payments)
- **Purpose**: Record payments for sales and orders
- **Key Fields**:
  - `venta_asociada`: Associated sale (FK, nullable)
  - `orden_venta_asociada`: Associated sales order (FK, nullable)
  - `metodo_pago`: Payment method (FK)
  - `monto_pago_usd`, `monto_pago_ves`: Payment amounts
  - `fecha_pago`: Payment date
  - `referencia_pago`: Payment reference
  - `usuario_registrador`: User who recorded the payment (FK)
- **Constraints**: Must be associated with either a sale OR a sales order

### 6. Compras App (`apps.compras`)

Manages purchase orders and supplier relationships.

#### Proveedores (Suppliers)
- **Purpose**: Supplier master data
- **Key Fields**:
  - `nombre_proveedor`, `apellido_proveedor`: Supplier name
  - `nombre_comercial`: Commercial name
  - `email_contacto`, `telefono_contacto`: Contact information
  - `fecha_creacion_registro`: Registration date
  - `usuario_registro`: User who registered the supplier (FK)

#### OrdenesCompra (Purchase Orders)
- **Purpose**: Manage purchase orders to suppliers
- **Key Fields**:
  - `proveedor`: Supplier (FK)
  - `usuario_creador`: User who created the order (FK)
  - `fecha_emision_oc`: Order emission date
  - `fecha_entrega_esperada`: Expected delivery date
  - `fecha_entrega_real`: Actual delivery date
  - `estado_oc`: Order state (FK)
  - Financial fields in both USD and VES currencies
  - `metodo_pago`: Payment method (FK)

#### DetalleOrdenesCompra (Purchase Order Details)
- **Purpose**: Line items within purchase orders
- **Key Fields**:
  - `orden_compra`: Parent purchase order (FK)
  - `materia_prima`: Raw material being purchased (FK, nullable)
  - `producto_reventa`: Resale product being purchased (FK, nullable)
  - `cantidad_solicitada`, `cantidad_recibida`: Requested and received quantities
  - `unidad_medida_compra`: Purchase unit of measurement (FK)
  - `costo_unitario_usd`: Unit cost in USD
  - `subtotal_linea_usd`: Line subtotal
- **Constraints**: Must purchase exactly one product type (raw material OR resale product)

## Key Relationships and Data Flow

### Inventory Flow
1. **Raw Materials**: Purchased via `OrdenesCompra` → Received as `LotesMateriasPrimas` → Consumed in `Produccion`
2. **Finished Products**: Produced via `Produccion` → Stored as `LotesProductosElaborados` → Sold via `Ventas`
3. **Resale Products**: Purchased via `OrdenesCompra` → Received as `LotesProductosReventa` → Sold via `Ventas`

### Production Flow
1. **Recipes**: Define `Recetas` with `RecetasDetalles` specifying ingredients
2. **Production**: Execute `Produccion` consuming materials tracked in `DetalleProduccionCosumos`
3. **Transformations**: Convert products using `DefinicionTransformacion` logged in `LogTransformacion`

### Sales Flow
1. **Orders**: Create `OrdenVenta` with `DetallesOrdenVenta` → Trigger `Produccion` if needed
2. **Sales**: Complete `Ventas` with `DetalleVenta` → Update inventory batches
3. **Payments**: Record `Pagos` associated with sales or orders

### Multi-Currency Support
The system supports dual currency operations (USD/VES) with exchange rate tracking across:
- Sales transactions
- Purchase orders
- Payments
- Production costs

## Database Constraints and Business Rules

### Data Integrity Constraints
1. **Product Type Exclusivity**: Models with multiple product type fields enforce exactly one selection
2. **Batch Requirements**: Finished products require batch specification for sales
3. **Intermediate vs Final Products**: Intermediate products cannot have sale prices; final products must have them
4. **Recipe Components**: Must specify either raw material OR intermediate product, not both
5. **Payment Associations**: Payments must be linked to either sales OR sales orders, not both

### Stock Management
- Automatic stock updates via Django signals for raw materials based on batch quantities
- FIFO (First In, First Out) inventory management through batch tracking
- Expiration date tracking for perishable items

### User Permissions
- Role-based access control through custom user model
- Production and order creation tracking for audit purposes
- Multi-user support with individual accountability

## Technical Implementation Notes

### Django Features Used
- **Custom User Model**: Extends AbstractBaseUser for bakery-specific user management
- **Proxy Models**: Separate intermediate and final products while sharing the same table
- **Model Constraints**: Database-level constraint enforcement for business rules
- **Signals**: Automatic stock updates when batch quantities change
- **Foreign Key Relationships**: Comprehensive relational data model
- **Choice Fields**: Enumerated values for consistent data entry

### Performance Considerations
- Indexed foreign key relationships for efficient queries
- Batch-based inventory management for scalability
- Calculated fields for financial totals to avoid repeated calculations

This schema provides a robust foundation for managing all aspects of a bakery operation, from raw material procurement through production to final sales, with comprehensive tracking and multi-currency support.
