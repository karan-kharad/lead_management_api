from django.core.exceptions import PermissionDenied, ValidationError
from django.contrib.auth import get_user_model
from .models import Lead
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.exceptions import ValidationError

User = get_user_model()


# =========================
# AUTH SERVICE
# =========================
class AuthService:

    @staticmethod
    def register_user(username, email, password, role='sales'):
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already exists.")

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # 🔒 Assign role safely
        user.role = role if role in dict(User.ROLE_CHOICES) else 'sales'
        user.save()

        return user

    @staticmethod
    def get_user_profile(user):
        return user  # No separate profile model

    # services.py

    @staticmethod
    def login_user(email, password):
        user = authenticate(username=email, password=password)

        if not user:
            raise ValidationError("Invalid email or password.")

        refresh = RefreshToken.for_user(user)

        return {
            "user": user,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

# =========================
# USER SERVICE
# =========================
class UserService:

    @staticmethod
    def all_users():
        return User.objects.all()

    @staticmethod
    def get_user_by_id(user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise ValidationError("User not found.")

    @staticmethod
    def update_user(user_id, **kwargs):
        user = UserService.get_user_by_id(user_id)

        valid_roles = [r[0] for r in User.ROLE_CHOICES]
        new_role = kwargs.get('new_role')

        if new_role:
            if new_role not in valid_roles:
                raise ValidationError(f"Invalid role. Valid roles: {', '.join(valid_roles)}")
            user.role = new_role

        # Optional updates
        user.first_name = kwargs.get('first_name', user.first_name)
        user.last_name = kwargs.get('last_name', user.last_name)
        user.phone_number = kwargs.get('phone_number', user.phone_number)

        user.save()
        return user

    @staticmethod
    def delete_user(user_id):
        user = UserService.get_user_by_id(user_id)
        user.delete()


# =========================
# LEAD SERVICE
# =========================
class LeadService:

    @staticmethod
    def get_leads_for_user(user):
        if user.is_admin():
            return Lead.objects.all()

        return Lead.objects.filter(
            created_by=user
        ) | Lead.objects.filter(
            assigned_users=user
        )

    @staticmethod
    def get_lead_by_id(lead_id, user):
        try:
            lead = Lead.objects.get(id=lead_id)

            if not user.is_admin():
                if (
                    lead.created_by != user and
                    user not in lead.assigned_users.all()
                ):
                    raise PermissionDenied("You do not have access to this lead.")

            return lead

        except Lead.DoesNotExist:
            raise ValidationError("Lead not found.")

    @staticmethod
    def create_lead(data, requesting_user):
        created_by = requesting_user

        # Admin can assign creator
        if requesting_user.is_admin():
            created_by_id = data.pop('created_by_id', None)
            if created_by_id:
                try:
                    created_by = User.objects.get(id=created_by_id)
                except User.DoesNotExist:
                    raise ValidationError("Creator user does not exist.")

        lead = Lead.objects.create(
            created_by=created_by,
            **data
        )

        return lead

    @staticmethod
    def update_lead(lead_id, data, requesting_user):
        lead = LeadService.get_lead_by_id(lead_id, requesting_user)

        if requesting_user.is_admin():
            created_by_id = data.pop('created_by_id', None)
            if created_by_id:
                try:
                    lead.created_by = User.objects.get(id=created_by_id)
                except User.DoesNotExist:
                    raise ValidationError("Creator user does not exist.")

        for field, value in data.items():
            setattr(lead, field, value)

        lead.save()
        return lead

    @staticmethod
    def delete_lead(lead_id, requesting_user):
        lead = LeadService.get_lead_by_id(lead_id, requesting_user)
        lead.delete()


# =========================
# DASHBOARD SERVICE
# =========================
class DashboardService:

    @staticmethod
    def get_status(user):
        qs = LeadService.get_leads_for_user(user)

        total = qs.count()
        new = qs.filter(status='new').count()
        contacted = qs.filter(status='contacted').count()
        closed = qs.filter(status='closed').count()

        conversion_rate = round((closed / total) * 100, 1) if total > 0 else 0

        return {
            'role': user.role,
            'total': total,
            'new': new,
            'contacted': contacted,
            'closed': closed,
            'conversion_rate': conversion_rate
        }