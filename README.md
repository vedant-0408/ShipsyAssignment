# 🚀 ShipsyAssignment – AI Campus Project  

This project is built as part of the **AI Campus Assignment**. It includes a **Django REST Framework backend** and a **React (Vite) frontend** with token-based authentication, CRUD APIs, pagination, filtering, and AI-assisted development using **Gemini CLI**.  

---

## 📂 Project Structure
```
ShipsyAssignment/
│
├── backend/         # Django REST Framework backend
│   ├── core/        # Main project settings
│   ├── students/    # Student app (CRUD, pagination, filtering)
│   ├── users/       # Users app (auth & admin registration)
│   └── manage.py
│
├── frontend/        # React (Vite) frontend
│   ├── src/         # React components
│   └── package.json
│
├── docs/            # Documentation
│   ├── ai-usage.md  # Gemini CLI prompts & outputs
│   ├── commits.md   # Hourly commit history
│   └── env.example  # Example environment variables
│
└── README.md
```

---

## ⚙️ Backend Setup (Django REST Framework)

### 1. Clone the Repository
```bash
git clone https://github.com/vedant-0408/ShipsyAssignment.git
cd ShipsyAssignment/backend
```

### 2. Create Virtual Environment & Install Dependencies
```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file inside `backend/` (see `docs/env.example` for reference):
```
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 4. Apply Migrations & Create Superuser
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 5. Run Backend
```bash
python manage.py runserver
```
Backend will be available at 👉 `http://127.0.0.1:8000/`

---

## 💻 Frontend Setup (React + Vite)

### 1. Move to Frontend
```bash
cd ../frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file inside `frontend/`:
```
VITE_API_URL=http://127.0.0.1:8000
```

### 4. Run Frontend
```bash
npm run dev
```
Frontend will be available at 👉 `http://localhost:5173/`

---

## 🤖 AI Usage
This project was developed with **Gemini CLI assistance**. Prompts and outputs are documented in:
```
docs/ai-usage.md
```

---

## 👤 Author
- **Vedant Sarawagi**
