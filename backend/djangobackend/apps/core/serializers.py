from rest_framework import serializers
from .models import (
    UnidadesDeMedida, 
    CategoriasMateriaPrima, 
    CategoriasProductosElaborados, 
    CategoriasProductosReventa, 
    MetodosDePago, 
    EstadosOrdenVenta, 
    EstadosOrdenCompra, 
    Notificaciones, 
    ConversionesUnidades
    )

class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadesDeMedida
        fields = ['id', 'nombre_completo', 'abreviatura', 'tipo_medida']


class ConversionUnidadSerializer(serializers.ModelSerializer):
    unidad_origen_nombre = serializers.CharField(source='unidad_origen.nombre_completo', read_only=True)
    unidad_destino_nombre = serializers.CharField(source='unidad_destino.nombre_completo', read_only=True)
    
    class Meta:
        model = ConversionesUnidades
        fields = ['id', 'unidad_origen', 'unidad_origen_nombre', 'unidad_destino', 'unidad_destino_nombre', 'factor_conversion']

class CategoriaMateriaPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriasMateriaPrima
        fields = ['id', 'nombre_categoria']

class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriasProductosElaborados
        fields = ['id', 'nombre_categoria', 'es_intermediario']

class CategoriaProductosReventaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriasProductosReventa
        fields = ['id', 'nombre_categoria']

class MetodosDePagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodosDePago
        fields = ['id', 'nombre_metodo', 'requiere_referencia']

class EstadosOrdenVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadosOrdenVenta
        fields = ['id', 'nombre_estado']

class EstadosOrdenCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadosOrdenCompra
        fields = ['id', 'nombre_estado']


class NotificacionesSerializer(serializers.ModelSerializer):
    tiempo = serializers.SerializerMethodField()
    
    class Meta:
        model = Notificaciones
        fields = ['id', 'tipo_notificacion', 'tipo_producto', 'producto_id', 'descripcion', 'tiempo', 'leida', 'prioridad', 'tiempo']
    
    def get_tiempo(self, obj):
        from django.utils import timezone
        if obj.fecha_notificacion:
            delta = timezone.now() - obj.fecha_notificacion
            total_seconds = int(delta.total_seconds())
            
            if total_seconds < 60:
                return f"hace {total_seconds} segundos"
            elif total_seconds < 3600:
                minutes = total_seconds // 60
                return f"hace {minutes} minutos"
            elif total_seconds < 86400:
                hours = total_seconds // 3600
                return f"hace {hours} horas"
            else:
                days = total_seconds // 86400
                return f"hace {days} días"
        return "hace poco"