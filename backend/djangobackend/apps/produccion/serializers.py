from rest_framework import serializers
from .models import Recetas, RecetasDetalles

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
    cantidad = serializers.FloatField()
    tipoComponente = serializers.CharField()


class ProduccionSerializer(serializers.Serializer):
    productoId = serializers.IntegerField()
    cantidadProduction = serializers.IntegerField()
    peso = serializers.FloatField(required=False)
    componentes = serializers.ListField(child=componentsSerializer())
    fechaExpiracion = serializers.DateField()
    tipoProducto = serializers.CharField()
