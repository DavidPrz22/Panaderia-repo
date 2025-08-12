from rest_framework.routers import DefaultRouter
from apps.inventario.viewsets import MateriaPrimaViewSet, LotesMateriaPrimaViewSet, MateriaPrimaSearchViewSet, ProductosIntermediosViewSet, ProductosFinalesViewSet

router = DefaultRouter()
router.register('materiaprima', MateriaPrimaViewSet, basename='materiaprima')
router.register('lotesmateriaprima', LotesMateriaPrimaViewSet, basename='lotesmateriaprima')
router.register('materiaprimasearch', MateriaPrimaSearchViewSet, basename='materiaprimasearch')
router.register('productosintermedios', ProductosIntermediosViewSet, basename='productosintermedios')
router.register('productosfinales', ProductosFinalesViewSet, basename='productosfinales')

urlpatterns = router.urls
