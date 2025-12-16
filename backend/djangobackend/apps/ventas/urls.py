from rest_framework import routers
from .viewsets import ClientesViewSet, OrdenesViewSet, OrdenesTableViewset, AperturaCierreCajaViewSet

router = routers.DefaultRouter()
router.register(r'clientes', ClientesViewSet)
router.register(r'ordenes', OrdenesViewSet)
router.register(r'ordenes-lista', OrdenesTableViewset, basename='ordenes-lista')
router.register(r'apertura-cierre-caja', AperturaCierreCajaViewSet, basename='apertura-cierre-caja')

urlpatterns = router.urls
