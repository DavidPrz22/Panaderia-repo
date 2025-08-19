from rest_framework.routers import DefaultRouter
from .viewsets import RecetasViewSet, RecetasSearchViewSet

router = DefaultRouter()
router.register(r'recetas', RecetasViewSet)
router.register(r'recetas-search', RecetasSearchViewSet, basename='recetas-search')

urlpatterns = router.urls