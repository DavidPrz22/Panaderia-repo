from django.contrib import admin
from django.urls import path, include
from apps.users.views import CustomTokenObtainPairView, CustomTokenRefreshView, CustomLogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', CustomTokenRefreshView.as_view(), name='refresh'),
    path('api/logout/', CustomLogoutView.as_view(), name='logout'),
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.inventario.urls')),
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.compras.urls')),
    path('api/', include('apps.produccion.urls')),
    path('api/', include('apps.ventas.urls')),
    path('api/', include('apps.transformacion.urls')),
    path('api/', include('apps.ventas.urls')),
]
