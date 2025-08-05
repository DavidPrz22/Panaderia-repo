from rest_framework import serializers
from .models import Recetas, RecetasDetalles

class RecetasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recetas
        fields = [
                    'id',
                    'producto_elaborado', 
                    'componente_materia_prima', 
                    'componente_producto_intermedio',
                    'receta_detalle'
                ]


class RecetasDetallesSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecetasDetalles
        fields = ['id', 'nombre', 'fecha_creacion']