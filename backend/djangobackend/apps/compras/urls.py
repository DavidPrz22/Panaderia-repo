from rest_framework.routers import DefaultRouter
from apps.compras.viewsets import ProveedoresViewSet, OrdenesCompraViewSet  

router = DefaultRouter()
router.register('proveedores', ProveedoresViewSet, basename='proveedores')
router.register('ordenes-compra', OrdenesCompraViewSet, basename='ordenes-compra')
urlpatterns = router.urls