from rest_framework.routers import DefaultRouter
from apps.compras.viewsets import ProveedoresViewSet, OrdenesCompraViewSet, ComprasViewSet  

router = DefaultRouter()
router.register('proveedores', ProveedoresViewSet, basename='proveedores')
router.register('ordenes-compra', OrdenesCompraViewSet, basename='ordenes-compra')
router.register('compras', ComprasViewSet, basename='compras')
urlpatterns = router.urls