from rest_framework.routers import DefaultRouter
from apps.inventario.viewsets import ComponenteSearchViewSet, MateriaPrimaViewSet, LotesMateriaPrimaViewSet, ProductosFinalesDetallesViewSet, ProductosIntermediosViewSet, ProductosFinalesViewSet, ProductosIntermediosDetallesViewSet, ProductosElaboradosViewSet, ProductosFinalesSearchViewset, ProductosIntermediosSearchViewSet, ProductosFinalesListaTransformacionViewSet, LotesProductosElaboradosViewSet, ProductosReventaViewSet, ProductosReventaDetallesViewSet

router = DefaultRouter()
router.register('materiaprima', MateriaPrimaViewSet, basename='materiaprima')
router.register('lotesmateriaprima', LotesMateriaPrimaViewSet, basename='lotesmateriaprima')
router.register('componentes-search', ComponenteSearchViewSet, basename='componentes-search')
router.register('productosintermedios', ProductosIntermediosViewSet, basename='productosintermedios')
router.register('productosfinales', ProductosFinalesViewSet, basename='productosfinales')
router.register('productoselaborados', ProductosElaboradosViewSet, basename='productoselaborados')
router.register('productosfinales-lista-transformacion', ProductosFinalesListaTransformacionViewSet, basename='productosfinales-lista-transformacion')
router.register('productosintermedios-detalles', ProductosIntermediosDetallesViewSet, basename='productosintermedios-detalles')
router.register('productosfinales-detalles', ProductosFinalesDetallesViewSet, basename='productosfinales-detalles')
router.register('productosfinales-search', ProductosFinalesSearchViewset, basename='productosfinales-search')
router.register('productosintermedios-search', ProductosIntermediosSearchViewSet, basename='productosintermedios-search')
router.register('lotes-productos-elaborados', LotesProductosElaboradosViewSet, basename='lotes-productos-elaborados')
router.register('productosreventa-detalles', ProductosReventaDetallesViewSet, basename='productosreventa-detalles')
router.register('productosreventa', ProductosReventaViewSet, basename='productosreventa')

urlpatterns = router.urls
