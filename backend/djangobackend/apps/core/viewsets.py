from rest_framework import viewsets
from .models import (
    UnidadesDeMedida, 
    CategoriasMateriaPrima, 
    CategoriasProductosElaborados, 
    CategoriasProductosReventa, 
    MetodosDePago, 
    EstadosOrdenVenta, 
    EstadosOrdenCompra, 
    ConversionesUnidades, 
    Notificaciones 
    )

from .serializers import (
    UnidadMedidaSerializer, 
    CategoriaMateriaPrimaSerializer, 
    CategoriaProductoSerializer, 
    CategoriaProductosReventaSerializer, 
    MetodosDePagoSerializer, 
    EstadosOrdenVentaSerializer, 
    EstadosOrdenCompraSerializer, 
    ConversionUnidadSerializer, 
    NotificacionesSerializer
    )

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

class UnidadMedidaViewSet(viewsets.ModelViewSet):
    queryset = UnidadesDeMedida.objects.all()
    serializer_class = UnidadMedidaSerializer


class ConversionUnidadViewSet(viewsets.ModelViewSet):
    queryset = ConversionesUnidades.objects.all()
    serializer_class = ConversionUnidadSerializer

class CategoriaMateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = CategoriasMateriaPrima.objects.all()
    serializer_class = CategoriaMateriaPrimaSerializer


class CategoriaProductoIntermedioViewSet(viewsets.ModelViewSet):
    queryset = CategoriasProductosElaborados.objects.filter(es_intermediario=True)
    serializer_class = CategoriaProductoSerializer


class CategoriaProductoFinalViewSet(viewsets.ModelViewSet):
    queryset = CategoriasProductosElaborados.objects.filter(es_intermediario=False)
    serializer_class = CategoriaProductoSerializer


class CategoriaProductosReventaViewSet(viewsets.ModelViewSet):
    queryset = CategoriasProductosReventa.objects.all()
    serializer_class = CategoriaProductosReventaSerializer


class MetodosDePagoViewSet(viewsets.ModelViewSet):
    queryset = MetodosDePago.objects.all()
    serializer_class = MetodosDePagoSerializer


class EstadosOrdenVentaViewSet(viewsets.ModelViewSet):
    queryset = EstadosOrdenVenta.objects.all()
    serializer_class = EstadosOrdenVentaSerializer

    @action(detail=False, methods=['get'], url_path='get-estados-registro')
    def get_estados_registro(self, request):
        estados = EstadosOrdenVenta.objects.filter(id__in=[1, 4])
        serializer = EstadosOrdenVentaSerializer(estados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EstadosOrdenCompraViewSet(viewsets.ModelViewSet):
    queryset = EstadosOrdenCompra.objects.all()
    serializer_class = EstadosOrdenCompraSerializer

    @action(detail=False, methods=['get'], url_path='get-estados-registro')
    def get_estados_registro(self, request):
        estados = EstadosOrdenCompra.objects.filter(id__in=[1, 5])
        serializer = EstadosOrdenCompraSerializer(estados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NotificacionesViewSet(viewsets.ModelViewSet):
    queryset = Notificaciones.objects.all()
    serializer_class = NotificacionesSerializer

    @action(detail=False, methods=['get'], url_path='get-notificaciones-sin-leer')
    def get_notificaciones_sin_leer(self, request):
        notificaciones = Notificaciones.objects.filter(leida=False)
        serializer = NotificacionesSerializer(notificaciones, many=True)
        return Response({"notificaciones": serializer.data}, status=status.HTTP_200_OK)
