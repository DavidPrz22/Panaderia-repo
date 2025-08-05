from rest_framework.routers import DefaultRouter
from .viewsets import RecetasViewSet

router = DefaultRouter()
router.register(r'recetas', RecetasViewSet)

urlpatterns = router.urls