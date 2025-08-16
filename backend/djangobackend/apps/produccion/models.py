from django.db import models
from apps.inventario.models import ProductosElaborados, MateriasPrimas, LotesMateriasPrimas, LotesProductosElaborados
from apps.core.models import UnidadesDeMedida
from django.db.models import Q
from apps.users.models import User

# Create your models here.

class Recetas(models.Model):
    nombre = models.CharField(max_length=255, null=True, blank=True)
    producto_elaborado = models.OneToOneField(ProductosElaborados, on_delete=models.SET_NULL, related_name='receta_producto_elaborado', null=True, blank=True, unique=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    fecha_modificacion = models.DateTimeField(auto_now=True, null=True, blank=True)
    notas = models.TextField(max_length=250, null=True, blank=True)

    def __str__(self):
        return f"{self.nombre}"


class RecetasDetalles(models.Model):
    receta = models.ForeignKey(Recetas, on_delete=models.CASCADE, null=True, blank=True, related_name='componentes')
    componente_materia_prima = models.ForeignKey(MateriasPrimas, on_delete=models.CASCADE, null=True, blank=True)
    componente_producto_intermedio = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE, related_name='receta_componente_producto_intermedio', null=True, blank=True)

    def __str__(self):
        if self.componente_materia_prima:
            return f"{self.receta.nombre} - {self.componente_materia_prima.nombre} - {self.componente_materia_prima.id}"
        else:
            return f"{self.receta.nombre} - {self.componente_producto_intermedio.nombre} - {self.componente_producto_intermedio.id}"

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    Q(componente_materia_prima__isnull=False) & Q(componente_producto_intermedio__isnull=True)) |
                    (Q(componente_materia_prima__isnull=True) & Q(componente_producto_intermedio__isnull=False)),
                name="receta_un_solo_tipo_componente"
            )
        ]


class RelacionesRecetas(models.Model):
    receta_principal = models.ForeignKey(Recetas, on_delete=models.CASCADE, null=False, blank=False, related_name='receta_principal')
    subreceta = models.ForeignKey(Recetas, on_delete=models.CASCADE, null=False, blank=False, related_name='subreceta')

    def __str__(self):
        return f"Master: {self.receta_principal.nombre} - Sub: {self.subreceta.nombre}"


class Produccion(models.Model):
    producto_elaborado = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE, null=False, blank=False)
    cantidad_producida = models.DecimalField(max_digits=10, decimal_places=3, null=False, blank=False)
    fecha_produccion = models.DateField(null=False, blank=False)
    costo_total_componentes_usd = models.DecimalField(max_digits=10, decimal_places=3)
    notas = models.TextField(null=True, blank=True)
    usuario_creacion = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.producto_elaborado.nombre} - {self.fecha_produccion}"


class DetalleProduccionCosumos(models.Model):
    produccion = models.ForeignKey(Produccion, on_delete=models.CASCADE, null=False, blank=False)
    materia_prima_consumida = models.ForeignKey(MateriasPrimas, on_delete=models.CASCADE)
    producto_intermedio_consumido = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE)
    lote_materia_prima_consumida = models.ForeignKey(LotesMateriasPrimas, on_delete=models.CASCADE)
    lote_producto_intermedio_consumido = models.ForeignKey(LotesProductosElaborados, on_delete=models.CASCADE)
    cantidad_consumida = models.DecimalField(max_digits=10, decimal_places=3, null=False, blank=False)
    unidad_medida = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.produccion.producto_elaborado.nombre} - {self.materia_prima_consumida.nombre or self.producto_intermedio_consumido.nombre} - {self.cantidad_consumida}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(Q(materia_prima_consumida__isnull=False) & Q(lote_materia_prima_consumida__isnull=False) & Q(producto_intermedio_consumido__isnull=True) & Q(lote_producto_intermedio_consumido__isnull=True)) |
                (Q(materia_prima_consumida__isnull=True) & Q(lote_materia_prima_consumida__isnull=True) & Q(producto_intermedio_consumido__isnull=False) & Q(lote_producto_intermedio_consumido__isnull=False)),
                name="materia_prima_or_producto_intermedio_and_lote_required"
            )
        ]


class DefinicionTransformacion(models.Model):
    nombre = models.CharField(max_length=255, null=False, blank=False)
    producto_elaborado_entrada = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE, null=False, blank=False, related_name='transformaciones_como_entrada')
    cantidad_entrada= models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0)
    unidad_medida_entrada = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=False, blank=False, related_name='transformaciones_unidad_entrada')
    producto_elaborado_salida = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE, null=False, blank=False, related_name='transformaciones_como_salida')
    unidad_medida_salida = models.ForeignKey(UnidadesDeMedida, on_delete=models.CASCADE, null=False, blank=False, related_name='transformaciones_unidad_salida')
    cantidad_salida = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0)
    usuario_creacion = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.nombre} - {self.producto_elaborado_entrada.nombre} - {self.producto_elaborado_salida.nombre}"


class LogTransformacion(models.Model):
    definicion_transformacion = models.ForeignKey(DefinicionTransformacion, on_delete=models.CASCADE)
    cantidad_producto_entrada_efectiva = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0) # Cantidad del producto de entrada que realmente se transformó en este evento (ej: se transformaron 2 tortas enteras).
    cantidad_producto_salida_total_generado = models.DecimalField(max_digits=10, decimal_places=2, null=False, blank=False, default=0) # Cantidad total del producto de salida generada en este evento (ej: si se transformaron 2 tortas y cada una produce 8 porciones, aquí sería 16)
    costo_unitario_entrada_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    costo_total_entrada_calculado_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0) # Calculado: cantidad_producto_entrada_efectiva * costo_unitario_entrada_al_momento.
    costo_unitario_salida_calculado_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0) # - Calculado: costo_total_entrada_calculado / cantidad_producto_salida_total_generado. Este es el costo de cada unidad de porción generada.
    usuario_creacion = models.ForeignKey(User, on_delete=models.CASCADE)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    notas = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.definicion_transformacion.nombre} - {self.cantidad_producto_entrada_efectiva} - {self.cantidad_producto_salida_total_generado}"