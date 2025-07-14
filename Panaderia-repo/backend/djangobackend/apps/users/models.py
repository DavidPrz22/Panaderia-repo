# users/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

class MyUserManager(BaseUserManager):
    def _create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError('Debes proveer nombre de usuario')

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, username=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        if username is None:
            raise ValueError('El nombre de usuario es requerido para crear un usuario.')
        if 'full_name' not in extra_fields:
            extra_fields['full_name'] = username  # Usar username como fallback
        if 'rol' not in extra_fields:
            extra_fields['rol'] = UserRoles.SALES 

        return self._create_user(username, password, **extra_fields)

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if username is None:
            raise ValueError('El nombre de usuario es requerido para crear un superusuario.')
        # For superuser, ensure full_name and rol are set, or provide sensible defaults
        if 'full_name' not in extra_fields:
            extra_fields['full_name'] = f"Admin {username}" 
        if 'rol' not in extra_fields:
            extra_fields['rol'] = UserRoles.ADMIN

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self._create_user(username, password, **extra_fields)


class UserRoles(models.TextChoices):
    MANAGER = 'Gerente', 'Gerente'
    SALES = 'Vendedor', 'Vendedor'
    ADMIN = 'Admin', 'Administrador'


class User(AbstractBaseUser, PermissionsMixin):

    username = models.CharField(max_length=64, unique=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    full_name = models.CharField(max_length=255, blank=False)
    rol = models.CharField(
                            max_length=20, 
                            choices=UserRoles.choices, 
                            default=UserRoles.SALES,
                            verbose_name='Rol de Usuario'
                        )
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    date_joined = models.DateTimeField(default=timezone.now)

    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['full_name', 'rol'] 


    def __str__(self):
        return f"Nombre de usuario: { self.username }, Nombre completo {self.full_name}"

    def get_full_name(self):
        return self.full_name