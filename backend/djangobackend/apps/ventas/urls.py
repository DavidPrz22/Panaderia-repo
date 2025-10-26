from rest_framework import routers
from .viewsets import ClienteViewSet

router = routers.DefaultRouter()
router.register(r'cliente', ClienteViewSet, basename = 'cliente')

urlpatterns = router.urls