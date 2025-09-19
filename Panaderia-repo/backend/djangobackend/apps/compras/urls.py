from rest_framework.routers import DefaultRouter
from apps.compras.viewsets import ProveedoresViewSet

router = DefaultRouter()
router.register('proveedores', ProveedoresViewSet, basename='proveedores')

urlpatterns = router.urls