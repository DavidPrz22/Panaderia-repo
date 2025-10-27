from django.db import models
from apps.users.models import User
from apps.core.models import EstadosOrdenCompra, MetodosDePago
from apps.core.models import UnidadesDeMedida
from django.db.models import Q

# Create your models here.
class Proveedores(models.Model):
    nombre_proveedor = models.CharField(max_length=100, null=False, blank=False)
    apellido_proveedor = models.CharField(max_length=100, null=True, blank=True)
    nombre_comercial = models.CharField(max_length=100, null=True, blank=True)
    email_contacto = models.EmailField(max_length=100, null=True, blank=True)
    telefono_contacto = models.CharField(max_length=100, null=True, blank=True)
    fecha_creacion_registro = models.DateField(auto_now_add=True)
    usuario_registro = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True) # cambiar a false
    notas = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nombre_proveedor


class OrdenesCompra(models.Model):
    proveedor = models.ForeignKey(Proveedores, on_delete=models.CASCADE, null=False, blank=False)
    usuario_creador = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    fecha_emision_oc = models.DateField(null=False, blank=False)
    fecha_entrega_esperada = models.DateField(null=False, blank=False)
    fecha_entrega_real = models.DateField(null=True, blank=True)
    estado_oc = models.ForeignKey(EstadosOrdenCompra, on_delete=models.CASCADE, null=False, blank=False)
    subtotal_oc_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monto_impuestos_oc_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monto_total_oc_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    metodo_pago = models.ForeignKey(MetodosDePago, on_delete=models.CASCADE, null=False, blank=False)
    tasa_cambio_aplicada = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal_oc_ves = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monto_impuestos_oc_ves = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    monto_total_oc_ves = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    direccion_envio = models.TextField(max_length=255, null=True, blank=True)
    fecha_envio_oc = models.DateField(null=True, blank=True)
    email_enviado = models.EmailField(max_length=100, null=True, blank=True)
    terminos_pago = models.CharField(max_length=100, null=True, blank=True)
    notas = models.TextField(max_length=255, null=True, blank=True)


    def __str__(self):
        return f"OC {self.id} - {self.proveedor.nombre_proveedor}"


class DetalleOrdenesCompra(models.Model):
    orden_compra = models.ForeignKey(OrdenesCompra, on_delete=models.CASCADE, null=False, blank=False)
    materia_prima = models.ForeignKey('inventario.MateriasPrimas', on_delete=models.CASCADE, null=True)
    producto_reventa = models.ForeignKey('inventario.ProductosReventa', on_delete=models.CASCADE, null=True)
    cantidad_solicitada = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cantidad_recibida = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unidad_medida_compra = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=False, blank=False)
    costo_unitario_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal_linea_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notas = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        if self.materia_prima:
            return f"Detalle OC {self.id} - {self.materia_prima.nombre}"
        return f"Detalle OC {self.id} - {self.producto_reventa.nombre_producto}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(Q(materia_prima__isnull=False) & Q(producto_reventa__isnull=True)) | (Q(materia_prima__isnull=True) & Q(producto_reventa__isnull=False)),
                name='detalle_orden_compra_un_solo_tipo_de_producto'
            )
        ]