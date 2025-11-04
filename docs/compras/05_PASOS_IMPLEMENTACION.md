# Pasos de Implementación - Sistema de Órdenes de Compra

## 📋 Checklist de Implementación

### FASE 1: Preparación Backend (2-3 días)

#### ✅ Paso 1.1: Actualizar Estados de Orden de Compra
- [ x ] Verificar tabla `EstadosOrdenCompra` en DB
- [ x ] Agregar estados faltantes:
  - Borrador
  - Emitida
  - Enviada
  - Recibida Parcial
  - Recibida Completa
  - Cancelada
- [ x ] Crear fixture o migration para insertar estados

#### ✅ Paso 1.2: Actualizar Modelo OrdenesCompra
- [ x ] Abrir `apps/compras/models.py`
- [ x ] Agregar campos nuevos:
  - `numero_factura_proveedor`
  - `fecha_envio_oc`
  - `email_enviado`
  - `fecha_email_enviado`
  - `terminos_pago`
- [ x ] Generar migration: `python manage.py makemigrations compras`
- [ x ] Aplicar migration: `python manage.py migrate compras`

#### ✅ Paso 1.3: Crear Nuevos Modelos
- [ x ] En `apps/compras/models.py` agregar:
  - Clase `Compras`
  - Clase `DetalleCompras`
  - Clase `PagosProveedores`
- [ x ] Generar migration: `python manage.py makemigrations compras`
- [ x ] Aplicar migration: `python manage.py migrate compras`
- [ x ] Verificar en DB que las tablas se crearon correctamente

#### ✅ Paso 1.4: Registrar Modelos en Admin
- [  ] Abrir `apps/compras/admin.py`
- [ ] Registrar nuevos modelos:
```python
from django.contrib import admin
from .models import (
    Proveedores, 
    OrdenesCompra, 
    DetalleOrdenesCompra,
    Compras,
    DetalleCompras,
    PagosProveedores
)

admin.site.register(Compras)
admin.site.register(DetalleCompras)
admin.site.register(PagosProveedores)
```

---

### FASE 2: Serializers (1 día)

#### ✅ Paso 2.1: Crear Serializers Base
- [ ] Crear/actualizar `apps/compras/serializers.py`
- [ ] Implementar serializers:
  - `DetalleOrdenCompraSerializer`
  - `OrdenCompraListSerializer`
  - `OrdenCompraDetailSerializer`
  - `OrdenCompraCreateUpdateSerializer`
- [ ] Probar en Django Shell:
```python
from apps.compras.serializers import OrdenCompraListSerializer
from apps.compras.models import OrdenesCompra
oc = OrdenesCompra.objects.first()
serializer = OrdenCompraListSerializer(oc)
print(serializer.data)
```

#### ✅ Paso 2.2: Serializers de Recepción
- [ ] Implementar:
  - `LoteRecepcionSerializer`
  - `DetalleRecepcionSerializer`
  - `CompraCreateSerializer`
  - `CompraDetailSerializer`
  - `DetalleComprasSerializer`

#### ✅ Paso 2.3: Serializers de Pagos
- [ ] Implementar:
  - `PagoProveedorCreateSerializer`
  - `PagoProveedorDetailSerializer`

---

### FASE 3: Viewsets y Endpoints (2-3 días)

#### ✅ Paso 3.1: Crear OrdenesCompraViewSet
- [ ] Crear/actualizar `apps/compras/viewsets.py`
- [ ] Implementar `OrdenesCompraViewSet` con:
  - CRUD básico
  - Action `marcar_enviada`
  - Action `enviar_email`
  - Action `generar_pdf`
  - Action `cancelar`
- [ ] Probar endpoints en Postman/Thunder Client

#### ✅ Paso 3.2: Crear ComprasViewSet
- [ ] Implementar `ComprasViewSet` con:
  - Método `create` (recepción completa)
  - Método `_actualizar_estado_oc`
  - Filtros por proveedor y estado de pago
- [ ] Probar creación de recepción completa

#### ✅ Paso 3.3: Crear PagosProveedoresViewSet
- [ ] Implementar `PagosProveedoresViewSet`
- [ ] Lógica de actualización de monto pendiente
- [ ] Probar registro de pagos

#### ✅ Paso 3.4: Configurar URLs
- [ ] Actualizar `apps/compras/urls.py`
- [ ] Registrar todos los viewsets en el router
- [ ] Incluir en `djangobackend/urls.py`:
```python
path('api/compras/', include('apps.compras.urls')),
```
- [ ] Probar todos los endpoints

---

### FASE 4: Testing Backend (1 día)

#### ✅ Paso 4.1: Pruebas de Integración
- [ ] Crear OC completa desde Postman
- [ ] Marcar OC como enviada
- [ ] Recepcionar OC (crear compra + lotes)
- [ ] Verificar que se crearon los lotes correctamente
- [ ] Verificar que el stock se actualizó
- [ ] Registrar pago parcial
- [ ] Registrar pago completo
- [ ] Verificar estado de compra (pagado=True)

#### ✅ Paso 4.2: Validaciones
- [ ] Intentar recepcionar OC no enviada (debe fallar)
- [ ] Intentar recepcionar más de lo solicitado (debe fallar)
- [ ] Intentar pagar más del pendiente (debe fallar)
- [ ] Verificar fechas de caducidad (posteriores a recepción)

---

### FASE 5: Frontend Base (3-4 días)

#### ✅ Paso 5.1: Estructura y Types
- [ x ] Crear carpeta `src/features/Compras/`
- [ x ] Crear estructura de subcarpetas
- [ x ] Crear `types/types.ts` con todos los tipos
- [ x ] Crear `schema/comprasSchema.ts` con validaciones Zod

#### ✅ Paso 5.2: API y Queries
- [ ] Crear `api/comprasApi.ts` con todas las funciones
- [ ] Crear `hooks/queries/comprasQueries.ts`
- [ ] Crear `hooks/mutations/comprasMutations.ts`
- [ ] Probar queries en un componente de prueba

#### ✅ Paso 5.3: Componente Principal
- [ ] Crear `components/ComprasIndex.tsx`
- [ ] Implementar tabla básica de OCs
- [ ] Implementar filtros por estado
- [ ] Agregar paginación si es necesario

---

### FASE 6: Formulario de Orden de Compra (2 días)

#### ✅ Paso 6.1: Formulario Base
- [ ] Crear `components/OrdenCompraForm.tsx`
- [ ] Implementar selección de proveedor
- [ ] Implementar campos de fechas
- [ ] Implementar campo de dirección
- [ ] Implementar campo de método de pago

#### ✅ Paso 6.2: Tabla de Productos
- [ ] Implementar buscador de productos (MP + PR)
- [ ] Tabla dinámica de items
- [ ] Cálculo automático de subtotales
- [ ] Cálculo de totales generales
- [ ] Validaciones de formulario

#### ✅ Paso 6.3: Guardar y Editar
- [ ] Implementar lógica de creación
- [ ] Implementar lógica de edición
- [ ] Manejo de errores y mensajes toast
- [ ] Probar crear OC completa desde UI

---

### FASE 7: Detalles y Acciones (2 días)

#### ✅ Paso 7.1: Vista de Detalles
- [ ] Crear `components/OrdenCompraDetalles.tsx`
- [ ] Mostrar información completa de OC
- [ ] Mostrar tabla de productos
- [ ] Mostrar totales

#### ✅ Paso 7.2: Acciones por Estado
- [ ] Implementar botones condicionales según estado
- [ ] Botón "Marcar como Enviada"
- [ ] Botón "Enviar Email" → Dialog
- [ ] Botón "Descargar PDF"
- [ ] Botón "Recepcionar" → Form
- [ ] Botón "Cancelar"

#### ✅ Paso 7.3: Email Dialog
- [ ] Crear `components/EmailDialog.tsx`
- [ ] Campo de email del proveedor
- [ ] Campo de mensaje personalizado
- [ ] Implementar envío

---

### FASE 8: Formulario de Recepción (3 días) ⚠️ CRÍTICO

#### ✅ Paso 8.1: Diseño del Formulario
- [ ] Crear `components/RecepcionForm.tsx`
- [ ] Mostrar datos de la OC (read-only)
- [ ] Listar productos de la OC
- [ ] Campos de factura y remisión

#### ✅ Paso 8.2: Sección de Lotes Dinámica
- [ ] Por cada producto mostrar:
  - Cantidad solicitada (read-only)
  - Cantidad ya recibida (read-only)
  - Cantidad pendiente (calculado)
- [ ] Sección de lotes (repetible):
  - Input cantidad
  - DatePicker fecha caducidad
  - Input costo unitario
  - Botón "Agregar Lote"
  - Botón "Eliminar Lote"

#### ✅ Paso 8.3: Validaciones y Lógica
- [ ] Validar que suma de lotes = cantidad recibida
- [ ] Validar que cantidad recibida ≤ cantidad pendiente
- [ ] Validar fechas de caducidad > fecha recepción
- [ ] Implementar submit
- [ ] Mostrar preview antes de confirmar

#### ✅ Paso 8.4: Testing Recepción
- [ ] Probar recepción total (100% de OC)
- [ ] Probar recepción parcial (50% de OC)
- [ ] Probar múltiples lotes por producto
- [ ] Verificar creación de lotes en BD
- [ ] Verificar actualización de stock

---

### FASE 9: Formulario de Pago (1-2 días)

#### ✅ Paso 9.1: Formulario
- [ ] Crear `components/PagoProveedorForm.tsx`
- [ ] Seleccionar compra o mostrar info
- [ ] Mostrar monto pendiente
- [ ] Inputs de pago (monto, método, referencia)
- [ ] Cálculo automático VES

#### ✅ Paso 9.2: Validaciones
- [ ] Validar monto ≤ pendiente
- [ ] Validar referencia si es requerida
- [ ] Implementar submit
- [ ] Actualizar UI después de pagar

---

### FASE 10: Funcionalidades Avanzadas (2-3 días)

#### ✅ Paso 10.1: Generación de PDF
- [ ] Backend: Instalar ReportLab o WeasyPrint
- [ ] Crear template de PDF para OC
- [ ] Implementar función `generar_pdf_oc()`
- [ ] Endpoint que devuelva archivo PDF
- [ ] Frontend: Descargar PDF

#### ✅ Paso 10.2: Envío de Email
- [ ] Configurar SMTP en Django settings
- [ ] Crear template HTML de email
- [ ] Implementar función `enviar_email_oc()`
- [ ] Adjuntar PDF al email
- [ ] Probar envío real

#### ✅ Paso 10.3: Dashboard/Reportes
- [ ] Vista de OCs pendientes de recepción
- [ ] Vista de compras pendientes de pago
- [ ] Total adeudado por proveedor
- [ ] Gráficos básicos (opcional)

---

### FASE 11: Testing E2E (2 días)

#### ✅ Paso 11.1: Flujo Completo
- [ ] Crear nueva OC desde UI
- [ ] Enviar email con PDF
- [ ] Recepcionar OC parcialmente
- [ ] Verificar estado "Recibida Parcial"
- [ ] Recepcionar resto de OC
- [ ] Verificar estado "Recibida Completa"
- [ ] Registrar pago parcial
- [ ] Registrar pago final
- [ ] Verificar en BD todos los registros

#### ✅ Paso 11.2: Casos Edge
- [ ] OC con solo MP
- [ ] OC con solo PR
- [ ] OC mixta (MP + PR)
- [ ] Cancelar OC
- [ ] Múltiples recepciones de misma OC
- [ ] Múltiples pagos de misma compra

---

### FASE 12: Optimizaciones y Refactoring (1-2 días)

#### ✅ Paso 12.1: Performance
- [ ] Optimizar queries (select_related, prefetch_related)
- [ ] Agregar índices en BD si es necesario
- [ ] Implementar caching básico
- [ ] Lazy loading en frontend

#### ✅ Paso 12.2: UX
- [ ] Loaders y skeletons
- [ ] Mensajes de error descriptivos
- [ ] Confirmaciones antes de acciones destructivas
- [ ] Atajos de teclado (opcional)

#### ✅ Paso 12.3: Documentación
- [ ] Comentarios en código crítico
- [ ] README de la feature
- [ ] Guía de usuario (opcional)

---

## 🚨 Consideraciones Críticas

### 1. Transacciones Atómicas
**Usar `@transaction.atomic` en:**
- Creación de OC con detalles
- Recepción de compra (crea múltiples lotes)
- Registro de pagos

### 2. Manejo de Errores
**Capturar y manejar:**
- OC no encontrada
- Estado inválido para acción
- Cantidades que exceden lo solicitado
- Montos que exceden lo pendiente
- Fechas inválidas

### 3. Validaciones de Seguridad
- Verificar permisos de usuario
- Validar que el usuario no pueda modificar OCs de otros
- Sanitizar inputs
- Validar archivos subidos

### 4. Performance
- No cargar todas las OCs si hay miles
- Usar paginación
- Implementar búsqueda y filtros eficientes
- Optimizar queries con select_related

---

## 📊 Estimación de Tiempos

| Fase | Días | Prioridad |
|------|------|-----------|
| Fase 1: Backend Base | 2-3 | ⭐⭐⭐ |
| Fase 2: Serializers | 1 | ⭐⭐⭐ |
| Fase 3: Viewsets | 2-3 | ⭐⭐⭐ |
| Fase 4: Testing Backend | 1 | ⭐⭐⭐ |
| Fase 5: Frontend Base | 3-4 | ⭐⭐⭐ |
| Fase 6: Form OC | 2 | ⭐⭐⭐ |
| Fase 7: Detalles | 2 | ⭐⭐ |
| Fase 8: Recepción | 3 | ⭐⭐⭐ |
| Fase 9: Pagos | 1-2 | ⭐⭐⭐ |
| Fase 10: PDF/Email | 2-3 | ⭐ |
| Fase 11: Testing E2E | 2 | ⭐⭐ |
| Fase 12: Optimización | 1-2 | ⭐ |
| **TOTAL** | **22-28 días** | |

---

## 🎯 Orden Recomendado de Implementación

### MVP (Mínimo Viable)
1. ✅ Modelos backend
2. ✅ Serializers básicos
3. ✅ Viewsets CRUD
4. ✅ Form crear OC
5. ✅ Form recepcionar
6. ✅ Form pagar

### Funcionalidades Adicionales
7. Email y PDF
8. Dashboard
9. Reportes

---

## 📝 Notas Finales

- **Backup de BD**: Hacer backup antes de migrar
- **Testing**: Probar cada fase antes de continuar
- **Git**: Commit frecuente, un commit por fase
- **Documentación**: Actualizar docs con cambios
- **Code Review**: Revisar código crítico (recepción, pagos)

---

✅ **Implementación Completa**
