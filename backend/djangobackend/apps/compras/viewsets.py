from rest_framework import viewsets
from apps.compras.models import Proveedores
from apps.compras.serializers import ProveedoresSerializer, CompraRegistroProveedoresSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

class ProveedoresViewSet(viewsets.ModelViewSet):
    queryset = Proveedores.objects.all()
    serializer_class = ProveedoresSerializer

    @action(detail=False, methods=['get'])
    def compra_registro(self, request):
        queryset = Proveedores.objects.all()
        serializer = CompraRegistroProveedoresSerializer(queryset, many=True)
        return Response(serializer.data)


