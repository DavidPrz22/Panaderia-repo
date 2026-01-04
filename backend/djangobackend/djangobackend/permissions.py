from rest_framework import permissions
from apps.users.models import UserRoles


class IsStaffLevel(permissions.BasePermission):
    """
    Permission for Admin or Gerente users only.
    These users have full access to all resources.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.rol in [UserRoles.ADMIN, UserRoles.MANAGER] or request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        return request.user.rol in [UserRoles.ADMIN, UserRoles.MANAGER] or request.user.is_superuser


class IsVendedor(permissions.BasePermission):
    """
    Permission for Vendedor users - READ only access.
    Vendedor can only view (GET, HEAD, OPTIONS).
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Vendedor can only read
        if request.user.rol == UserRoles.SALES:
            return request.method in permissions.SAFE_METHODS
        
        return False

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        
        # Vendedor can only read
        if request.user.rol == UserRoles.SALES:
            return request.method in permissions.SAFE_METHODS
        
        return False


class IsStaffOrVendedorReadOnly(permissions.BasePermission):
    """
    Composite permission:
    - Admin and Gerente have full access (via IsStaffLevel)
    - Vendedor has read-only access (via IsVendedor)
    
    Used for: Materias Primas, Products
    """
    def has_permission(self, request, view):
        # Check if user passes either permission
        staff_permission = IsStaffLevel()
        vendedor_permission = IsVendedor()
        
        return (staff_permission.has_permission(request, view) or 
                vendedor_permission.has_permission(request, view))

    def has_object_permission(self, request, view, obj):
        staff_permission = IsStaffLevel()
        vendedor_permission = IsVendedor()
        
        return (staff_permission.has_object_permission(request, view, obj) or 
                vendedor_permission.has_object_permission(request, view, obj))

class IsStafforVendedorReadandCreate(permissions.BasePermission):
    """
    Composite permission:
    - Admin and Gerente have full access (via IsStaffLevel)
    - Vendedor has read and create access (via IsVendedor)
    
    Used for: Materias Primas, Products
    """

    def has_permission(self, request, view):
        # 1. Check for Staff Level (Admin/Manager) - Full Access
        if IsStaffLevel().has_permission(request, view):
            return True
            
        # 2. Check for Vendedor - Read & Create Access Only
        if request.user.is_authenticated and request.user.rol == UserRoles.SALES:
            # Allow SAFE methods (GET, HEAD, OPTIONS) OR POST (Create)
            return request.method in permissions.SAFE_METHODS or request.method == 'POST'
            
        return False

    def has_object_permission(self, request, view, obj):
        # 1. Check for Staff Level - Full Access
        if IsStaffLevel().has_object_permission(request, view, obj):
             return True

        # 2. Check for Vendedor - Read Only object access
        # (They can create via POST in has_permission, but usually can't EDIT/DELETE objects)
        if request.user.is_authenticated and request.user.rol == UserRoles.SALES:
            return request.method in permissions.SAFE_METHODS
            
        return False

class IsStaffLevelOnly(permissions.BasePermission):
    """
    Permission that DENIES access to Vendedor users completely.
    Only Admin and Gerente have access.
    
    Used for: Recetas, Production, Purchases, Reports, Transformation
    """
    def has_permission(self, request, view):
        staff_permission = IsStaffLevel()
        return staff_permission.has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        staff_permission = IsStaffLevel()
        return staff_permission.has_object_permission(request, view, obj)


class IsAllUsersCRUD(permissions.BasePermission):
    """
    Permission that allows all authenticated users (Admin, Gerente, Vendedor) 
    to perform CRUD operations.
    
    Used for: Clients, Sales Orders, Dashboard, Notifications, Point of Sale
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated