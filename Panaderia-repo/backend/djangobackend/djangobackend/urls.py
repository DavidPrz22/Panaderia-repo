from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),    
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.inventario.urls')),
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.compras.urls')),
    path('api/clientes/', include('apps.ventas.urls')),
]
