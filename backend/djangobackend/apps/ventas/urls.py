from rest_framework import routers
from .viewsets import ClientesViewSet
from .viewsets import OrdenesViewSet

router = routers.DefaultRouter()
router.register(r'clientes', ClientesViewSet)
router.register(r'ordenes', OrdenesViewSet)

urlpatterns = router.urls
