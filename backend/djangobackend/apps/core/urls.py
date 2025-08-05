from rest_framework import routers
from .viewsets import UnidadMedidaViewSet, CategoriaMateriaPrimaViewSet

router = routers.DefaultRouter()
router.register(r'unidades-medida', UnidadMedidaViewSet)
router.register(r'categorias-materiaprima', CategoriaMateriaPrimaViewSet)

urlpatterns = router.urls