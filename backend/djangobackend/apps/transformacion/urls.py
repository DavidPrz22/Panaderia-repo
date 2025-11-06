from rest_framework.routers import DefaultRouter
from .viewsets import TransformacionViewSet
from .viewsets import EjecutarTransformacionViewSet

router = DefaultRouter()
router.register(r'transformacion', TransformacionViewSet)
router.register(r'ejecutar-transformacion', EjecutarTransformacionViewSet, basename='ejecutar-transformacion')
urlpatterns = router.urls
