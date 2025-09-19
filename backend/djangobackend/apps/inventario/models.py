from django.db import models
from apps.core.models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosReventa, CategoriasProductosElaborados
from django.core.cache import cache
from django.db.models import Q, Sum
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone
from django.core.exceptions import ValidationError

# Create your models here.
class LotesStatus(models.TextChoices):
    DISPONIBLE = 'DISPONIBLE', 'Disponible para uso'
    EXPIRADO = 'EXPIRADO', 'Expirado'
    AGOTADO = 'AGOTADO', 'Agotado'
    INACTIVO = 'INACTIVO', 'Inactivo'


class MedidasFisicas(models.TextChoices):
    UNIDAD = 'UNIDAD', 'Unidad'
    PESO = 'PESO', 'Peso'
    VOLUMEN = 'VOLUMEN', 'Volumen'


class ComponentesStockManagement(models.Model):

    def actualizar_stock(self):
        if isinstance(self, MateriasPrimas):
            lote_total = LotesMateriasPrimas.objects.filter(
                materia_prima=self, 
                fecha_caducidad__gt=timezone.now().date(), 
                estado=LotesStatus.DISPONIBLE
            ).aggregate(total=Sum('stock_actual_lote'))
            stock_total = lote_total.get('total') or 0

            self.__class__.objects.filter(id=self.id).update(stock_actual=stock_total)
            return stock_total
    
        elif hasattr(self, 'lotesproductoselaborados_set'):

            lote_total = LotesProductosElaborados.objects.filter(
                producto_elaborado=self, 
                fecha_caducidad__gt=timezone.now().date(), 
                estado=LotesStatus.DISPONIBLE
            ).aggregate(total=Sum('stock_actual_lote'))
    
            stock_total = lote_total.get('total') or 0
            self.__class__.objects.filter(id=self.id).update(stock_actual=stock_total)
            return stock_total

    def checkAvailability(self, cantidad):
        return self.stock_actual >= cantidad

    def _get_display_name(self):
        """Helper method to get display name for different product types"""
        if hasattr(self, 'nombre'):
            return self.nombre
        elif hasattr(self, 'nombre_producto'):
            return self.nombre_producto
        return str(self)

    def get_closest_expire_lot(self, exclude_id=None):
        if isinstance(self, MateriasPrimas):
            queryset = LotesMateriasPrimas.objects.filter(
                materia_prima=self, 
                estado=LotesStatus.DISPONIBLE
            )
            if exclude_id:
                queryset = queryset.exclude(id=exclude_id)
            return queryset.order_by('fecha_caducidad').first()

        elif hasattr(self, 'lotesproductoselaborados_set'):
            queryset = LotesProductosElaborados.objects.filter(
                producto_elaborado=self, 
                estado=LotesStatus.DISPONIBLE
            )
            if exclude_id:
                queryset = queryset.exclude(id=exclude_id)

            return queryset.order_by('fecha_caducidad').first()

    def calculate_price(self, precio, cantidad):
        return precio * cantidad

    def consumeStock(self, cantidad):
        if not self.checkAvailability(cantidad):
            raise ValidationError(f"Stock insuficiente. Disponible: {self.stock_actual}, Requerido: {cantidad}")
    
        cantidad_restante = cantidad
        precio_consumo = 0
        lotes_consumidos = []

        while cantidad_restante > 0:
            lote_consume = self.get_closest_expire_lot()
            
            if not lote_consume:
                raise ValidationError(f"No hay lotes disponibles para {self._get_display_name()}")

            # Calculate consumption from this lot
            cantidad_del_lote = min(cantidad_restante, lote_consume.stock_actual_lote)
            
            # Update lot stock
            lote_consume.stock_actual_lote -= cantidad_del_lote
            if lote_consume.stock_actual_lote <= 0:
                lote_consume.estado = LotesStatus.AGOTADO
            lote_consume.save()
            
            # Calculate cost
            precio_consumo += self.calculate_price(lote_consume.costo_unitario_usd, cantidad_del_lote)
            
            # Track consumed lot
            lotes_consumidos.append({
                'lote_id': lote_consume.id,
                'cantidad_consumida': cantidad_del_lote,
                'costo_unitario': lote_consume.costo_unitario_usd
            })
            
            cantidad_restante -= cantidad_del_lote

        # Update main stock
        self.stock_actual -= cantidad
        self.save(update_fields=['stock_actual'])

        return {
            "lotes_consumidos": lotes_consumidos,
            "costo_total_consumo": precio_consumo,
            "cantidad_total_consumida": cantidad
        }

    @classmethod
    def expirar_todos_lotes_viejos(cls, force=False):
        hoy = timezone.now().date()
        cache_key = f"expirar_todos_lotes_viejos_{hoy}"

        if not force and cache.get(cache_key):
            return {"resumen": [], "count": 0, "cached": True}

        cache.set(cache_key, True, 86400)  # Cache for 24 hours

        expired = []

        expired.append(LotesMateriasPrimas.objects.filter(
            fecha_caducidad__lte=timezone.now().date(),
            estado=LotesStatus.DISPONIBLE,
        ))

        expired.append(LotesProductosElaborados.objects.filter(
            fecha_caducidad__lte=timezone.now().date(),
            estado=LotesStatus.DISPONIBLE,
        ))

        expired.append(LotesProductosElaborados.objects.filter(
            fecha_caducidad__lte=timezone.now().date(),
            estado=LotesStatus.DISPONIBLE,
        ))

        resumen = []
        for lote in expired.values():
            resumen.append({
                'lote_id': lote['id'],
                'componente': lote.get('materia_prima')._get_display_name() or lote.get('producto_elaborado')._get_display_name(),
                'fecha_caducidad': lote['fecha_caducidad'],
                'stock_expirado': lote['stock_actual_lote']
            })

        count = expired.values().update(estado=LotesStatus.EXPIRADO)

        affected_materials = cls.objects.filter(
            lotesmateriasprimas__fecha_caducidad__lte=timezone.now().date()
        ).distinct()

        for material in affected_materials:
            material.actualizar_stock()

        return {"resumen": resumen, "count": count}


class MateriasPrimas(ComponentesStockManagement):
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

    def expirar_lotes_viejos(self, force=False):
        ahora = timezone.now().date()
        cache_key = f"expirar_lotes_viejos_{ahora}"

        if not force and cache.get(cache_key):
            return {"resumen": [], "cached": True}

        cache.set(cache_key, True, 86400)  # Cache for 24 hours
        lotes_expirados = LotesMateriasPrimas.objects.filter(materia_prima=self, fecha_caducidad__lte=ahora, estado=LotesStatus.DISPONIBLE)

        resumen = []
        lotes_actualizar = []

        for lote in lotes_expirados:
            if lote.stock_actual_lote > 0:
                resumen.append({
                    'lote_id': lote.id,
                    'materia_prima': self.nombre,
                    'stock_expirado': lote.stock_actual_lote,
                    'fecha_caducidad': lote.fecha_caducidad
                })
                lote.activo = False
                lotes_actualizar.append(lote)
        LotesMateriasPrimas.objects.bulk_update(lotes_actualizar, ['activo',])

        return {"resumen": resumen}

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
    estado = models.CharField(
        max_length=10, 
        choices=LotesStatus.choices, 
        default=LotesStatus.DISPONIBLE
    )
    activo = models.BooleanField(default=True) ## ELIMINAR DESPUES SIN USAR

    def __str__(self):
        return f"Lote {self.id} - {self.materia_prima.nombre} - {self.stock_actual_lote}"

    def determinar_estado(self):
        """Determine lot status based on expiration and FEFO rules"""
        hoy = timezone.now().date()
        
        if self.fecha_caducidad <= hoy:
            return LotesStatus.EXPIRADO
        elif self.stock_actual_lote <= 0:
            return LotesStatus.AGOTADO
        else:
            # Check if this is the earliest expiring lot
            lotes_activos = LotesMateriasPrimas.objects.filter(
                materia_prima=self.materia_prima,
                fecha_caducidad__gt=hoy,
                stock_actual_lote__gt=0
            ).order_by('fecha_caducidad')

            if lotes_activos.first() == self:
                return LotesStatus.DISPONIBLE
            else:
                return LotesStatus.INACTIVO # Este lote no es el más antiguo, por lo que no está disponible para uso inmediato

    @classmethod
    def actualizar_estados(cls, materia_prima_id):
        """Update FEFO status for all lots of a material"""
        lotes = cls.objects.filter(materia_prima_id=materia_prima_id)

        for lote in lotes:
            nuevo_estado = lote.determinar_estado()
            if lote.estado != nuevo_estado:
                lote.estado = nuevo_estado
                lote.save(update_fields=['estado'])


class ProductosElaborados(ComponentesStockManagement):
    nombre_producto = models.CharField(max_length=100, null=False, blank=False, unique=True)
    SKU = models.CharField(max_length=50, null=True, blank=True, unique=True)
    descripcion = models.TextField(max_length=255, null=True, blank=True)

    unidad_produccion = models.ForeignKey(
        UnidadesDeMedida, on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='productos_elaborados_unidad_produccion',
        help_text="Unidad en la que se produce y se gestiona el stock (e.g., Unidades, Gramos).")

    unidad_venta = models.ForeignKey(
        UnidadesDeMedida, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='productos_elaborados_unidad_venta', 
        help_text="Unidad en la que se vende el producto (e.g., Unidades, Kilogramos, Litros).")

    precio_venta_usd = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    punto_reorden = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=False, blank=False)
    stock_actual = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    categoria = models.ForeignKey(CategoriasProductosElaborados, on_delete=models.CASCADE)
    fecha_creacion_registro = models.DateField(auto_now_add=True)
    fecha_modificacion_registro = models.DateField(auto_now=True)

    vendible_por_medida_real  = models.BooleanField(
        null=True,
        blank=True,
        help_text="Si es True, el precio final se calcula midiendo peso/volumen en la venta."
    )

    tipo_medida_fisica = models.CharField(
        choices=MedidasFisicas.choices,
        max_length=10, null=False, blank=False, default=MedidasFisicas.PESO
    )

    es_intermediario = models.BooleanField(default=False, null=False)

    def checkAvailability(self, cantidad):
        return self.stock_actual >= cantidad

    def clean(self):
        """
        Custom validation to enforce business logic for products.
        """
        super().clean()

        if self.vendible_por_medida_real  and self.unidad_venta.nombre_completo == 'Unidad':
            raise ValidationError(
                "Si el precio se calcula en la venta, la unidad de venta no puede ser 'Unidad'. Debe ser KG, GR, LT, etc."
            )

        if not self.vendible_por_medida_real  and self.unidad_venta.nombre_completo != 'Unidad':
            raise ValidationError(
                "Si el precio es fijo (no calculado en venta), la unidad de venta debe ser 'Unidad'."
            )

    def __str__(self):
        return f"Producto {self.id} - {self.nombre_producto}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(Q(es_intermediario=True) & Q(precio_venta_usd__isnull=True) & Q(unidad_venta__isnull=True) & Q(vendible_por_medida_real__isnull=True))|
                    (Q(es_intermediario=False) & Q(precio_venta_usd__isnull=False) & Q(unidad_venta__isnull=False) & Q(vendible_por_medida_real__isnull=False)),
                name='intermedio_o_producto'
            )
        ]


class LotesProductosElaborados(models.Model):
    produccion_origen = models.ForeignKey('produccion.Produccion', on_delete=models.CASCADE,null=False, blank=False)
    producto_elaborado = models.ForeignKey(ProductosElaborados, on_delete=models.CASCADE, null=False, blank=False)
    cantidad_inicial_lote = models.DecimalField(max_digits=10, decimal_places=2, default=0) # Cantidad original producida en este lote (copiado de Produccion.cantidad_producida)
    stock_actual_lote = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fecha_produccion = models.DateField(null=False, blank=False, auto_now_add=True)
    fecha_caducidad = models.DateField(null=False, blank=False)

    estado = models.CharField(
        max_length=10,
        choices=LotesStatus.choices,
        default=LotesStatus.DISPONIBLE
    )
    coste_total_lote_usd = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    peso_total_lote_gramos = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Actual measured weight of entire batch in grams"
    )

    volumen_total_lote_ml = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Actual measured volume of entire batch in milliliters"
    )

    @property
    def peso_promedio_por_unidad(self):
        if self.cantidad_inicial_lote > 0 and self.peso_total_lote_gramos:
            return self.peso_total_lote_gramos / self.cantidad_inicial_lote
        return 0

    @property
    def volumen_promedio_por_unidad(self):
        if self.cantidad_inicial_lote > 0 and self.volumen_total_lote_ml:
            return self.volumen_total_lote_ml / self.cantidad_inicial_lote
        return 0

    @property
    def costo_unitario_usd(self):
        return self.coste_total_lote_usd / self.cantidad_inicial_lote

    def __str__(self):
        return f"Lote {self.id} - {self.producto_elaborado.nombre_producto} - {self.stock_actual_lote}"


    def clean(self):
        super().clean()

        if self.producto_elaborado.tipo_medida_fisica == MedidasFisicas.PESO and self.volumen_total_lote_ml:
            raise ValidationError("No puede especificar volumen para un producto medido por peso.")
        
        if self.producto_elaborado.tipo_medida_fisica == MedidasFisicas.VOLUMEN and self.peso_total_lote_gramos:
            raise ValidationError("No puede especificar peso para un producto medido por volumen.")


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

    if getattr(instance, "id", None) and instance.fecha_caducidad <= timezone.now().date() and instance.estado == LotesStatus.DISPONIBLE:
        expired_lots = LotesMateriasPrimas.objects.filter(
            materia_prima=materia_prima,
            fecha_caducidad__lte=timezone.now().date(),
            estado=LotesStatus.DISPONIBLE
        )
        expired_lots.update(estado=LotesStatus.EXPIRADO)

    total_stock = LotesMateriasPrimas.objects.filter(
        materia_prima=materia_prima,
        fecha_caducidad__gt=timezone.now().date(),
        estado=LotesStatus.DISPONIBLE
    ).aggregate(total=Sum('stock_actual_lote'))['total'] or 0

    MateriasPrimas.objects.filter(id=materia_prima.id).update(stock_actual=total_stock)
