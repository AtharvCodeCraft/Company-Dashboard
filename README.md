# Worksphere – Company Management Dashboard

A production-ready SaaS Company Management Dashboard built with **React**, **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Project Structure

```
Company Management/
├── backend/          # Express.js REST API
│   ├── config/       # MongoDB connection
│   ├── controllers/  # Business logic per module
│   ├── middleware/   # JWT auth & RBAC
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API route definitions
│   ├── server.js     # Entry point
│   ├── seed.js       # Sample data seeder
│   └── .env          # Environment variables
└── frontend/         # React + Vite application
    ├── src/
    │   ├── components/ # Sidebar, Navbar
    │   ├── layouts/    # DashboardLayout
    │   ├── pages/      # Dashboard, Employees, Tasks, etc.
    │   ├── store/      # Zustand state (auth, ui)
    │   └── utils/      # Axios API client
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas cloud)
- npm

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create or update `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/company_management
JWT_SECRET=supersecretjwtkey_change_in_production
NODE_ENV=development
```

Seed sample data (optional but recommended):

```bash
node seed.js
```

Start the backend dev server:

```bash
npm run dev
```

The API will run at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at: `http://localhost:5173`

---

## 🔑 Default Login

| Email           | Password    | Role        |
| --------------- | ----------- | ----------- |
| admin@worksphere.com | admin       | Super Admin |
| jane@nexus.com  | password123 | Manager     |
| john@nexus.com  | password123 | Employee    |

---

## 🔗 API Endpoints

| Module        | Endpoint                        |
| ------------- | ------------------------------- |
| Auth          | `POST /api/auth/login`          |
| Profile       | `GET /api/auth/profile`         |
| Employees     | `GET/POST /api/employees`       |
| Attendance    | `POST /api/attendance/check-in` |
| Projects      | `GET/POST /api/projects`        |
| Tasks         | `GET/POST /api/tasks`           |
| Teams         | `GET/POST /api/teams`           |
| Products      | `GET/POST /api/products`        |
| Sales         | `GET/POST /api/sales`           |
| Tickets       | `GET/POST /api/tickets`         |
| Contracts     | `GET/POST /api/contracts`       |
| Dashboard     | `GET /api/dashboard`            |
| Notifications | `GET /api/notifications`        |

---

## 🌐 Core Modules

| Module                                    | Status |
| ----------------------------------------- | ------ |
| Dashboard Analytics (Recharts)            | ✅     |
| Employee Management                       | ✅     |
| Attendance (Check-In/Out)                 | ✅     |
| Task & Project Kanban Board               | ✅     |
| Sales & Product Tracking                  | ✅     |
| Customer Tickets                          | ✅     |
| Business Contracts                        | ✅     |
| Real-time Notifications (Socket.io)       | ✅     |
| RBAC (Super Admin/Admin/Manager/Employee) | ✅     |
| Dark Mode                                 | ✅     |

---

## ☁️ Deployment

### Backend (Railway / Render)

1. Push to GitHub
2. Connect to Railway/Render
3. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`)
4. Set start command: `npm start`

### Frontend (Vercel / Netlify)

1. Push to GitHub
2. Connect repository to Vercel
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Set env variable: `VITE_API_URL=https://your-backend.railway.app/api`

---

## 🔒 Security Features

- JWT tokens with 30-day expiry
- `bcrypt` password hashing
- Role-Based Access Control (RBAC)
- `helmet` HTTP security headers
- CORS protection

---

## 📦 Tech Stack

**Frontend**: React, Vite, TailwindCSS, Zustand, Recharts, Lucide Icons, Axios

**Backend**: Node.js, Express.js, MongoDB, Mongoose, Socket.io, JWT, bcrypt
