from rest_framework import viewsets
from .models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados, CategoriasProductosReventa, MetodosDePago, EstadosOrdenVenta
from .serializers import UnidadMedidaSerializer, CategoriaMateriaPrimaSerializer, CategoriaProductoSerializer, CategoriaProductosReventaSerializer, MetodosDePagoSerializer, EstadosOrdenVentaSerializer

class UnidadMedidaViewSet(viewsets.ModelViewSet):
    queryset = UnidadesDeMedida.objects.all()
    serializer_class = UnidadMedidaSerializer

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
