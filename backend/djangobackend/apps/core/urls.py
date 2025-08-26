from rest_framework import routers
from .viewsets import CategoriaProductoFinalViewSet, UnidadMedidaViewSet, CategoriaMateriaPrimaViewSet, CategoriaProductoIntermedioViewSet

router = routers.DefaultRouter()
router.register(r'unidades-medida', UnidadMedidaViewSet)
router.register(r'categorias-materiaprima', CategoriaMateriaPrimaViewSet)
router.register(r'categorias-producto-intermedio', CategoriaProductoIntermedioViewSet, basename='categorias-producto-intermedio')
router.register(r'categorias-producto-final', CategoriaProductoFinalViewSet, basename='categorias-producto-final')

urlpatterns = router.urls