from rest_framework.routers import DefaultRouter
from .viewsets import TransformacionViewSet
# from .viewsets import AgregarNuevaTransformacionViewSet

router = DefaultRouter()
router.register(r'transformacion', TransformacionViewSet)
# router.register(r'agregar-nueva-transformacion', AgregarNuevaTransformacionViewSet)
urlpatterns = router.urls
