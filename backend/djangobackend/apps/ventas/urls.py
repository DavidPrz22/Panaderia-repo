from rest_framework import routers
from .viewsets import ClientesViewSet, OrdenesViewSet, OrdenesTableViewset, AperturaCierreCajaViewSet, VentasViewSet

router = routers.DefaultRouter()
router.register(r'clientes', ClientesViewSet)
router.register(r'ordenes', OrdenesViewSet)
router.register(r'ordenes-lista', OrdenesTableViewset, basename='ordenes-lista')
router.register(r'apertura-cierre-caja', AperturaCierreCajaViewSet, basename='apertura-cierre-caja')
router.register(r'pos-venta', VentasViewSet, basename='pos-venta')

urlpatterns = router.urls
