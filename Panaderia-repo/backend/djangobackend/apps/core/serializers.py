from rest_framework import serializers
from .models import UnidadesDeMedida, CategoriasMateriaPrima

class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadesDeMedida
        fields = ['id', 'nombre_completo', 'abreviatura']

class CategoriaMateriaPrimaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriasMateriaPrima
        fields = ['id', 'nombre_categoria']
        
