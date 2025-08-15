# Add these imports to the top of your core/views.py file
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token
from django.db import IntegrityError
from django.db import models
import re

# Add these view functions to your core/views.py file

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_admin(request):
    """
    Create a new admin user. Only accessible by existing admin users.
    """
    # Check if current user is admin/staff
    if not request.user.is_staff and not request.user.is_superuser:
        return Response(
            {'error': 'Permission denied. Only admin users can create new admins.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    data = request.data
    
    # Validate required fields
    required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
    for field in required_fields:
        if not data.get(field):
            return Response(
                {field: f'{field.replace("_", " ").title()} is required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    username = data['username'].strip()
    email = data['email'].strip().lower()
    password = data['password']
    first_name = data['first_name'].strip()
    last_name = data['last_name'].strip()
    
    # Validation
    errors = {}
    
    # Username validation
    if len(username) < 3:
        errors['username'] = 'Username must be at least 3 characters long.'
    elif not re.match(r'^[a-zA-Z0-9_]+$', username):
        errors['username'] = 'Username can only contain letters, numbers, and underscores.'
    
    # Email validation
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        errors['email'] = 'Please enter a valid email address.'
    
    # Password validation
    if len(password) < 8:
        errors['password'] = 'Password must be at least 8 characters long.'
    
    # Name validation
    if len(first_name) < 1:
        errors['first_name'] = 'First name is required.'
    if len(last_name) < 1:
        errors['last_name'] = 'Last name is required.'
    
    # Check for existing username and email
    if User.objects.filter(username=username).exists():
        errors['username'] = 'A user with this username already exists.'
    
    if User.objects.filter(email=email).exists():
        errors['email'] = 'A user with this email already exists.'
    
    if errors:
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create the admin user
        user = User.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=make_password(password),  # Hash the password
            is_staff=True,
            is_superuser=True,
            is_active=True
        )
        
        # Create token for the new admin user
        Token.objects.create(user=user)
        
        # Return success response
        return Response({
            'message': 'Admin user created successfully.',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'date_joined': user.date_joined
            }
        }, status=status.HTTP_201_CREATED)
        
    except IntegrityError as e:
        return Response(
            {'error': 'Failed to create admin user. Please try again.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'An unexpected error occurred. Please try again.'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current user's profile information including role.
    """
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'role': 'superuser' if user.is_superuser else ('admin' if user.is_staff else 'user'),
        'date_joined': user.date_joined,
        'last_login': user.last_login
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_admins(request):
    """
    List all admin users. Only accessible by existing admin users.
    """
    # Check if current user is admin/staff
    if not request.user.is_staff and not request.user.is_superuser:
        return Response(
            {'error': 'Permission denied. Only admin users can view admin list.'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all admin users (staff or superuser)
    admin_users = User.objects.filter(
        models.Q(is_staff=True) | models.Q(is_superuser=True)
    ).values(
        'id', 'username', 'email', 'first_name', 'last_name', 
        'is_staff', 'is_superuser', 'is_active', 'date_joined', 'last_login'
    ).order_by('username')
    
    # Add role information
    admin_list = []
    for admin in admin_users:
        admin['role'] = 'superuser' if admin['is_superuser'] else 'admin'
        admin_list.append(admin)
    
    return Response({
        'count': len(admin_list),
        'admins': admin_list
    })