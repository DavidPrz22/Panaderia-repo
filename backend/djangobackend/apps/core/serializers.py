from rest_framework import serializers
from .models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados, CategoriasProductosReventa

class UnidadMedidaSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnidadesDeMedida
        fields = ['id', 'nombre_completo', 'abreviatura']

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