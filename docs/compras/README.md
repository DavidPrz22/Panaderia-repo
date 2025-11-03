# Sistema de Órdenes de Compra - Documentación Completa

## 📚 Índice de Documentos

Esta carpeta contiene la documentación completa para la implementación del sistema de Órdenes de Compra y Gestión de Pagos a Proveedores.

---

## 📄 Documentos Disponibles

### 1. [Modelos Backend](./01_MODELOS_BACKEND.md)
**Contenido:**
- Estados de Orden de Compra
- Modelo `OrdenesCompra` (actualización)
- Modelo `Compras` (nuevo)
- Modelo `DetalleCompras` (nuevo)
- Modelo `PagosProveedores` (nuevo)
- Relaciones entre modelos
- Consideraciones importantes de diseño

**Lee este documento si necesitas:**
- Entender la estructura de la base de datos
- Conocer las relaciones entre modelos
- Comprender el flujo de recepciones y pagos

---

### 2. [Serializers](./02_SERIALIZERS.md)
**Contenido:**
- Serializers para OrdenesCompra (list, detail, create/update)
- Serializers para Compras/Recepciones
- Serializers para PagosProveedores
- Serializers anidados para detalles

**Lee este documento si necesitas:**
- Implementar la capa de serialización
- Entender la transformación de datos entre BD y API
- Conocer las validaciones a nivel de serializer

---

### 3. [Viewsets y Endpoints](./03_VIEWSETS.md)
**Contenido:**
- `OrdenesCompraViewSet` con actions personalizados
- `ComprasViewSet` con lógica de recepción
- `PagosProveedoresViewSet` con actualización de montos
- Configuración de URLs
- Lista completa de endpoints disponibles

**Lee este documento si necesitas:**
- Implementar la lógica de negocio del backend
- Conocer los endpoints disponibles
- Entender el flujo de recepciones y pagos

---

### 4. [Frontend UI](./04_FRONTEND_UI.md)
**Contenido:**
- Estructura de carpetas del frontend
- Types y Schemas TypeScript
- API y React Query hooks
- Componentes principales
- Flujo de navegación

**Lee este documento si necesitas:**
- Implementar la interfaz de usuario
- Conocer la estructura del frontend
- Entender el flujo de navegación entre pantallas

---

### 5. [Pasos de Implementación](./05_PASOS_IMPLEMENTACION.md)
**Contenido:**
- Checklist completo de 12 fases
- Estimación de tiempos por fase
- Orden recomendado de implementación
- Consideraciones críticas
- Testing E2E

**Lee este documento si necesitas:**
- Saber por dónde empezar
- Planificar el desarrollo
- Seguir un orden lógico de implementación
- Estimar tiempos de desarrollo

---

## 🎯 Flujo Completo del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                  CREAR ORDEN DE COMPRA                   │
│  (Usuario crea OC, selecciona proveedor y productos)    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               ENVIAR ORDEN AL PROVEEDOR                  │
│  (Marcar como enviada o enviar email con PDF)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               RECEPCIONAR MERCANCÍA                      │
│  (Registrar cantidades, crear lotes con fechas)         │
│  • Puede ser parcial (múltiples recepciones)            │
│  • Se actualiza stock automáticamente                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               REGISTRAR PAGOS                            │
│  (Pagar total o parcialmente)                           │
│  • Actualiza monto pendiente                            │
│  • Marca como pagado cuando pendiente = 0               │
└─────────────────────────────────────────────────────────┘
```

---

## 🔑 Conceptos Clave

### OrdenCompra vs Compra
- **OrdenCompra**: Documento que se envía al proveedor solicitando productos
- **Compra**: Registro de la recepción física de mercancía de una OC

### Recepciones Parciales
Una OC puede recepcionarse en múltiples entregas:
```
OC #001: 100kg Harina
├─ Compra #1: 50kg (25/10)
└─ Compra #2: 50kg (27/10)
```

### Pagos Parciales
Una compra puede pagarse en múltiples cuotas:
```
Compra #1: $1000
├─ Pago #1: $400 (25/10)
├─ Pago #2: $300 (10/11)
└─ Pago #3: $300 (25/11) → pagado=True
```

### Lotes
Cada recepción puede crear múltiples lotes con diferentes fechas de caducidad:
```
Recepción: 100kg Harina
├─ Lote A: 50kg, vence 01/06/2025
└─ Lote B: 50kg, vence 01/08/2025
```

---

## 🚀 Inicio Rápido

### Para Backend
1. Lee `01_MODELOS_BACKEND.md`
2. Lee `02_SERIALIZERS.md`
3. Lee `03_VIEWSETS.md`
4. Sigue `05_PASOS_IMPLEMENTACION.md` Fases 1-4

### Para Frontend
1. Lee `04_FRONTEND_UI.md`
2. Sigue `05_PASOS_IMPLEMENTACION.md` Fases 5-9

### Para Todo el Sistema
1. Lee todos los documentos en orden
2. Sigue `05_PASOS_IMPLEMENTACION.md` completo

---

## ⚠️ Consideraciones Críticas

### 1. **Transacciones Atómicas**
Usar `@transaction.atomic` en operaciones que crean múltiples registros:
- Creación de OC con detalles
- Recepción (crea compra + detalles + lotes)
- Registro de pagos

### 2. **Actualización de Stock**
Los signals existentes ya manejan la actualización automática de stock al crear/actualizar lotes.

### 3. **Validaciones**
- Cantidad recibida ≤ cantidad solicitada
- Monto de pago ≤ monto pendiente
- Fechas de caducidad > fecha de recepción
- Estados válidos para cada acción

### 4. **Fechas de Caducidad**
**CRÍTICO**: Al recepcionar, el usuario DEBE ingresar la fecha de caducidad de cada lote para un control FEFO correcto.

---

## 📊 Estimación Total

- **Tiempo estimado**: 22-28 días
- **MVP funcional**: 15-18 días
- **Sistema completo**: 22-28 días

---

## 📞 Soporte

Si tienes preguntas sobre:
- **Modelos**: Revisa `01_MODELOS_BACKEND.md`
- **API**: Revisa `03_VIEWSETS.md`
- **UI**: Revisa `04_FRONTEND_UI.md`
- **Cómo empezar**: Revisa `05_PASOS_IMPLEMENTACION.md`

---

## 📝 Versionado

- **v1.0** - Documentación inicial (24/10/2025)
  - Modelos completos
  - Serializers
  - Viewsets
  - Frontend UI
  - Plan de implementación

---

✅ **Documentación Completa del Sistema de Órdenes de Compra**
