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

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables in .env**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. **Start the server**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file** (optional)
```bash
# frontend/.env
VITE_API_URL=http://localhost:5000
```

4. **Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🗄️ Database Setup

### Creating Initial Admin User

You can create an admin user in two ways:

**Method 1: Using MongoDB Compass or Shell**
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@gym.com",
  password: "$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Use bcrypt to hash "admin123"
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Method 2: Using the Register API**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@gym.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## 📡 API Endpoints

### Authentication Routes
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user (protected)
PUT    /api/auth/change-password - Change password (protected)
```

### Member Routes (All Protected)
```
GET    /api/members           - Get all members (with pagination & filters)
GET    /api/members/stats     - Get member statistics
POST   /api/members           - Add new member
GET    /api/members/:id       - Get member by ID
PUT    /api/members/:id       - Update member
DELETE /api/members/:id       - Delete member
POST   /api/members/:id/renew - Renew membership
```

### User Routes (Admin Only)
```
GET    /api/users             - Get all users
GET    /api/users/:id         - Get user by ID
PUT    /api/users/:id         - Update user
DELETE /api/users/:id         - Delete user
```

## 🔐 Authentication Flow

1. User registers or logs in
2. Server validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Token is automatically attached to all API requests
5. Backend middleware verifies token for protected routes
6. User can access protected resources based on role

## 📦 Package Types

| Package | Duration | Price (₹) | Features |
|---------|----------|-----------|----------|
| Trial   | 7 days   | 500       | Basic access |
| Basic   | 30 days  | 2,000     | Standard facilities |
| Premium | 90 days  | 5,000     | All facilities + trainer |
| Elite   | 365 days | 15,000    | VIP access + personalized plan |

## 🎨 Frontend Features

### Dashboard
- Total member count
- Active/inactive member statistics
- Members expiring soon alerts
- Package distribution chart
- Recent members list

### Member Management
- Add new members with validation
- Edit existing member details
- Delete members with confirmation
- Search members by name, email, or phone
- Filter by status and package type
- Pagination for large datasets

### User Interface
- Responsive sidebar navigation
- Clean and modern design
- Loading states and error handling
- Form validation with error messages
- Toast notifications (can be added)

## 🔧 Advanced Features to Add

1. **Payment Integration**
   - Razorpay/Stripe integration
   - Payment history tracking
   - Invoice generation

2. **Attendance Tracking**
   - QR code check-in
   - Monthly attendance reports
   - Attendance-based alerts

3. **Email Notifications**
   - Membership expiry reminders
   - Welcome emails
   - Payment confirmations

4. **Reports & Analytics**
   - Revenue reports
   - Member growth charts
   - Package popularity analysis

5. **Trainer Management**
   - Trainer profiles
   - Appointment booking
   - Session tracking

6. **Workout Plans**
   - Exercise library
   - Personalized plans
   - Progress tracking

## 🐛 Common Issues & Solutions

### Backend won't start
- Check MongoDB connection string
- Ensure MongoDB cluster is accessible
- Verify all environment variables are set

### Frontend API calls failing
- Check if backend is running on correct port
- Verify CORS settings in backend
- Check browser console for errors

### Authentication not working
- Clear localStorage and cookies
- Check JWT_SECRET is same as backend
- Verify token expiration time

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=              # MongoDB connection string
JWT_SECRET=             # Secret key for JWT
PORT=5000               # Server port
NODE_ENV=development    # Environment mode
FRONTEND_URL=           # Frontend URL for CORS
```

### Frontend (.env)
```env
VITE_API_URL=          # Backend API URL
```

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Upload dist folder or connect GitHub
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Whitelist IP addresses
3. Get connection string
4. Update MONGO_URI in backend .env

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built with ❤️ for modern gym management

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Happy Coding! 🎉**