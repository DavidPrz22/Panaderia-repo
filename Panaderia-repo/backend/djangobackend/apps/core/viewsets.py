from rest_framework import viewsets
from .models import UnidadesDeMedida, CategoriasMateriaPrima
from .serializers import UnidadMedidaSerializer, CategoriaMateriaPrimaSerializer

class UnidadMedidaViewSet(viewsets.ModelViewSet):
    queryset = UnidadesDeMedida.objects.all()
    serializer_class = UnidadMedidaSerializer

class CategoriaMateriaPrimaViewSet(viewsets.ModelViewSet):
    queryset = CategoriasMateriaPrima.objects.all()
    serializer_class = CategoriaMateriaPrimaSerializer