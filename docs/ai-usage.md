# AI Usage Documentation – Gemini CLI

This document contains all AI prompts and outputs used during development of the **ShipsyAssignment**.

---

## Prompt 1 – Project Scaffold
**Context:**  
I wanted a quick Django REST Framework project setup, with pagination enabled and a `Student` model.

**Prompt:**  
> Generate a Django REST Framework project scaffold with an app named `students` and settings for SQLite and pagination.

**Gemini CLI Output (Summary):**  
- Created Django project with DRF installed  
- Added `settings.py` configuration for SQLite  
- Enabled pagination with `PAGE_SIZE = 10`  
- Created `students` app with `urls.py`  

> Instructions for running the server and accessing the API and admin were also provided.

---

## Prompt 2 – Authentication

**Context:**  
I wanted to implement login & logout functionality with token-based authentication in a separate `users` app.

**Prompt:**  
> Write Django REST Framework code for token-based authentication with login and logout endpoints. The `users` app should handle authentication and user accounts separately from `students`.

**Gemini CLI Output (Summary):**  
- Created `backend/users` app for authentication and user management  
- Updated `backend/core/settings.py` to include `'users'` and `'rest_framework.authtoken'`, and set `TokenAuthentication`  
- Created `backend/users/views.py` with `LogoutView`  
- Created `backend/users/urls.py` with login and logout endpoints  
- Updated `backend/core/urls.py` to include `users.urls` under `api/users/`  
- Ran migrations to apply changes

**Usage Instructions:**  
- **Login:** POST to `YOUR_BACKEND_URL/api/users/login/` with `username` and `password` to receive a token  
- **Logout:** POST to `YOUR_BACKEND_URL/api/users/logout/` with header `Authorization: Token <your_token>`

---

## Prompt 3 – Admin Registration

**Context:**  
Already registered admins can create new admin accounts.

**Prompt:**  
> Create a functionality such that only logged-in admins can create new admin users.

**Gemini CLI Output (Summary):**  
- Secured registration endpoint so only authenticated admins can create new administrator accounts  
- Added `IsAdminOnly` permission class in `backend/users/permissions.py` to check `is_staff` or `is_superuser`  
- Updated `RegisterView` (`backend/users/views.py`) with `[IsAuthenticated, IsAdminOnly]` permissions

**Usage Instructions:**  
1. **Create First Superuser:**  
```bash
python manage.py createsuperuser
```  
2. **Log In:** POST to `YOUR_BACKEND_URL/api/users/login/` to get a token  
3. **Register New Admin:** POST to `YOUR_BACKEND_URL/api/users/register/` with header:  
```
Authorization: Token <your_token>
```  
> Only an existing administrator can create new admin accounts.