from rest_framework.routers import DefaultRouter
from apps.inventario.viewsets import MateriaPrimaViewSet, LotesMateriaPrimaViewSet, MateriaPrimaSearchViewSet

router = DefaultRouter()
router.register('materiaprima', MateriaPrimaViewSet, basename='materiaprima')
router.register('lotesmateriaprima', LotesMateriaPrimaViewSet, basename='lotesmateriaprima')
router.register('materiaprimasearch', MateriaPrimaSearchViewSet, basename='materiaprimasearch')

urlpatterns = router.urls
