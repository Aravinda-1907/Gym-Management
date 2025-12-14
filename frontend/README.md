# 🏋️ Advanced Gym Management System

A full-stack MERN application for managing gym members, packages, and user accounts with authentication and role-based access control.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- ✅ JWT Authentication & Authorization
- ✅ Role-based access (Admin & Staff)
- ✅ RESTful API with proper error handling
- ✅ Input validation using express-validator
- ✅ Password encryption with bcryptjs
- ✅ Rate limiting & security headers
- ✅ MongoDB aggregation for statistics
- ✅ Pagination & filtering
- ✅ Member lifecycle management

### Frontend (React + Vite + TailwindCSS)
- ✅ Modern React with hooks & context API
- ✅ Protected routes with auth guards
- ✅ Responsive dashboard with statistics
- ✅ Member CRUD operations
- ✅ Advanced search & filtering
- ✅ Form validation
- ✅ Beautiful UI with Tailwind CSS
- ✅ Loading states & error handling

## 📁 Project Structure

```
gym-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── memberController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── adminMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── memberModel.js
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── memberRoutes.js
│   │       └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AddMember.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── EditMember.jsx
    │   │   ├── Login.jsx
    │   │   ├── Members.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── memberService.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

