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

    def list(self, request, *args, **kwargs):
        limit = 100
        min_notifications_to_show = 20
        
        notificaciones_sin_leer = Notificaciones.objects.filter(
            leida=False
        ).order_by('-fecha_notificacion')[:limit]

        notificaciones_count = notificaciones_sin_leer.count()
        
        if notificaciones_count == 0:
            notificaciones_leidas = Notificaciones.objects.filter(
                leida=True
            ).order_by('-fecha_notificacion')[:min_notifications_to_show]
            serializer = NotificacionesSerializer(notificaciones_leidas, many=True)
            return Response({"notificaciones": serializer.data}, status=status.HTTP_200_OK)
        
        # when notifications are less than min_notifications_to_show, get the rest of the notifications
        # If there's more than min_notifications_to_show unread notifications, get only the unread notifications
        # This case is focused in a case where there's few unread notifications and i want to show a history of notifications to fill upp
        if notificaciones_count < min_notifications_to_show:
            notificaciones_leidas = Notificaciones.objects.filter(
                leida=True
            ).order_by('-fecha_notificacion')[:(min_notifications_to_show - notificaciones_count)]
            
            all_notificaciones = list(notificaciones_sin_leer) + list(notificaciones_leidas)
            
            all_notificaciones.sort(key=lambda x: x.fecha_notificacion, reverse=True)
            
            serializer = NotificacionesSerializer(all_notificaciones, many=True)
        # Return the base amount of unread notifications
        else:
            serializer = NotificacionesSerializer(notificaciones_sin_leer, many=True)
        
        # notificaciones_sin_leer.update(leida=True)

        return Response({"notificaciones": serializer.data}, status=status.HTTP_200_OK)
