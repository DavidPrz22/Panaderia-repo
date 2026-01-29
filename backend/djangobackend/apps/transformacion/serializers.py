from rest_framework import serializers
from .models import Transformacion
from .models import EjecutarTransformacion

class TransformacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transformacion
        fields = '__all__'

class EjecutarTransformacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EjecutarTransformacion
        fields = ['transformacion', 'producto_origen', 'producto_destino']

