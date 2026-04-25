from django.core.exceptions import PermissionDenied, ValidationError
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Lead
from .serializers import (
    LeadSerializer,
    RegisterSerializer,
    UserProfileSerializer,
    LoginSerializer,
)
from lead.permissions import IsAdminRole
from .services import (
    AuthService,
    UserService,
    LeadService,
    DashboardService,
)


# =========================
# ERROR HANDLER
# =========================
def handle_service_errors(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except PermissionDenied as e:
            return Response({"detail": str(e)}, status=403)
        except ValidationError as e:
            return Response({"detail": str(e)}, status=400)
    return wrapper


# =========================
# AUTH VIEWS
# =========================
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = AuthService.register_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            role=serializer.validated_data.get('role', 'sales')
        )

        return Response(
            UserProfileSerializer(user).data,
            status=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = AuthService.login_user(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        return Response({
            "user": UserProfileSerializer(data["user"]).data,
            "access_token": data["access"],
            "refresh_token": data["refresh"]
        })


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserProfileSerializer(request.user).data)

    def patch(self, request):
        user = UserService.update_user(
            user_id=request.user.id,
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name'),
            phone_number=request.data.get('phone_number')
        )
        return Response(UserProfileSerializer(user).data)


# =========================
# USER MANAGEMENT (ADMIN)
# =========================
class UserListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    filter_backends = [SearchFilter]
    search_fields = ['username', 'email', 'role']

    def get_queryset(self):
        return UserService.all_users()


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get_queryset(self):
        return UserService.all_users()

    def get_object(self):
        return UserService.get_user_by_id(self.kwargs['pk'])

    def update(self, request, *args, **kwargs):
        user = UserService.update_user(
            user_id=self.kwargs['pk'],
            new_role=request.data.get('role'),
            first_name=request.data.get('first_name'),
            last_name=request.data.get('last_name'),
            phone_number=request.data.get('phone_number')
        )

        return Response(UserProfileSerializer(user).data)


# =========================
# DASHBOARD
# =========================
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = DashboardService.get_status(request.user)
        return Response(stats)


# =========================
# LEAD VIEWS
# =========================
class LeadListCreateView(generics.ListCreateAPIView):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'source']
    search_fields = ['first_name', 'last_name', 'email', 'company']
    ordering_fields = ['created_at']

    def get_queryset(self):
        return LeadService.get_leads_for_user(self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        lead = LeadService.create_lead(
            data=dict(serializer.validated_data),
            requesting_user=request.user
        )

        return Response(
            LeadSerializer(lead).data,
            status=status.HTTP_201_CREATED
        )


class LeadRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return LeadService.get_lead_by_id(
            lead_id=self.kwargs['pk'],
            user=self.request.user
        )

    def update(self, request, *args, **kwargs):
        lead = LeadService.update_lead(
            lead_id=self.kwargs['pk'],
            data=request.data,
            requesting_user=request.user
        )

        return Response(LeadSerializer(lead).data)

    def destroy(self, request, *args, **kwargs):
        LeadService.delete_lead(
            lead_id=self.kwargs['pk'],
            requesting_user=request.user
        )
        return Response(status=status.HTTP_204_NO_CONTENT)