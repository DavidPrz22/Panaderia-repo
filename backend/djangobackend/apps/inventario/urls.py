from rest_framework.routers import DefaultRouter
from apps.inventario.viewsets import MateriaPrimaViewSet, LotesMateriaPrimaViewSet, MateriaPrimaSearchViewSet, ProductosIntermediosViewSet, ProductosFinalesViewSet, ProductosIntermediosDetallesViewSet, ProductosElaboradosViewSet

router = DefaultRouter()
router.register('materiaprima', MateriaPrimaViewSet, basename='materiaprima')
router.register('lotesmateriaprima', LotesMateriaPrimaViewSet, basename='lotesmateriaprima')
router.register('materiaprimasearch', MateriaPrimaSearchViewSet, basename='materiaprimasearch')
router.register('productosintermedios', ProductosIntermediosViewSet, basename='productosintermedios')
router.register('productosfinales', ProductosFinalesViewSet, basename='productosfinales')
router.register('productosintermedios-detalles', ProductosIntermediosDetallesViewSet, basename='productosintermedios-detalles')
router.register('productoselaborados', ProductosElaboradosViewSet, basename='productoselaborados')


urlpatterns = router.urls
