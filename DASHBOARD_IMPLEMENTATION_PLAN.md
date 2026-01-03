# Plan de Implementación: Dashboard del Sistema

Este documento detalla el plan para implementar el Dashboard integral de la Panadería, integrando métricas de ventas, inventario, producción y órdenes de compra.

## 1. Backend (Django)

Se creará una nueva aplicación dedicada a la lógica del Dashboard para mantener el código organizado y desacoplado de los modelos principales.

### Aplicación: `dashboard`
- **Ubicación**: `backend/djangobackend/apps/dashboard`

### Serializers
Definir serializers optimizados para los diferentes indicadores y secciones:
- `DashBoardSummarySerializer`: Para las 4 tarjetas superiores.
- `SalesTrendSerializer`: Para el gráfico de tendencias (Fecha y Total VES).
- `TopProductSerializer`: Para el gráfico de productos más vendidos.
- `RecentPurchaseOrderSerializer`: Para la tabla de órdenes de compra.
- `RecentSaleSerializer`: Para la tabla de ventas recientes.

### ViewSet: `DashBoardViewSet`
Un único ViewSet con múltiples acciones (`@action`) para permitir el caching granular en el frontend:

1.  **`resumen_indicadores`**:
    - **Card 1**: Ventas de hoy (Count, Sum monto_total_ves, Count items).
    - **Card 2**: Cantidad de `OrdenVenta` con `estado__nombre='PENDIENTE'`. Contar cuántas tienen `fecha_entrega_solicitada` hoy o mañana.
    - **Card 3**: Alertas de stock (Sumar items con `stock_actual <= punto_reorden`, items con `stock_actual == 0`, e items con lotes expirados hoy).
    - **Card 4**: Producciones registradas en las últimas 24 horas (`Produccion.objects.filter(fecha_registro__gte=timezone.now() - timedelta(days=1))`).

2.  **`tendencias_ventas`**:
    - Agrupar `Ventas` de los últimos 7 días por fecha y sumar `monto_total_ves`.

3.  **`productos_populares`**:
    - Top 10 `DetalleVenta` agrupados por producto (elaborado/reventa), ordenados por cantidad vendida total.

4.  **`recientes`**:
    - Últimas 10 `OrdenesCompra` con proveedor, fecha y total.
    - Últimas 10 `Ventas` con cliente, fecha y total ves.

## 2. Frontend (React)

### Estructura de Archivos
Continuar la estructura en `src/features/DashBoard`:
- `api/dashboardApi.ts`: Definición de funciones de fetch (axios).
- `hooks/useDashboard.ts`: Hooks de React Query para cada endpoint.
- `types/dashboard.ts`: Interfaces de TypeScript y Zod schemas.
- `components/`: Componentes específicos (Cards, Charts, Tables).

### Componentes de UI (Visual)

#### Indicadores (Cards)
- Reutilizar `DashBoardCard` y `DashBoardCards` ya existentes.
- Conectar con `useDashboardQuery` para pasar datos reales en lugar de placeholders.

#### Bento Grid Layout
Ajustar `DashBoardGridContainer` para usar una estructura de grid bento premium:

1.  **GridItemTrends**:
    - Implementar un Line Chart o Area Chart usando **Nivo** (`@nivo/line`).
    - Ejes configurados para mostrar fechas y montos en Bs.
    - Tooltip personalizado con formato de moneda.

2.  **GridItemProducts**:
    - Implementar un Bar Chart usando **Nivo** (`@nivo/bar`).
    - Orientación horizontal para mejor lectura de nombres de productos.
    - Colores dinámicos basados en la categoría del producto.

3.  **GridItemRecentOrders**:
    - Tabla minimalista usando Shadcn `Table`.
    - Columnas: # Orden, Proveedor, Fecha, Estado, Total.

4.  **GridItemRecentSales**:
    - Tabla minimalista usando Shadcn `Table`.
    - Columnas: # Venta, Cliente, Fecha, Total VES.

### Gestión de Estado y Datos
- **React Query**:
    - Configurar `staleTime` de 5 minutos para los indicadores generales.
    - Manejar estados de `isLoading` con esqueletos (Skeletons) de Shadcn.
    - Manejar errores mediante `toast` de notificación y estados de fallback en los componentes.

## 3. Flujo de Trabajo (Roadmap)

1.  **Fase 1: Backend Base**
    - Crear `dashboard` app y registrarla en `settings.py`.
    - Implementar serializers y vistas iniciales.
    - Registrar URLs en `api_router`.

2.  **Fase 2: Frontend API**
    - Definir esquemas Zod en `types/dashboard.ts`.
    - Crear hooks en `hooks/useDashboard.ts`.

3.  **Fase 3: Componentes de Visualización**
    - Implementar `TrendsChart.tsx` y `TopProductsChart.tsx` (Nivo).
    - Implementar `RecentPurchasesTable.tsx` y `RecentSalesTable.tsx`.

4.  **Fase 4: Integración Bento Grid**
    - Ensamblar todo en `DashBoardGridContainer.tsx`.
    - Pulir estilos y responsividad.

5.  **Fase 5: Testing y Optimización**
    - Verificar tiempos de carga.
    - Asegurar que el cambio automático de USD/VES (si existe globalmente) se refleje.
