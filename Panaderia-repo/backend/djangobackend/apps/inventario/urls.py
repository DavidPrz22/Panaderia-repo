from rest_framework.routers import DefaultRouter
from apps.inventario.viewsets import MateriaPrimaViewSet, LotesMateriaPrimaViewSet

router = DefaultRouter()
router.register('materiaprima', MateriaPrimaViewSet, basename='materiaprima')
router.register('lotesmateriaprima', LotesMateriaPrimaViewSet, basename='lotesmateriaprima')

urlpatterns = router.urls
