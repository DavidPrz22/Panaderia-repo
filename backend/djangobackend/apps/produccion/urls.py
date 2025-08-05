from rest_framework.routers import DefaultRouter
from .viewsets import RecetasViewSet, RecetasDetallesViewSet

router = DefaultRouter()
router.register(r'recetas', RecetasViewSet)
router.register(r'recetas-detalles', RecetasDetallesViewSet)

urlpatterns = router.urls