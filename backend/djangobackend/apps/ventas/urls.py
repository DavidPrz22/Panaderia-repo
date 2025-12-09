from rest_framework import routers
from .viewsets import ClientesViewSet
from .viewsets import OrdenesViewSet
from .viewsets import OrdenesTableViewset

router = routers.DefaultRouter()
router.register(r'clientes', ClientesViewSet)
router.register(r'ordenes', OrdenesViewSet)
router.register(r'ordenes-lista', OrdenesTableViewset, basename='ordenes-lista')

urlpatterns = router.urls
