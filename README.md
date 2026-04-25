# LeadFlow - Professional Lead Management System

LeadFlow is a high-performance, full-stack Lead Management System designed to help sales teams track, manage, and convert leads efficiently. Built with a robust Django REST API and a modern, responsive React frontend.

## 🚀 Features

- **Professional Dashboard**: Real-time visualization of lead metrics and conversion rates.
- **Lead Management**: Full CRUD operations with quick status updates (New, Contacted, Closed).
- **Role-Based Access Control**: Secure access for Admins and Sales representatives.
- **User Profiles**: Personalized user profiles with editable information.
- **Secure Authentication**: JWT-based authentication with automatic token refreshing.
- **Premium UI**: Clean, modern design built with Tailwind CSS v4 and Framer Motion.

## 🛠️ Tech Stack

**Backend:**
- Django & Django REST Framework
- SimpleJWT (Authentication)
- PostgreSQL (Database)
- Service-oriented architecture

**Frontend:**
- React (Vite)
- Tailwind CSS v4 (Styling)
- Lucide React (Icons)
- Framer Motion (Animations)
- Axios (API Communication)

---

## 📦 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL database

---

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd lead_management

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create an admin user
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register/` | POST | Register a new account |
| `/api/login/` | POST | Login and receive JWT tokens |
| `/api/auth/me/` | GET/PATCH | View/Update personal profile |
| `/api/leads/` | GET/POST | List and create leads |
| `/api/leads/<id>/` | GET/PATCH/DELETE | Manage specific lead |
| `/api/dashboard/` | GET | Retrieve analytics data |

---

## 👤 Author

Developed by **Karan Kharad**

---

## 📄 License

This project is licensed under the MIT License.
