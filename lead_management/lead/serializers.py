from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import *


class LeadSerializer(serializers.ModelSerializer):
    admin = serializers.CharField(source='CustomUser.username', read_only=True)
    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
         

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'password', 'password2'
        ]
        read_only_fields = ['id']

    def validate(self, data):  # ✅ FIXED
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')

        # 🔒 Force role (don’t trust user input)
        user = CustomUser.objects.create_user(
            role='sales',
            **validated_data
        )
        return user
    
# serializers.py

from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'role', 'phone_number']
        read_only_fields = ['id', 'username', 'email']

class LeadSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_users = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'created_by', 'assigned_users']
