from rest_framework.routers import DefaultRouter
from apps.compras.viewsets import ProveedoresViewSet, OrdenesCompraViewSet, ComprasViewSet, PagosProveedoresViewSet  

router = DefaultRouter()
router.register('proveedores', ProveedoresViewSet, basename='proveedores')
router.register('ordenes-compra', OrdenesCompraViewSet, basename='ordenes-compra')
router.register('compras', ComprasViewSet, basename='compras')
router.register('pagos-proveedores', PagosProveedoresViewSet, basename='pagos-proveedores')
urlpatterns = router.urls