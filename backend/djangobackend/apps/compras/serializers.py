from rest_framework import serializers
from apps.compras.models import Proveedores
from apps.compras.models import OrdenesCompra

class ProveedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedores
        fields = [
                    'id', 
                    'nombre_proveedor', 
                    'apellido_proveedor', 
                    'nombre_comercial',   
                    'email_contacto', 
                    'telefono_contacto', 
                    'fecha_creacion_registro', 
                    'usuario_registro', 
                    'notas'
                ]

class CompraRegistroProveedoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedores
        fields = [
                    'id', 
                    'nombre_proveedor'
                ]

class OrdenesCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrdenesCompra
        fields = '__all__'

