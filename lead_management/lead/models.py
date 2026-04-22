from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class Lead(models.Model):
    STATUS_CHOICES = [
        ('new','NEW'),
        ('contacted','Contacted'),
        ('closed','Closed')
    ]

    first_name = models.CharField(max_length=100)
    last_name  = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    company = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('CustomUser', on_delete=models.SET_NULL, null=True, related_name='leads_created')
    def __str__(self):
        return f"{self.first_name}{self.last_name}"
    

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('sales', 'Sales'),
        ]
    leads = models.ManyToManyField(Lead, related_name='assigned_users', blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='sales')
    email = models.EmailField(unique=True, null=False, blank=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def is_admin(self):
        return self.role == 'admin'
    
    def is_sales(self):
        return self.role == 'sales'

    def __str__(self):
        return self.email