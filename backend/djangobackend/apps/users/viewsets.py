from apps.users.models import User
from apps.users.serializers import UserSerializer
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from django.contrib.auth import authenticate


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    # @action(detail=False, methods=['post'], permission_classes=[AllowAny], url_path='validate-credentials')
    # def login(self, request):
    #     """
    #     Validate user credentials (username and password).
    #     """
    #     username = request.data.get('username')
    #     password = request.data.get('password')

    #     if not username or not password:
    #         return Response(
    #             {'detail': 'Nombre de usuario o contraseña no válidos.'},
    #             status=status.HTTP_400_BAD_REQUEST
    #         )

    #     user = authenticate(request, username=username, password=password)
    #     if user is not None:

            
    #         return Response({'userData': UserSerializer(user).data}, status=status.HTTP_200_OK)
    #     else:
    #         return Response(
    #             {'detail': 'Credenciales incorrectas'},
    #             status=status.HTTP_401_UNAUTHORIZED
    #         )
