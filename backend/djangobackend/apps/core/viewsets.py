from rest_framework import viewsets
from .models import UnidadesDeMedida, CategoriasMateriaPrima, CategoriasProductosElaborados
from .serializers import UnidadMedidaSerializer, CategoriaMateriaPrimaSerializer, CategoriaProductoSerializer

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