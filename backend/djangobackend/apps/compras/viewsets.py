from rest_framework import viewsets
from apps.compras.models import Proveedores
from apps.compras.models import OrdenesCompra
from apps.compras.serializers import ProveedoresSerializer, CompraRegistroProveedoresSerializer, OrdenesCompraSerializer
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


class OrdenesCompraViewSet(viewsets.ModelViewSet):
    queryset = OrdenesCompra.objects.all()
    serializer_class = OrdenesCompraSerializer