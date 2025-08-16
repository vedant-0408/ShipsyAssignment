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

---

## Prompt 4 – CRUD for Students

**Context:**  
Needed to implement CRUD operations for the `Student` entity.

**Prompt:**  
> Write Django model, serializer, and viewset for `Student` with fields: `name` (text), `grade` (enum), `is_active` (boolean), `midterm_score` (integer), `final_exam_score` (integer), and a calculated field `final_score = midterm_score + final_exam_score`.

**Gemini CLI Output (Summary):**  
- Defined `Student` model with all fields  
- Implemented `@property` for `final_score`  
- Created `StudentSerializer` for all fields including calculated field  
- Created `StudentViewSet` with full CRUD using `ModelViewSet`  
- Registered routes in `urls.py` using DRF `DefaultRouter`

---

## Prompt 5 – Pagination & Filtering

**Context:**  
Needed pagination and filtering to manage students efficiently.

**Prompt:**  
> Add pagination (10 per page) and filtering for grade and is_active to DRF `StudentViewSet`.

**Gemini CLI Output (Summary):**  
- Updated `settings.py` with `PAGE_SIZE = 10`  
- Added `DjangoFilterBackend` to `StudentViewSet`  
- Enabled `filterset_fields = ['grade', 'is_active']`  
- Demonstrated usage with query params (`?grade=A&is_active=True`)

---

## Prompt 6 – Frontend Integration

**Context:**  
I wanted a React component to show paginated students and filter them by grade.

**Prompt:**  
> Generate a React table component fetching paginated Student API data with Axios, including a dropdown filter for grade.

**Gemini CLI Output (Summary):**  
- React functional component with `useState` and `useEffect`  
- Axios GET call with page number and filter query params  
- Table displaying name, grade, final_score, and status  
- Dropdown to filter by grade  
- Pagination buttons for next/previous

---

## Prompt 7 – API Documentation

**Context:**  
I wanted professional API documentation for my backend endpoints.

**Prompt:**  
> Write Swagger/OpenAPI specification for the Student API with CRUD, pagination, and filtering.

**Gemini CLI Output (Summary):**  
- Provided YAML spec for `GET /students/`, `POST /students/`, `PUT /students/{id}/`, `DELETE /students/{id}/`  
- Included query params for pagination (`page`) and filtering (`grade`, `is_active`)  
- Added authentication requirement via Token in headers

---

## Prompt 8 – Testing

**Context:**  
I needed unit tests to cover validation, pagination, and unauthorized access.

**Prompt:**  
> Write Django unit tests for Student API covering invalid grade values, pagination limits, and unauthorized access attempts.

**Gemini CLI Output (Summary):**  
- Test: invalid grade should return 400 Bad Request  
- Test: pagination returns correct number of results per page  
- Test: request without token returns 401 Unauthorized  
- Suggested using `APITestCase` and `APIClient` from DRF

---

## Prompt 9 – Deployment Help

**Context:**  
I wanted guidance on deploying my app to Render (backend) and Vercel (frontend).

**Prompt:**  
> Give me steps to deploy a Django backend with PostgreSQL on Render and a React frontend on Vercel.

**Gemini CLI Output (Summary):**  
- Backend: create new Render service, connect GitHub repo, set environment variables, add PostgreSQL add-on  
- Update `DATABASES` in `settings.py` to use Render DB credentials  
- Frontend: push code to GitHub, connect repo in Vercel, set `VITE_API_URL` env var  
- Verified deployment by opening live URLs for both backend and frontend

---
