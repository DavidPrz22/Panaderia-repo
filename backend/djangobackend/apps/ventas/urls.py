from rest_framework import routers
from .viewsets import ClientesViewSet

router = routers.DefaultRouter()
router.register(r'clientes', ClientesViewSet)

urlpatterns = router.urls
