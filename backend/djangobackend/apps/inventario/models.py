from django.db import models
from apps.core.models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosReventa, CategoriasProductosElaborados
from django.db.models import Q, Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.core.exceptions import ValidationError

# Create your models here.
class MateriasPrimas(models.Model):
    nombre = models.CharField(max_length=100, null=False, blank=False, unique=True)
    unidad_medida_base = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=False, blank=False, related_name='materias_primas_unidad_base')
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SKU = models.CharField(max_length=50, null=True, blank=True, unique=True)
    nombre_empaque_estandar = models.CharField(max_length=100, null=True, blank=True)
    cantidad_empaque_estandar = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unidad_medida_empaque_estandar = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, related_name='materias_primas_empaque', null=True, blank=True)
    punto_reorden = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    fecha_ultima_actualizacion = models.DateField(auto_now=True)
    fecha_creacion_registro = models.DateField(auto_now_add=True)
    fecha_modificacion_registro = models.DateField(auto_now=True)
    categoria = models.ForeignKey(CategoriasMateriaPrima, on_delete=models.CASCADE)
    descripcion = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nombre


class LotesMateriasPrimas(models.Model):
    materia_prima = models.ForeignKey(MateriasPrimas, on_delete=models.CASCADE, null=False, blank=False)
    proveedor = models.ForeignKey('compras.Proveedores', on_delete=models.CASCADE, null=True, blank=True)
    fecha_recepcion = models.DateField(null=False, blank=False)
    fecha_caducidad = models.DateField(null=False, blank=False)
    cantidad_recibida = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    stock_actual_lote = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    costo_unitario_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    detalle_oc = models.ForeignKey('compras.DetalleOrdenesCompra', on_delete=models.CASCADE, null=True, blank=True)
    activo = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Lote {self.id} - {self.materia_prima.nombre} - {self.stock_actual_lote}"


class ProductosElaborados(models.Model):
    nombre_producto = models.CharField(max_length=100, null=False, blank=False, unique=True)
    SKU = models.CharField(max_length=50, null=True, blank=True, unique=True)
    descripcion = models.TextField(max_length=255, null=True, blank=True)
    tipo_manejo_venta = models.CharField(choices=[('UNIDAD', 'Unidad'), ('PESO_VOLUMEN', 'Peso_Volumen')], max_length=15, null=True, blank=True)
    unidad_medida_nominal = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=True, blank=True, related_name='productos_elaborados_unidad_nominal')
    #   Peso nominal o estándar del producto si se vende como una unidad contable.
    #   Por ejemplo, una "Torta Entera" (vendida por 'Unidad') puede tener un peso_nominal de 1.5 (kg).
    unidad_venta = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=True, blank=True, related_name='productos_elaborados_unidad_venta') ## Si es por unidad, precio total. Si es por peso_volumen, sera el precio por unidad de volumen
    precio_venta_usd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    punto_reorden = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    categoria = models.ForeignKey(CategoriasProductosElaborados, on_delete=models.CASCADE)
    fecha_creacion_registro = models.DateField(auto_now_add=True)
    es_intermediario = models.BooleanField(default=False, null=False)

    def __str__(self):
        return f"Producto {self.id} - {self.nombre_producto}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(Q(es_intermediario=True) & Q(precio_venta_usd__isnull=True) & Q(unidad_venta__isnull=True) & Q(tipo_manejo_venta__isnull=True))|
                    (Q(es_intermediario=False) & Q(precio_venta_usd__isnull=False) & Q(unidad_venta__isnull=False) & Q(tipo_manejo_venta__isnull=False)),
                name='intermedio_o_producto'
            )
        ]


class LotesProductosElaborados(models.Model):
    produccion_origen = models.ForeignKey('produccion.Produccion', on_delete=models.CASCADE,null=False, blank=False)
    producto_elaborado = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE, null=False, blank=False)
    cantidad_inicial_lote = models.DecimalField(max_digits=10, decimal_places=2, default=0) # Cantidad original producida en este lote (copiado de Produccion.cantidad_producida)
    stock_actual_lote = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fecha_produccion = models.DateField(null=False, blank=False)
    fecha_caducidad = models.DateField(null=False, blank=False)
    coste_unitario_lote_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    activo = models.BooleanField(default=False)
    peso_nominal = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    notas = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Lote {self.id} - {self.producto_elaborado.nombre_producto} - {self.stock_actual_lote}"


class ProductosIntermediosManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(es_intermediario=True)

class ProductosFinalesManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(es_intermediario=False)

class ProductosIntermedios(ProductosElaborados):
    objects = ProductosIntermediosManager()

    class Meta:
        proxy = True
        verbose_name = "Producto Intermedio"
        verbose_name_plural = "Productos Intermedios"

    def clean(self):
        if self.precio_venta_usd:
            raise ValidationError("Productos intermedios no pueden tener precio de venta")


class ProductosFinales(ProductosElaborados):
    objects = ProductosFinalesManager()

    class Meta:
        proxy = True
        verbose_name = "Producto Final"
        verbose_name_plural = "Productos Finales"

    def clean(self):
        if not self.precio_venta_usd:
            raise ValidationError("Productos finales deben tener precio de venta")


class ProductosReventa(models.Model):
    nombre_producto = models.CharField(max_length=100, null=False, blank=False, unique=True) # -- Ej: "Refresco de Cola Lata 355ml", "Jamón Cocido Superior", "Queso Gouda Pieza".
    descripcion = models.TextField(max_length=255, null=True, blank=True)
    SKU = models.CharField(max_length=50, null=True, blank=True, unique=True) # -- Ej: "RC355", "JCS", "QG".
    categoria = models.ForeignKey(CategoriasProductosReventa, on_delete=models.CASCADE)
    marca = models.CharField(max_length=100, null=True, blank=True)
    proveedor_preferido = models.ForeignKey('compras.Proveedores', on_delete=models.CASCADE, null=True, blank=True)
    tipo_manejo_venta = models.CharField(choices=[('UNIDAD', 'Unidad'), ('PESO_VOLUMEN', 'Peso_Volumen')], max_length=15, null=False, blank=False) # -- Indica si se vende por unidad fija o por peso/volumen.
    unidad_base_inventario = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=False, blank=False) # Unidad en la que se gestiona el stock (ej: "Unidad" para latas, "Gramos" para jamón).
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_venta_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0) #  Si tipo_manejo_venta es 'UNIDAD', es precio/unidad. Si es 'PESO_VOLUMEN', es precio/id_unidad_base_inventario (ej. precio por gramo).
    costo_ultima_compra_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    pecedero = models.BooleanField(default=False, null=False) # - Indica si requiere gestión de lotes por caducidad.
    activo = models.BooleanField(default=False, null=False)
    fecha_creacion_registro = models.DateField(auto_now_add=True)
    fecha_modificacion_registro = models.DateField(auto_now=True)
    
    def __str__(self):
        return f"Producto {self.id} - {self.nombre_producto} {self.stock_actual}"


class LotesProductosReventa(models.Model):
    producto_reventa = models.ForeignKey(ProductosReventa, on_delete=models.CASCADE, null=False, blank=False)
    fecha_recepcion = models.DateField(null=False, blank=False)
    fecha_caducidad = models.DateField(null=False, blank=False)
    cantidad_recibida = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    stock_actual_lote = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    coste_unitario_lote_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    detalle_oc = models.ForeignKey('compras.DetalleOrdenesCompra', on_delete=models.CASCADE, null=True, blank=True)
    proveedor = models.ForeignKey('compras.Proveedores', on_delete=models.CASCADE, null=True, blank=True)
    activo = models.BooleanField(default=False, null=False)
    notas = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Lote {self.id} - {self.producto_reventa.nombre_producto} - {self.stock_actual_lote}"


@receiver([post_save, post_delete], sender=LotesMateriasPrimas)
def update_materia_prima_stock(sender, instance, **kwargs):
    materia_prima = instance.materia_prima
    total_stock = LotesMateriasPrimas.objects.filter(
        materia_prima=materia_prima,
        fecha_caducidad__gt=timezone.now().date()
    ).aggregate(total=Sum('stock_actual_lote'))['total'] or 0
    
    materia_prima.stock_actual = total_stock
    materia_prima.save()
