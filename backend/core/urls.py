from django.contrib import admin
from django.urls import path, include
import core.views as views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('students.urls')),
    path('api/users/', include('users.urls')),
    path('api/admin/create/', views.create_admin, name='create_admin'),
    path('api/admin/list/', views.list_admins, name='list_admins'),  # Optional: List all admin users
    path('api/user/profile/', views.get_user_profile, name='user_profile'),  # Optional: Get current user info
]
