from django.db import models

# Create your models here.

class UnidadesDeMedida(models.Model):
    nombre_completo = models.CharField(max_length=50, null=False, blank=False, unique=True)
    abreviatura = models.CharField(max_length=10, null=False, blank=False)
    descripcion = models.TextField(max_length=255, null=True, blank=True)
    tipo_medida = models.CharField(max_length=10, choices=[('peso', 'Peso'), ('volumen', 'Volumen'), ('unidad', 'Unidad'), ('longitud', 'Longitud'), ('otro', 'Otro')])

    def __str__(self):
        return self.nombre_completo


class CategoriasMateriaPrima(models.Model):
    nombre_categoria = models.CharField(max_length=100, null=False, blank=False)
    descripcion = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nombre_categoria


class CategoriasProductosElaborados(models.Model):
    nombre_categoria = models.CharField(max_length=100, null=False, blank=False)
    descripcion = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nombre_categoria


class CategoriasProductosReventa(models.Model):
    nombre_categoria = models.CharField(max_length=100, null=False, blank=False)
    descripcion = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nombre_categoria


class MetodosDePago(models.Model):
    nombre_metodo = models.CharField(max_length=100, null=False, blank=False)
    requiere_referencia = models.BooleanField(default=False)

    def __str__(self):
        return self.nombre_metodo


class EstadosOrdenVenta(models.Model):
    nombre_estado_ov = models.CharField(max_length=100, null=False, blank=False)
    descripcion = models.TextField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.nombre_estado_ov


class EstadosOrdenCompra(models.Model): # Ej: "Borrador", "Emitida", "Recibida Parcialmente", "Recibida Completa", "Cancelada"
    nombre_estado_oc = models.CharField(max_length=100, null=False, blank=False)
    descripcion = models.TextField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.nombre_estado_oc