from django.db import models
from django.db.models import Q
from django.core.exceptions import ValidationError
from apps.users.models import User
from apps.inventario.models import UnidadesDeMedida, ProductosElaborados, ProductosReventa, LotesProductosElaborados, LotesProductosReventa
from apps.core.models import MetodosDePago, EstadosOrdenVenta

# Create your models here.
class Clientes(models.Model):
    nombre_cliente = models.CharField(max_length=100, null=False, blank=False)
    apellido_cliente = models.CharField(max_length=100, null=False, blank=False)
    telefono = models.CharField(max_length=100, null=True, blank=False)
    email = models.CharField(max_length=100, null=True, blank=True)
    rif_cedula = models.CharField(max_length=100, null=True, blank=True)
    fecha_registro = models.DateField(auto_now_add=True)
    notas = models.TextField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.nombre_cliente


class Ventas(models.Model):
    cliente = models.ForeignKey(Clientes, on_delete=models.CASCADE, null=False, blank=False)
    usuario_cajero = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    fecha_venta = models.DateField(null=False, blank=False)
    monto_total_usd = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    monto_total_ves = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    tasa_cambio_aplicada = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    notas = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.cliente.nombre_cliente


class DetalleVenta(models.Model):
    """
    Representa una línea individual dentro de una Venta.
    """
    # --- Campos de Relación ---
    venta = models.ForeignKey(Ventas, on_delete=models.CASCADE, related_name='detalles')
    
    # Un detalle debe estar asociado a un producto, pero solo a uno de los dos tipos.
    producto_elaborado = models.ForeignKey(ProductosElaborados, on_delete=models.PROTECT, null=True, blank=True)
    producto_reventa = models.ForeignKey(ProductosReventa, on_delete=models.PROTECT, null=True, blank=True)
    
    # El lote específico que se está vendiendo.
    lote_producto_elaborado_vendido = models.ForeignKey(LotesProductosElaborados, on_delete=models.PROTECT, null=True, blank=True)
    lote_producto_reventa_vendido = models.ForeignKey(LotesProductosReventa, on_delete=models.PROTECT, null=True, blank=True)
    
    # --- Campos de la Venta ---
    unidad_medida_venta = models.ForeignKey(UnidadesDeMedida, on_delete=models.PROTECT)
    
    cantidad_vendida = models.DecimalField(max_digits=10, decimal_places=2) # Decimal por si vendes fracciones (ej. 1.5 kg)
    precio_unitario_usd = models.DecimalField(max_digits=10, decimal_places=2)
    
    subtotal_linea_usd = models.DecimalField(max_digits=12, decimal_places=2, editable=False)

    def __str__(self):
        producto_nombre = ""
        if self.producto_elaborado:
            producto_nombre = self.producto_elaborado.nombre
        elif self.producto_reventa:
            producto_nombre = self.producto_reventa.nombre
        return f"Venta #{self.venta.id} - {self.cantidad_vendida} x {producto_nombre}"

    # MEJORA 3: Validación a nivel de aplicación con mensajes de error claros.
    def clean(self):
        super().clean()
        
        # --- Regla: Debe haber un producto, y solo uno. ---
        if self.producto_elaborado and self.producto_reventa:
            raise ValidationError("Un detalle de venta no puede tener un producto elaborado y un producto de reventa al mismo tiempo.")
        
        if not self.producto_elaborado and not self.producto_reventa:
            raise ValidationError("Un detalle de venta debe estar asociado a un producto elaborado o a un producto de reventa.")
            
        # --- Reglas para Producto Elaborado ---
        if self.producto_elaborado:
            if not self.lote_producto_elaborado_vendido:
                raise ValidationError("Si se vende un producto elaborado, se debe especificar el lote.")
            if self.producto_reventa or self.lote_producto_reventa_vendido:
                raise ValidationError("Un detalle de producto elaborado no puede tener campos de producto de reventa.")

        # --- Reglas para Producto de Reventa ---
        if self.producto_reventa:
            if self.producto_elaborado or self.lote_producto_elaborado_vendido:
                raise ValidationError("Un detalle de producto de reventa no puede tener campos de producto elaborado.")
            # Aquí la lógica es que un producto de reventa PUEDE o NO tener lote.
            # No se necesita una validación explícita más allá de la consistencia.

    # MEJORA 4 (continuación): Sobrescribir save() para el cálculo.
    def save(self, *args, **kwargs):
        # Calcula el subtotal antes de guardar
        self.subtotal_linea_usd = self.cantidad_vendida * self.precio_unitario_usd
        
        # Llama al método clean() para ejecutar las validaciones antes de intentar guardar en la BD.
        # Esto es una buena práctica para asegurar que los datos son válidos a nivel de aplicación.
        self.clean()
        
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Detalle de Venta"
        verbose_name_plural = "Detalles de Venta"
        
        # MEJORA 2: Restricciones más simples y específicas.
        constraints = [
            # Restricción 1: Asegura que solo uno de los dos campos de producto tiene valor.
            models.CheckConstraint(
                check=(
                    Q(producto_elaborado__isnull=False, producto_reventa__isnull=True) |
                    Q(producto_elaborado__isnull=True, producto_reventa__isnull=False)
                ),
                name='detalle_venta_un_solo_tipo_de_producto'
            ),
            # Restricción 2: Si hay producto elaborado, DEBE haber lote elaborado.
            models.CheckConstraint(
                check=Q(producto_elaborado__isnull=True) | Q(lote_producto_elaborado_vendido__isnull=False),
                name='producto_elaborado_requiere_lote'
            ),
            # Restricción 3: No se puede tener un lote sin su producto correspondiente (consistencia).
            models.CheckConstraint(
                check=Q(producto_elaborado__isnull=False) | Q(lote_producto_elaborado_vendido__isnull=True),
                name='lote_elaborado_solo_con_producto_elaborado'
            ),
            models.CheckConstraint(
                check=Q(producto_reventa__isnull=False) | Q(lote_producto_reventa_vendido__isnull=True),
                name='lote_reventa_solo_con_producto_reventa'
            )
        ]


class OrdenVenta(models.Model):
    cliente = models.ForeignKey(Clientes, on_delete=models.CASCADE, null=False, blank=False)
    fecha_creacion_orden = models.DateField(null=False, blank=False)
    fecha_entrega_solicitada = models.DateField(null=False, blank=False)
    fecha_entrega_definitiva = models.DateField(null=False, blank=False)
    usuario_creador = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    notas_generales = models.TextField(max_length=255, null=True, blank=True)
    monto_descuento_usd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0)
    monto_total_usd = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    monto_total_ves = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    tasa_cambio_aplicada = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    estado_orden = models.ForeignKey(EstadosOrdenVenta, on_delete=models.CASCADE, null=False, blank=False)

    def __str__(self):
        return f"Orden de Venta #{self.id} - {self.cliente.nombre_cliente}"


class DetallesOrdenVenta(models.Model):
    orden_venta_asociada = models.ForeignKey(OrdenVenta, on_delete=models.CASCADE, null=False, blank=False)
    producto_elaborado = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE, null=True, blank=True)
    producto_reventa = models.ForeignKey(ProductosReventa, on_delete=models.CASCADE, null=True, blank=True)
    cantidad_solicitada = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    unidad_medida = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=False, blank=False)
    precio_unitario_usd = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    subtotal_linea_usd = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    descuento_porcentaje = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    impuesto_porcentaje = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Detalle de Orden de Venta #{self.id} - {self.producto_elaborado.nombre if self.producto_elaborado else self.producto_reventa.nombre}"

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(Q(producto_elaborado__isnull=False) & Q(producto_reventa__isnull=True)) | (Q(producto_elaborado__isnull=True) & Q(producto_reventa__isnull=False)),
                name='detalle_orden_venta_un_solo_tipo_de_producto'
            )
        ]


class Pagos(models.Model):
    venta_asociada = models.ForeignKey(Ventas, on_delete=models.CASCADE, null=True, blank=True)
    orden_venta_asociada = models.ForeignKey(OrdenVenta, on_delete=models.CASCADE, null=True, blank=True)
    metodo_pago = models.ForeignKey(MetodosDePago, on_delete=models.CASCADE, null=False, blank=False)
    monto_pago_usd = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    monto_pago_ves = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    fecha_pago = models.DateField(null=False, blank=False)
    referencia_pago = models.CharField(max_length=100, null=True, blank=True)
    usuario_registrador = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    tasa_cambio_aplicada = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False)
    notas = models.TextField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return f"Pago #{self.id} - {self.metodo_pago.nombre}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(Q(venta_asociada__isnull=False) & Q(orden_venta_asociada__isnull=True)) | (Q(venta_asociada__isnull=True) & Q(orden_venta_asociada__isnull=False)),
                name='un_solo_tipo_de_venta_por_pago'
            )
        ]

