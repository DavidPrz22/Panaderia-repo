from rest_framework import routers
from .viewsets import CategoriaProductoFinalViewSet, UnidadMedidaViewSet, CategoriaMateriaPrimaViewSet, CategoriaProductoIntermedioViewSet, CategoriaProductosReventaViewSet, EstadosOrdenVentaViewSet, MetodosDePagoViewSet

router = routers.DefaultRouter()
router.register(r'unidades-medida', UnidadMedidaViewSet)
router.register(r'categorias-materiaprima', CategoriaMateriaPrimaViewSet)
router.register(r'categorias-producto-intermedio', CategoriaProductoIntermedioViewSet, basename='categorias-producto-intermedio')
router.register(r'categorias-producto-final', CategoriaProductoFinalViewSet, basename='categorias-producto-final')
router.register(r'categorias-productos-reventa', CategoriaProductosReventaViewSet)
router.register(r'estados-orden-venta', EstadosOrdenVentaViewSet)
router.register(r'metodos-de-pago', MetodosDePagoViewSet)

urlpatterns = router.urls