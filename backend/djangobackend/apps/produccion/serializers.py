from rest_framework import serializers
from .models import Recetas, RecetasDetalles
from apps.produccion.models import Produccion, DetalleProduccionCosumos

class RecetasSerializer(serializers.ModelSerializer):
    componente_receta = serializers.ListField(write_only=True, required=False)
    receta_relacionada = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Recetas
        fields = [
                    'id',
                    'producto_elaborado', 
                    'nombre',
                    'fecha_creacion',
                    'fecha_modificacion',
                    'notas',
                    'componente_receta',
                    'receta_relacionada',
                ]

class RecetasSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recetas
        fields = ['id', 'nombre']


class RecetasDetallesSerializer(serializers.ModelSerializer):

    class Meta:
        model = RecetasDetalles
        fields = [
            'id',
            'receta',
            'componente_materia_prima',
            'componente_producto_intermedio',
            'cantidad'
        ]

class componentsSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    cantidad = serializers.DecimalField(max_digits=10, decimal_places=3)
    tipo = serializers.CharField()


class ProduccionSerializer(serializers.Serializer):
    productoId = serializers.IntegerField()
    cantidadProduction = serializers.IntegerField()
    peso = serializers.DecimalField(max_digits=10, decimal_places=3, required=False)
    volumen = serializers.DecimalField(max_digits=10, decimal_places=3, required=False)
    componentes = serializers.ListField(child=componentsSerializer())
    fechaExpiracion = serializers.DateField()
    tipoProducto = serializers.CharField()


class ComponentesProduccionSerializer(serializers.ModelSerializer):
    materia_prima_consumida = serializers.CharField(source='materia_prima_consumida.nombre', read_only=True, allow_null=True)
    producto_intermedio_consumido = serializers.CharField(source='producto_intermedio_consumido.nombre_producto', read_only=True, allow_null=True)
    unidad_medida = serializers.SerializerMethodField()

    class Meta:
        model = DetalleProduccionCosumos
        fields = ['materia_prima_consumida', 'producto_intermedio_consumido', 'cantidad_consumida', 'unidad_medida']

    def get_unidad_medida(self, obj):
        if obj.materia_prima_consumida:
            return obj.materia_prima_consumida.unidad_medida_base.abreviatura
        elif obj.producto_intermedio_consumido:
            return obj.producto_intermedio_consumido.unidad_produccion.abreviatura


class ProduccionDetallesSerializer(serializers.ModelSerializer):
    producto_produccion = serializers.CharField(source='producto_elaborado.nombre_producto', read_only=True)
    unidad_medida_produccion = serializers.CharField(source='unidad_medida.nombre_completo', read_only=True)
    usuario_produccion = serializers.CharField(source='usuario_creacion.username', read_only=True)
    componentes_produccion = serializers.SerializerMethodField()

    class Meta:
        model = Produccion
        fields = [
            'id',
            'producto_produccion',
            'cantidad_producida',
            'unidad_medida_produccion',
            'fecha_produccion',
            'fecha_expiracion',
            'costo_total_componentes_usd',
            'usuario_produccion',
            'componentes_produccion',
        ]

    def get_componentes_produccion(self, obj):

        componentes = DetalleProduccionCosumos.objects.filter(produccion=obj)
        return ComponentesProduccionSerializer(componentes, many=True).data
