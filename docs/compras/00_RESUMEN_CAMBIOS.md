# Resumen de Cambios - Sistema de Órdenes de Compra

## 📊 Estado Actual vs Estado Deseado

### ✅ Lo que YA EXISTE

#### Backend
- ✅ Modelo `Proveedores` completo
- ✅ Modelo `OrdenesCompra` base con:
  - Campos de proveedor, usuario, fechas
  - Totales en USD y VES
  - Estado, método de pago
  - Dirección de envío
- ✅ Modelo `DetalleOrdenesCompra` con:
  - Soporte para MP y PR
  - Cantidades solicitada y recibida
  - Costos
- ✅ Modelo `EstadosOrdenCompra`
- ✅ Modelo `LotesMateriasPrimas` con:
  - Campo `detalle_oc`
  - Campo `proveedor`
- ✅ Modelo `LotesProductosReventa` con:
  - Campo `detalle_oc`
  - Campo `proveedor`
- ✅ Signals que actualizan stock automáticamente
- ✅ Viewset `ProveedoresViewSet`
- ✅ Serializer `ProveedoresSerializer`

#### Frontend
- ✅ Módulo `Ordenes` (ventas) como referencia
- ✅ Flujo similar que puede replicarse

---

### ❌ Lo que FALTA Implementar

#### Backend - Modelos

**Actualizar `OrdenesCompra`:**
```python
# AGREGAR estos campos:
numero_factura_proveedor = models.CharField(...)
fecha_envio_oc = models.DateField(...)
email_enviado = models.BooleanField(...)
fecha_email_enviado = models.DateTimeField(...)
terminos_pago = models.TextField(...)
```

**Crear `Compras` (NUEVO):**
```python
class Compras(models.Model):
    # Registra cada recepción de mercancía
    orden_compra = models.ForeignKey(OrdenesCompra, ...)
    proveedor = models.ForeignKey(Proveedores, ...)
    usuario_recepcionador = models.ForeignKey(User, ...)
    fecha_recepcion = models.DateField(...)
    numero_factura_proveedor = models.CharField(...)
    numero_remision = models.CharField(...)
    monto_recepcion_usd = models.DecimalField(...)
    monto_recepcion_ves = models.DecimalField(...)
    pagado = models.BooleanField(...)
    monto_pendiente_pago_usd = models.DecimalField(...)
    # ... más campos
```

**Crear `DetalleCompras` (NUEVO):**
```python
class DetalleCompras(models.Model):
    # Detalla cada producto recibido en una recepción
    compra = models.ForeignKey(Compras, ...)
    detalle_oc = models.ForeignKey(DetalleOrdenesCompra, ...)
    materia_prima = models.ForeignKey('inventario.MateriasPrimas', ...)
    producto_reventa = models.ForeignKey('inventario.ProductosReventa', ...)
    cantidad_recibida = models.DecimalField(...)
    costo_unitario_usd = models.DecimalField(...)
    subtotal_usd = models.DecimalField(...)
    # ... más campos
```

**Crear `PagosProveedores` (NUEVO):**
```python
class PagosProveedores(models.Model):
    # Registra pagos a proveedores
    compra_asociada = models.ForeignKey(Compras, ...)
    orden_compra_asociada = models.ForeignKey(OrdenesCompra, ...)
    proveedor = models.ForeignKey(Proveedores, ...)
    fecha_pago = models.DateField(...)
    metodo_pago = models.ForeignKey(MetodosDePago, ...)
    monto_pago_usd = models.DecimalField(...)
    referencia_pago = models.CharField(...)
    # ... más campos
```

#### Backend - Serializers (TODOS NUEVOS)

```python
# Crear TODOS estos serializers:
- DetalleOrdenCompraSerializer
- OrdenCompraListSerializer
- OrdenCompraDetailSerializer
- OrdenCompraCreateUpdateSerializer
- LoteRecepcionSerializer
- DetalleRecepcionSerializer
- CompraCreateSerializer
- CompraDetailSerializer
- DetalleComprasSerializer
- PagoProveedorCreateSerializer
- PagoProveedorDetailSerializer
```

#### Backend - Viewsets (TODOS NUEVOS)

```python
# Crear TODOS estos viewsets:
- OrdenesCompraViewSet (CRUD + actions personalizados)
  - marcar_enviada()
  - enviar_email()
  - generar_pdf()
  - cancelar()

- ComprasViewSet (Recepciones)
  - create() con lógica compleja de lotes
  - _actualizar_estado_oc()

- PagosProveedoresViewSet
  - create() con actualización de montos pendientes
```

#### Backend - Utilidades (NUEVO)

```python
# Crear funciones auxiliares:
- generar_pdf_oc(orden_compra)
- enviar_email_oc(email, pdf, mensaje)
- validar_recepcion(orden_compra, detalles)
- calcular_estado_oc(orden_compra)
```

#### Frontend - Feature Completa (TODO NUEVO)

```
features/Compras/
├── api/
│   └── comprasApi.ts (NUEVO)
├── components/
│   ├── ComprasIndex.tsx (NUEVO)
│   ├── ComprasTable.tsx (NUEVO)
│   ├── OrdenCompraForm.tsx (NUEVO)
│   ├── OrdenCompraDetalles.tsx (NUEVO)
│   ├── RecepcionForm.tsx (NUEVO) ⚠️ CRÍTICO
│   ├── PagoProveedorForm.tsx (NUEVO)
│   ├── EstadoBadge.tsx (NUEVO)
│   └── EmailDialog.tsx (NUEVO)
├── hooks/
│   ├── queries/comprasQueries.ts (NUEVO)
│   └── mutations/comprasMutations.ts (NUEVO)
├── schema/
│   └── comprasSchema.ts (NUEVO)
└── types/
    └── types.ts (NUEVO)
```

---

## 🔥 Componentes Críticos

### 1. RecepcionForm.tsx (Frontend)
**Por qué es crítico:**
- Permite crear múltiples lotes por producto
- Maneja fechas de caducidad (esencial para FEFO)
- Validación compleja de cantidades
- UI compleja con secciones dinámicas

**Complejidad:** Alta ⭐⭐⭐

### 2. ComprasViewSet.create() (Backend)
**Por qué es crítico:**
- Crea múltiples registros en transacción atómica
- Crea Compra + DetalleCompras + Lotes
- Actualiza cantidad_recibida en DetalleOC
- Actualiza estado de OC
- Maneja validaciones complejas

**Complejidad:** Alta ⭐⭐⭐

### 3. Generación de PDF
**Por qué es importante:**
- Documento legal/formal
- Requiere librería externa
- Diseño de template

**Complejidad:** Media ⭐⭐

---

## 📈 Estimación de Trabajo

### Por Componente

| Componente | Líneas de Código Est. | Tiempo Est. | Prioridad |
|------------|----------------------|-------------|-----------|
| Actualizar `OrdenesCompra` | 20 | 30 min | ⭐⭐⭐ |
| Modelo `Compras` | 60 | 2 hrs | ⭐⭐⭐ |
| Modelo `DetalleCompras` | 40 | 1 hr | ⭐⭐⭐ |
| Modelo `PagosProveedores` | 50 | 1.5 hrs | ⭐⭐⭐ |
| Migrations | - | 30 min | ⭐⭐⭐ |
| Serializers | 300 | 1 día | ⭐⭐⭐ |
| Viewsets | 400 | 2-3 días | ⭐⭐⭐ |
| Frontend Types | 150 | 2 hrs | ⭐⭐⭐ |
| Frontend API | 100 | 2 hrs | ⭐⭐⭐ |
| Frontend Queries | 80 | 2 hrs | ⭐⭐⭐ |
| OrdenCompraForm | 500 | 2 días | ⭐⭐⭐ |
| RecepcionForm | 600 | 3 días | ⭐⭐⭐ |
| PagoProveedorForm | 200 | 1 día | ⭐⭐⭐ |
| Detalles y UI | 400 | 2 días | ⭐⭐ |
| PDF y Email | 300 | 2-3 días | ⭐ |
| Testing | - | 2 días | ⭐⭐ |

**TOTAL: 22-28 días de desarrollo**

---

## 🎯 Fases de Desarrollo

### Fase 1: Backend Base (Semana 1)
**Objetivo:** Tener modelos, serializers y viewsets básicos funcionando.

**Entregables:**
- ✅ Modelos creados y migrados
- ✅ Serializers implementados
- ✅ Viewsets CRUD básicos
- ✅ Endpoints probados en Postman

**Bloqueantes:** Ninguno (se puede empezar ya)

---

### Fase 2: Lógica de Recepción (Semana 2)
**Objetivo:** Implementar el flujo completo de recepción con creación de lotes.

**Entregables:**
- ✅ Método `create()` de ComprasViewSet
- ✅ Creación automática de lotes
- ✅ Actualización de estado de OC
- ✅ Testing de recepción completa

**Bloqueantes:** Necesita Fase 1 completada

---

### Fase 3: Frontend Core (Semana 2-3)
**Objetivo:** UI básica para crear y listar OCs.

**Entregables:**
- ✅ ComprasIndex
- ✅ ComprasTable
- ✅ OrdenCompraForm
- ✅ OrdenCompraDetalles

**Bloqueantes:** Necesita Fase 1 para endpoints

---

### Fase 4: Recepción UI (Semana 3)
**Objetivo:** Formulario completo de recepción con lotes.

**Entregables:**
- ✅ RecepcionForm completamente funcional
- ✅ Validaciones en frontend
- ✅ Testing E2E de recepción

**Bloqueantes:** Necesita Fase 2 y 3

---

### Fase 5: Pagos (Semana 4)
**Objetivo:** Sistema completo de pagos a proveedores.

**Entregables:**
- ✅ PagosProveedoresViewSet
- ✅ PagoProveedorForm
- ✅ Actualización de montos pendientes
- ✅ Testing de pagos

**Bloqueantes:** Necesita Fase 2

---

### Fase 6: Extras (Semana 4+)
**Objetivo:** PDF, email, reportes.

**Entregables:**
- ✅ Generación de PDF
- ✅ Envío de email
- ✅ Dashboard básico

**Bloqueantes:** Ninguno (opcional)

---

## 🔄 Comparación con Sistema de Ventas

| Característica | Ventas (Órdenes) | Compras (OC) |
|----------------|------------------|--------------|
| **Modelo principal** | OrdenVenta | OrdenesCompra ✅ |
| **Detalles** | DetallesOrdenVenta | DetalleOrdenesCompra ✅ |
| **Estado** | EstadosOrdenVenta | EstadosOrdenCompra ✅ |
| **Tercero** | Cliente | Proveedor ✅ |
| **Proceso** | Venta directa | Recepción + Pago ❌ |
| **Lotes** | Consume lotes | Crea lotes ❌ |
| **Pago** | Al vender | Después de recibir ❌ |
| **Email/PDF** | No ✅ | Sí ❌ |

**Diferencias clave:**
1. ❌ Compras **crea** lotes, ventas los **consume**
2. ❌ Compras tiene proceso de **recepción** separado
3. ❌ Compras maneja **pagos diferidos** (crédito)
4. ❌ Compras necesita **PDF y email**

---

## 💡 Recomendaciones

### 1. Empezar por el Backend
**Por qué:** El frontend depende de endpoints funcionando.

**Orden:**
1. Modelos y migrations
2. Serializers
3. Viewsets básicos
4. Testing con Postman

### 2. Priorizar RecepcionForm
**Por qué:** Es el componente más complejo y crítico.

**Alternativa:** Hacer un prototipo simple primero, luego mejorar.

### 3. Usar Módulo de Ventas como Referencia
**Por qué:** Ya tienes un sistema similar implementado.

**Reutilizar:**
- Estructura de componentes
- Patrones de validación
- Estilos y UI

### 4. Testing Continuo
**Por qué:** La lógica es compleja (lotes, pagos, estados).

**Estrategia:**
- Test cada endpoint al crearlo
- Test E2E al final de cada fase
- Casos edge desde el inicio

---

## ✅ Checklist Rápido

### Para Empezar HOY
- [ ] Crear branch `feature/ordenes-compra`
- [ ] Hacer backup de BD
- [ ] Actualizar `OrdenesCompra` con nuevos campos
- [ ] Crear modelos `Compras`, `DetalleCompras`, `PagosProveedores`
- [ ] Generar y aplicar migrations
- [ ] Verificar en Django Admin

### Validar que funciona
- [ ] Crear OC desde Django Admin
- [ ] Crear Compra desde Django Admin
- [ ] Crear Pago desde Django Admin
- [ ] Verificar relaciones en BD

---

📚 **Documentación Completa en `/docs/compras/`**
