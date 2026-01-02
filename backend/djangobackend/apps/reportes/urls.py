from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import InventoryReportViewSet, SalesReportViewSet

router = DefaultRouter()
router.register(r'inventario', InventoryReportViewSet, basename='reportes-inventario')
router.register(r'ventas', SalesReportViewSet, basename='reportes-ventas')

urlpatterns = [
    path('', include(router.urls)),
]
