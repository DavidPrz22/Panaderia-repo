from django.db import models
from apps.users.models import User
from django.db.models import Q


# Create your models here.
class Transformacion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre_transformacion = models.CharField(max_length=255, null=False, blank=False)
    cantidad_origen = models.DecimalField(max_digits=10, decimal_places=3, null=False, blank=False)
    cantidad_destino = models.DecimalField(max_digits=10, decimal_places=3, null=False, blank=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return f"Transformación {self.id}: {self.producto_origen.nombre} a {self.producto_destino.nombre}"

class EjecutarTransformacion(models.Model):
    id = models.AutoField(primary_key=True)
    nombre_transformacion = models.CharField(max_length=255, null=False, blank=False)
    producto_origen = models.ForeignKey('inventario.ProductosElaborados', on_delete=models.CASCADE, related_name='ejecutar_transformacion_producto_origen')
    producto_destino = models.ForeignKey('inventario.ProductosElaborados', on_delete=models.CASCADE, related_name='ejecutar_transformacion_producto_destino')
    fecha_ejecucion = models.DateTimeField(auto_now_add=True)