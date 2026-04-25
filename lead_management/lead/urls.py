from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    LeadRetrieveUpdateDestroyView, LoginView, RegisterView, MeView,
    UserListView, UserDetailView,
    DashboardView,
    LeadListCreateView)


urlpatterns = [
    # Auth
    path('auth/register/',      RegisterView.as_view(),        name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(),    name='token_refresh'),
    path('auth/me/',            MeView.as_view(),              name='me'),

    # Users (admin only)
    path('users/',          UserListView.as_view(),   name='user_list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user_detail'),

    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),

    # Leads — 2 URLs cover all 5 HTTP methods
    path('leads/',          LeadListCreateView.as_view(),          name='lead_list_create'),
    path('leads/<int:pk>/', LeadRetrieveUpdateDestroyView.as_view(), name='lead_detail'),


]
