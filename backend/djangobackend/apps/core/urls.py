from rest_framework import routers
from .viewsets import UnidadMedidaViewSet, CategoriaMateriaPrimaViewSet, CategoriaProductoIntermedioViewSet, CategoriaProductoElaboradoViewSet

router = routers.DefaultRouter()
router.register(r'unidades-medida', UnidadMedidaViewSet)
router.register(r'categorias-materiaprima', CategoriaMateriaPrimaViewSet)
router.register(r'categorias-producto-intermedio', CategoriaProductoIntermedioViewSet, basename='categorias-producto-intermedio')
router.register(r'categorias-producto-elaborado', CategoriaProductoElaboradoViewSet, basename='categorias-producto-elaborado')

urlpatterns = router.urls