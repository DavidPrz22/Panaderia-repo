from rest_framework.routers import DefaultRouter
from apps.inventario.viewsets import ComponenteSearchViewSet, MateriaPrimaViewSet, LotesMateriaPrimaViewSet, ProductosFinalesDetallesViewSet, ProductosIntermediosViewSet, ProductosFinalesViewSet, ProductosIntermediosDetallesViewSet, ProductosElaboradosViewSet, ProductosFinalesSearchViewset, ProductosIntermediosSearchViewSet, ProductosFinalesListaTransformacionViewSet, LotesProductosElaboradosViewSet, ProductosReventaViewSet, ProductosReventaDetallesViewSet, LotesProductosReventaViewSet
from apps.inventario.views import ProductosPedidoSearchView, ProductosComprasSearchView
from django.urls import include, path

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
router.register('lotes-productos-reventa', LotesProductosReventaViewSet, basename='lotes-productos-reventa')
router.register('productosreventa', ProductosReventaViewSet, basename='productosreventa')

urlpatterns = [
    path('productos-pedidos-search/', ProductosPedidoSearchView.as_view(), name="productos-pedidos-search"),
    path('productos-compras-search/', ProductosComprasSearchView.as_view(), name="productos-compras-search"),
    path('', include(router.urls))
    ]
