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

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'password']
        read_only_fields = ['id']
    
    @property
    def validate(self,attrs):
        if attrs['role'] not in ['admin', 'sales']:
            raise serializers.ValidationError("Role must be either 'admin' or 'sales'.")
        return attrs


    def create(self, validated_data):
        validated_data.pop('password')
        user = CustomUser.objects.create(**validated_data)
        return user