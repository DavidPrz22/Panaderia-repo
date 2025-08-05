from rest_framework import serializers
from apps.compras.models import Proveedores

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

