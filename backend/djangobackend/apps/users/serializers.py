from apps.users.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "password",
            "email",
            "full_name",
            "rol",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer used for reading/updating the authenticated user's profile.

    Exposes full_name, username, email as editable fields and keeps rol read-only.
    Password is intentionally excluded from this serializer.
    """

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "rol",
        ]
        extra_kwargs = {
            "rol": {"read_only": True},
        }
