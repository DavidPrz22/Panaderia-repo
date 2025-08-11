from rest_framework import serializers
from .models import Recetas, RecetasDetalles

class RecetasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recetas
        fields = [
                    'id',
                    'producto_elaborado', 
                    'nombre',
                    'fecha_creacion',
                    'fecha_modificacion',
                    'notas',
                ]

class RecetasSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recetas
        fields = ['id', 'nombre']


class RecetasDetallesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecetasDetalles
        fields = ['id', 'receta', 'componente_materia_prima', 'componente_producto_intermedio']