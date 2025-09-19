from rest_framework import viewsets
from apps.compras.models import Proveedores
from apps.compras.serializers import ProveedoresSerializer

class ProveedoresViewSet(viewsets.ModelViewSet):
    queryset = Proveedores.objects.all()
    serializer_class = ProveedoresSerializer