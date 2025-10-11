from rest_framework import serializers
from .models import Clientes, MetodosDePago

class ClientesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clientes
        fields = ['id', 'nombre_cliente']

