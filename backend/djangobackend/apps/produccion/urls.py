from rest_framework.routers import DefaultRouter
from .viewsets import RecetasViewSet, RecetasSearchViewSet, ProduccionesViewSet

router = DefaultRouter()
router.register(r'recetas', RecetasViewSet)
router.register(r'recetas-search', RecetasSearchViewSet, basename='recetas-search')
router.register(r'produccion', ProduccionesViewSet, basename='produccion')

urlpatterns = router.urls