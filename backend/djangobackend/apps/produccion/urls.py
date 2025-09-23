from rest_framework.routers import DefaultRouter
from .viewsets import RecetasViewSet, RecetasSearchViewSet, ProduccionesViewSet, ProduccionDetallesViewSet

router = DefaultRouter()
router.register(r'recetas', RecetasViewSet)
router.register(r'recetas-search', RecetasSearchViewSet, basename='recetas-search')
router.register(r'produccion', ProduccionesViewSet, basename='produccion')
router.register(r'produccion-detalles', ProduccionDetallesViewSet, basename='produccion-detalles')

urlpatterns = router.urls