# ThinkAuto - AI-Powered IT Helpdesk

> Complete fullstack helpdesk solution with AI-powered ticket routing, role-based access control, and real-time collaboration.

## 🚀 Features

- **🔐 Secure Authentication** - JWT-based authentication with role-based access
- **👥 Multi-Role Support** - Employee, Technician, and Admin dashboards
- **🎫 Smart Ticket Management** - Create, assign, track, and resolve support tickets
- **🤖 AI Auto-Routing** - Intelligent ticket assignment to the right technician
- **💬 Real-time Comments** - Collaborate on tickets with team members
- **📊 Analytics Dashboard** - Comprehensive statistics and insights
- **⏱️ SLA Monitoring** - Track response and resolution times
- **🔒 Hidden Admin Access** - Secure admin login with specific credentials

## 📁 Project Structure

```
AI_SMARTHELPDESK/
├── thinkauto_frontend/    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── lib/           # Utilities (API service)
│   │   └── hooks/         # Custom React hooks
│   └── ...
└── thinkauto_backend/     # Node.js + Express backend
    ├── config/            # Database configuration
    ├── models/            # Mongoose models
    ├── controllers/       # Business logic
    ├── routes/            # API routes
    ├── middleware/        # Auth & validation
    ├── scripts/           # Utility scripts
    └── server.js          # Entry point
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** + **shadcn/ui** for beautiful UI
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Framer Motion** for animations

### Backend
- **Node.js** + **Express.js**
- **MongoDB Atlas** for database
- **Mongoose** for MongoDB ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (URI provided)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd D:\RANDOM_HACKTHON\AI_SMARTHELPDESK
```

### 2. Backend Setup

```bash
cd thinkauto_backend

# Install dependencies
npm install

# The .env file is already configured with:
# - MongoDB Atlas connection
# - Admin credentials
# - JWT secret

# Seed the admin user
npm run seed

# Start the backend server
npm run dev
```

Backend will be running at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd thinkauto_frontend

# Install dependencies (if not already done)
npm install

# The .env file is already configured with API URL

# Start the development server
npm run dev
```

Frontend will be running at: `http://localhost:8080`

## 🔑 Default Credentials

### Admin Access (Hidden)
- **Email**: sudhanadmin@gmail.com
- **Password**: sudhan@123

⚠️ **Note**: Admin option is hidden from the login/signup pages. Only the admin email can access admin features.

### Test Users
You can create Employee and Technician accounts through the signup page.

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user
- `PUT /auth/profile` - Update profile

### Ticket Endpoints
- `GET /tickets` - Get all tickets (filtered by role)
- `POST /tickets` - Create new ticket
- `GET /tickets/:id` - Get single ticket
- `PUT /tickets/:id` - Update ticket
- `POST /tickets/:id/comments` - Add comment
- `PUT /tickets/:id/assign` - Assign ticket (Admin)
- `GET /tickets/stats` - Get statistics (Admin)

### User Endpoints
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user by ID (Admin)
- `PUT /users/:id` - Update user (Admin)
- `DELETE /users/:id` - Delete user (Admin)
- `GET /users/technicians` - Get technicians
- `GET /users/stats` - Get user statistics (Admin)

## 👥 User Roles & Permissions

### Employee
- ✅ Create and view their own tickets
- ✅ Add comments to their tickets
- ✅ Track ticket status
- ✅ Access knowledge base
- ✅ Update their profile

### Technician
- ✅ View assigned tickets
- ✅ View unassigned tickets
- ✅ Update ticket status and priority
- ✅ Add comments and resolutions
- ✅ Track performance metrics

### Admin
- ✅ Full access to all features
- ✅ Manage users (Create, Update, Delete)
- ✅ Assign tickets to technicians
- ✅ View all tickets and statistics
- ✅ System configuration
- ✅ Analytics and reports

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Hidden admin access
- ✅ Environment variable protection

## 📊 Key Features

### For Employees
- **Easy Ticket Creation** - Simple form with auto-categorization
- **Ticket Tracking** - Real-time status updates
- **Knowledge Base** - Self-service solutions
- **Priority Levels** - Low, Medium, High, Critical

### For Technicians
- **Ticket Queue** - View assigned and available tickets
- **Status Management** -Update ticket progress
- **Comments** - Communicate with ticket creators
- **Performance Tracking** - Monitor resolution times

### For Admins
- **User Management** - Add, edit, or remove users
- **Ticket Assignment** - Assign tickets to technicians
- **Analytics** - View comprehensive statistics
- **SLA Monitoring** - Track compliance
- **Team Management** - Organize technicians

## 🎨 UI Components

Built with shadcn/ui components:
- Forms, Inputs, Buttons
- Cards, Badges, Alerts -  Dialogs, Dropdowns, Popovers
- Tables, Charts, Statistics
- Navigation, Sidebars, Menus
- And many more...

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://ThinkAuto:sudhan@123@cluster0.tkg5uwp.mongodb.net/thinkauto
JWT_SECRET=thinkauto_jwt_secret_key_2026_very_secure
JWT_EXPIRE=7d
NODE_ENV=development
ADMIN_EMAIL=sudhanadmin@gmail.com
ADMIN_PASSWORD=sudhan@123
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

The application is fully functional and ready to test with:
1. Create Employee/Technician accounts via signup
2. Login with admin credentials for full access
3. Create tickets as Employee
4. Assign and manage tickets as Admin
5. Resolve tickets as Technician

## 📦 Build for Production

### Backend
```bash
cd thinkauto_backend
npm start
```

### Frontend
```bash
cd thinkauto_frontend
npm run build
npm run preview
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check the connection string in `.env`

### Port Already in Use
- Backend: Change `PORT` in backend `.env`
- Frontend: Change port in `vite.config.ts`

### CORS Errors
- Ensure frontend URL matches in backend CORS config
- Check `FRONTEND_URL` environment variable

## 📄 License

Copyright © 2026 ThinkAuto. All rights reserved.

## 👨‍💻 Developer

Built with ❤️ for the Hackathon

## 🤝 Support

For issues or questions, please create a ticket in the system! 😉
