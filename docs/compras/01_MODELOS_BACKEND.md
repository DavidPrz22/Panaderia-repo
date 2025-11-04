# Modelos Backend - Sistema de Órdenes de Compra

## 📋 Índice
1. [Estados de Orden de Compra](#estados-de-orden-de-compra)
2. [Modelo OrdenesCompra (Actualizar)](#modelo-ordenescompra-actualizar)
3. [Modelo Compras (Nuevo)](#modelo-compras-nuevo)
4. [Modelo DetalleCompras (Nuevo)](#modelo-detallecompras-nuevo)
5. [Modelo PagosProveedores (Nuevo)](#modelo-pagosproveedores-nuevo)
6. [Relaciones entre Modelos](#relaciones-entre-modelos)
7. [Consideraciones Importantes](#consideraciones-importantes)

---

## Estados de Orden de Compra

### Asegurarse de tener estos estados en `EstadosOrdenCompra`:

```python
# Agregar en Django Admin o mediante migration/fixtures
estados = [
    {"nombre_estado": "Borrador", "descripcion": "OC en proceso de creación"},
    {"nombre_estado": "Emitida", "descripcion": "OC creada y lista para enviar"},
    {"nombre_estado": "Enviada", "descripcion": "OC enviada al proveedor"},
    {"nombre_estado": "Recibida Parcial", "descripcion": "Parte de la mercancía ha sido recibida"},
    {"nombre_estado": "Recibida Completa", "descripcion": "Toda la mercancía ha sido recibida"},
    {"nombre_estado": "Cancelada", "descripcion": "OC cancelada"},
]
```

---

## Modelo OrdenesCompra (Actualizar)

### Ubicación: `backend/djangobackend/apps/compras/models.py`

### Campos Existentes
✅ Ya tiene:
- `proveedor`
- `usuario_creador`
- `fecha_emision_oc`
- `fecha_entrega_esperada`
- `fecha_entrega_real`
- `estado_oc`
- Totales en USD y VES
- `metodo_pago`
- `tasa_cambio_aplicada`
- `direccion_envio`
- `notas`

### Campos NUEVOS a Agregar

```python
class OrdenesCompra(models.Model):
    # ... campos existentes ...
    
    # NUEVOS CAMPOS
    numero_factura_proveedor = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Número de factura emitida por el proveedor"
    )
    
    fecha_envio_oc = models.DateField(
        null=True, 
        blank=True,
        help_text="Fecha en que se envió la OC al proveedor"
    )
    
    email_enviado = models.BooleanField(
        default=False,
        help_text="Indica si se envió la OC por email"
    )
    
    fecha_email_enviado = models.DateTimeField(
        null=True, 
        blank=True,
        help_text="Fecha y hora del envío del email"
    )
    
    terminos_pago = models.TextField(
        max_length=500,
        null=True,
        blank=True,
        help_text="Términos de pago acordados (ej: 30 días, contado, etc.)"
    )
```

---

## Modelo Compras (Nuevo)

### Propósito
Registra cada **recepción física de mercancía** de una Orden de Compra. Una OC puede tener múltiples recepciones (parciales).

### Código Completo

```python
class Compras(models.Model):
    """
    Representa la recepción física de mercancía de una Orden de Compra.
    Una OC puede tener múltiples recepciones (compras) en caso de entregas parciales.
    """
    orden_compra = models.ForeignKey(
        OrdenesCompra, 
        on_delete=models.CASCADE, 
        related_name='recepciones',
        help_text="Orden de compra asociada a esta recepción"
    )
    
    proveedor = models.ForeignKey(
        Proveedores, 
        on_delete=models.CASCADE,
        help_text="Proveedor que realizó la entrega"
    )
    
    usuario_recepcionador = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        help_text="Usuario que registró la recepción de mercancía"
    )
    
    # Información de la recepción
    fecha_recepcion = models.DateField(
        null=False, 
        blank=False,
        help_text="Fecha en que se recibió la mercancía"
    )
    
    numero_factura_proveedor = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Número de factura del proveedor para esta entrega"
    )
    
    numero_remision = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Número de guía de remisión o nota de entrega"
    )
    
    # Montos de esta recepción específica
    monto_recepcion_usd = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        help_text="Monto total de esta recepción en USD"
    )
    
    monto_recepcion_ves = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        help_text="Monto total de esta recepción en VES"
    )
    
    tasa_cambio_aplicada = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        help_text="Tasa de cambio USD/VES al momento de la recepción"
    )
    
    # Control de pagos
    pagado = models.BooleanField(
        default=False,
        help_text="Indica si esta recepción ha sido pagada completamente"
    )
    
    monto_pendiente_pago_usd = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0,
        help_text="Monto pendiente de pago en USD"
    )
    
    # Metadatos
    notas = models.TextField(
        max_length=255, 
        null=True, 
        blank=True,
        help_text="Observaciones sobre la recepción"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Compra/Recepción"
        verbose_name_plural = "Compras/Recepciones"
        ordering = ['-fecha_recepcion', '-created_at']
    
    def __str__(self):
        return f"Compra #{self.id} - OC #{self.orden_compra.id} - {self.proveedor.nombre_proveedor}"
    
    def save(self, *args, **kwargs):
        # Inicializar monto_pendiente con el total si es nueva
        if not self.pk:
            self.monto_pendiente_pago_usd = self.monto_recepcion_usd
        super().save(*args, **kwargs)
```

---

## Modelo DetalleCompras (Nuevo)

### Propósito
Detalla cada item/producto recibido en una recepción de compra. Relaciona la recepción con los lotes creados.

### Código Completo

```python
class DetalleCompras(models.Model):
    """
    Detalle de cada item recibido en una compra/recepción.
    Se crea un registro por cada línea de producto recibido.
    """
    compra = models.ForeignKey(
        Compras, 
        on_delete=models.CASCADE, 
        related_name='detalles',
        help_text="Compra/recepción a la que pertenece este detalle"
    )
    
    detalle_oc = models.ForeignKey(
        DetalleOrdenesCompra, 
        on_delete=models.CASCADE,
        help_text="Línea de la OC correspondiente a este producto"
    )
    
    # Tipo de producto (solo uno debe tener valor)
    materia_prima = models.ForeignKey(
        'inventario.MateriasPrimas', 
        on_delete=models.CASCADE, 
        null=True,
        blank=True,
        help_text="Materia prima recibida"
    )
    
    producto_reventa = models.ForeignKey(
        'inventario.ProductosReventa', 
        on_delete=models.CASCADE, 
        null=True,
        blank=True,
        help_text="Producto de reventa recibido"
    )
    
    # Cantidades
    cantidad_recibida = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Cantidad recibida en esta entrega"
    )
    
    unidad_medida = models.ForeignKey(
        UnidadesDeMedida, 
        on_delete=models.CASCADE,
        help_text="Unidad de medida de la cantidad recibida"
    )
    
    # Costos
    costo_unitario_usd = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Costo unitario en USD"
    )
    
    subtotal_usd = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Subtotal de esta línea (cantidad * costo_unitario)"
    )
    
    notas = models.TextField(
        max_length=255, 
        null=True, 
        blank=True,
        help_text="Observaciones sobre este producto recibido"
    )
    
    class Meta:
        verbose_name = "Detalle de Compra"
        verbose_name_plural = "Detalles de Compra"
        constraints = [
            models.CheckConstraint(
                check=(
                    Q(materia_prima__isnull=False, producto_reventa__isnull=True) | 
                    Q(materia_prima__isnull=True, producto_reventa__isnull=False)
                ),
                name='detalle_compra_un_solo_tipo_de_producto'
            )
        ]
    
    def __str__(self):
        producto = self.materia_prima or self.producto_reventa
        return f"Detalle Compra #{self.compra.id} - {producto}"
    
    def save(self, *args, **kwargs):
        # Calcular subtotal automáticamente
        self.subtotal_usd = self.cantidad_recibida * self.costo_unitario_usd
        super().save(*args, **kwargs)
```

---

## Modelo PagosProveedores (Nuevo)

### Propósito
Registra los pagos realizados a proveedores. Puede asociarse a una compra específica o a una OC en general.

### Código Completo

```python
class PagosProveedores(models.Model):
    """
    Registra pagos realizados a proveedores por compras de mercancía.
    Permite manejar pagos totales, parciales y pagos a cuenta.
    """
    compra_asociada = models.ForeignKey(
        Compras, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='pagos',
        help_text="Compra/recepción específica a la que se aplica este pago"
    )
    
    orden_compra_asociada = models.ForeignKey(
        OrdenesCompra, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='pagos',
        help_text="Orden de compra a la que se aplica este pago"
    )
    
    proveedor = models.ForeignKey(
        Proveedores, 
        on_delete=models.CASCADE,
        help_text="Proveedor al que se realiza el pago"
    )
    
    # Información del pago
    fecha_pago = models.DateField(
        null=False, 
        blank=False,
        help_text="Fecha en que se realizó el pago"
    )
    
    metodo_pago = models.ForeignKey(
        MetodosDePago, 
        on_delete=models.CASCADE,
        help_text="Método utilizado para el pago"
    )
    
    # Montos
    monto_pago_usd = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Monto pagado en USD"
    )
    
    monto_pago_ves = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Monto pagado en VES"
    )
    
    tasa_cambio_aplicada = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        help_text="Tasa de cambio USD/VES al momento del pago"
    )
    
    # Referencias
    referencia_pago = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Número de referencia de transferencia/transacción"
    )
    
    numero_comprobante = models.CharField(
        max_length=100, 
        null=True, 
        blank=True,
        help_text="Número de comprobante de pago"
    )
    
    # Control
    usuario_registrador = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        help_text="Usuario que registró el pago"
    )
    
    notas = models.TextField(
        max_length=255, 
        null=True, 
        blank=True,
        help_text="Observaciones sobre el pago"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Pago a Proveedor"
        verbose_name_plural = "Pagos a Proveedores"
        ordering = ['-fecha_pago', '-created_at']
    
    def __str__(self):
        return f"Pago #{self.id} - {self.proveedor.nombre_proveedor} - ${self.monto_pago_usd}"
```

---

## Relaciones entre Modelos

### Diagrama de Relaciones

```
OrdenesCompra (1) ──────┬──── (N) DetalleOrdenesCompra
       │                │
       │ (1)            │ (1)
       │                │
       ▼ (N)            ▼ (1)
    Compras ──────────► DetalleCompras
       │                     │
       │ (1)                 │
       │                     │
       ▼ (N)                 ▼ (1)
 PagosProveedores      Lotes (MP/PR)
                       (via detalle_oc)

Proveedores ◄───── OrdenesCompra
     │              Compras
     │              PagosProveedores
     └──────────── Lotes (MP/PR)
```

### Explicación de Relaciones

1. **OrdenesCompra → Compras (1:N)**
   - Una OC puede tener múltiples recepciones (entregas parciales)

2. **Compras → PagosProveedores (1:N)**
   - Una compra puede pagarse en múltiples cuotas

3. **DetalleOrdenesCompra → DetalleCompras (1:N)**
   - Una línea de OC puede recibirse en múltiples entregas

4. **DetalleCompras → Lotes (1:N implícito)**
   - Al crear un DetalleCompras se crean los lotes correspondientes
   - Los lotes se relacionan via `detalle_oc` que apunta a `DetalleOrdenesCompra`

---

## Consideraciones Importantes

### 1. Recepciones Parciales

**Escenario:**
```
OC #001: 100kg Harina de Trigo
├─ Compra #1 (25/10): 50kg recibidos
│  └─ cantidad_recibida en DetalleOC: 50
└─ Compra #2 (27/10): 50kg recibidos
   └─ cantidad_recibida en DetalleOC: 100 (acumulado)
```

**Implementación:**
- Actualizar `cantidad_recibida` en `DetalleOrdenesCompra` acumulativamente
- Comparar con `cantidad_solicitada` para determinar estado de OC

### 2. Múltiples Lotes por Recepción

**Escenario:**
```
DetalleCompras: 100kg Harina
└─ Al recepcionar, el usuario crea:
   ├─ LoteMateriasPrimas #1: 50kg, caducidad: 01/06/2025
   └─ LoteMateriasPrimas #2: 50kg, caducidad: 01/08/2025
```

**Implementación:**
- La UI debe permitir crear múltiples lotes por cada `DetalleCompras`
- Cada lote debe tener:
  - `detalle_oc` → apunta al `DetalleOrdenesCompra`
  - `proveedor` → el proveedor de la OC
  - `fecha_caducidad` → ingresada por el usuario

### 3. Pagos Parciales

**Escenario:**
```
Compra #1: $1000.00
├─ PagoProveedor #1: $400.00 (25/10) → pendiente: $600.00
├─ PagoProveedor #2: $300.00 (10/11) → pendiente: $300.00
└─ PagoProveedor #3: $300.00 (25/11) → pendiente: $0, pagado=True
```

**Implementación:**
- Actualizar `monto_pendiente_pago_usd` en `Compras` con cada pago
- Cuando `monto_pendiente_pago_usd == 0`, marcar `pagado = True`

### 4. Actualización Automática de Stock

Los signals existentes ya manejan esto:

```python
@receiver([post_save, post_delete], sender=LotesMateriasPrimas)
def update_materia_prima_stock(sender, instance, **kwargs):
    # Ya existe - actualiza stock automáticamente

@receiver([post_save, post_delete], sender=LotesProductosReventa)
def update_producto_reventa_stock(sender, instance, **kwargs):
    # Ya existe - actualiza stock automáticamente
```

✅ Al crear lotes durante la recepción, el stock se actualiza automáticamente.

### 5. Validaciones Necesarias

**A nivel de modelo:**
- Un `DetalleCompras` solo puede tener materia_prima O producto_reventa
- `cantidad_recibida` no puede exceder `cantidad_solicitada` (acumulado)
- `monto_pago` no puede exceder `monto_pendiente_pago_usd`

**A nivel de negocio:**
- Verificar que la OC esté en estado "Enviada" antes de recepcionar
- Calcular totales automáticamente
- Validar fechas de caducidad (posteriores a fecha de recepción)

### 6. Campos Calculados

**En OrdenesCompra:**
- Total recibido vs solicitado (para determinar estado)

**En Compras:**
- `monto_pendiente_pago_usd` se actualiza con cada pago
- `pagado` se marca True cuando pendiente = 0

**En DetalleCompras:**
- `subtotal_usd` se calcula automáticamente en save()

---

## Próximo Documento

👉 Continúa en `02_LOGICA_NEGOCIO.md` para ver:
- Serializers
- Viewsets
- Endpoints
- Lógica de recepción y pagos
