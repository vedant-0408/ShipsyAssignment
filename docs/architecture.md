# Architecture Documentation

## Database Schema
### Users
- id (PK)
- username (string)
- password (hashed)
- is_staff (boolean)
- is_superuser (boolean)

### Students
- id (PK)
- name (string)
- grade (enum: A/B/C/D)
- is_active (boolean)
- midterm_score (integer)
- final_exam_score (integer)
- final_score (calculated: midterm_score + final_exam_score)

## Modules / Apps
- users → handles authentication, login/logout, admin registration
- students → handles CRUD for Student entity, pagination, filtering
- core → global settings, middleware, URLs

## Flow
Frontend (React) → API calls via Axios → Backend (Django REST Framework) → Database (SQLite/Postgres)
