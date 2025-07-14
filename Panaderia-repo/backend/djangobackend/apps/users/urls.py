from rest_framework.routers import DefaultRouter
from apps.users.viewsets import UserViewSet

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')

urlpatterns = router.urls