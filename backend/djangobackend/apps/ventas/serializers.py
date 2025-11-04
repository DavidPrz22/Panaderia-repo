from rest_framework import serializers
from apps.ventas.models import Clientes

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = ['id', 'nombre_cliente', 'apellido_cliente', 'rif_cedula', 'email', 'telefono', 'notas', 'fecha_registro']
        