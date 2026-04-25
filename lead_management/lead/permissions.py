from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'admin'
        )
    
class IsSalesRole(BasePermission):
    def has_permission(self, request, view):
        return(
            request.user.is_authenticated and hasattr(request.user, 'role') and request.user.role == 'sales'
        )