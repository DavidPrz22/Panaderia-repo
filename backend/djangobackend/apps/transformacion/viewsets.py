from rest_framework import viewsets
from .models import Transformacion
from .serializers import TransformacionSerializer
from .models import EjecutarTransformacion
from .serializers import EjecutarTransformacionSerializer

class TransformacionViewSet(viewsets.ModelViewSet):
    queryset = Transformacion.objects.all()
    serializer_class = TransformacionSerializer

class EjecutarTransformacionViewSet(viewsets.ModelViewSet):
    queryset = EjecutarTransformacion.objects.all()
    serializer_class = EjecutarTransformacionSerializer

