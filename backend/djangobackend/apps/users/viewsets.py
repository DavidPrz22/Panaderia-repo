from apps.users.models import User
from apps.users.serializers import UserSerializer, UserProfileSerializer
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [AllowAny]
        return super().get_permissions()

    @action(
        detail=False,
        methods=["get", "patch"],
        url_path="me",
        permission_classes=[IsAuthenticated],
    )
    def me(self, request):
        """Retrieve or update the authenticated user's profile.

        GET: return the current user's profile data.
        PATCH: partially update full_name, username, or email.
        """

        user = request.user

        if request.method.lower() == "get":
            serializer = UserProfileSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # PATCH
        serializer = UserProfileSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=["post"],
        url_path="me/set_password",
        permission_classes=[IsAuthenticated],
    )
    def set_password(self, request):
        """Change the authenticated user's password.

        Expects: current_password, new_password, new_password_confirm.
        """

        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        new_password_confirm = request.data.get("new_password_confirm")

        if not current_password or not new_password or not new_password_confirm:
            return Response(
                {"detail": "Todos los campos de contraseña son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(current_password):
            return Response(
                {"detail": "La contraseña actual es incorrecta."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != new_password_confirm:
            return Response(
                {"detail": "Las nuevas contraseñas no coinciden."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(new_password, user=user)
        except ValidationError as exc:
            return Response(
                {"detail": exc.messages}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Contraseña actualizada correctamente."},
            status=status.HTTP_200_OK,
        )
