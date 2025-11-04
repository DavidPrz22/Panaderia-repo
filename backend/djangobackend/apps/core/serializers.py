from rest_framework import serializers
from .models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados, CategoriasProductosReventa, MetodosDePago, EstadosOrdenVenta, EstadosOrdenCompra

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