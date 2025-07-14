from rest_framework import viewsets
from apps.ventas.models import Clientes
from apps.ventas.serializers import ClienteSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Clientes.objects.all()
    serializer_class = ClienteSerializer
    
    
# Create your views here.
