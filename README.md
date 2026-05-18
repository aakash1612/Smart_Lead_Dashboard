# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the **MERN stack** + **TypeScript**, featuring JWT authentication, role-based access control, advanced filtering, CSV export, dark mode, and Docker support.

Live : ""https://smartleaderboard.netlify.app/login""
---

## ✨ Features

### Core
- **JWT Authentication** — Register, login, protected routes, bcrypt password hashing
- **Lead CRUD** — Create, read, update, delete leads with full validation
- **Advanced Filtering** — Filter by status, source, search by name/email (combined)
- **Debounced Search** — 400ms debounce for optimal API performance
- **Backend Pagination** — 10 records/page with full metadata
- **CSV Export** — Export filtered leads as downloadable CSV

### Access Control (RBAC)
| Feature | Admin | Sales |
|---|---|---|
| View all leads | ✅ | ❌ (own only) |
| Create leads | ✅ | ✅ |
| Edit leads | ✅ | ✅ (own only) |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own only) |

### UI/UX
- **Dark / Light Mode** — Persistent theme toggle
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Loading States** — Skeleton loaders and spinners throughout
- **Empty States** — Contextual empty states with actions
- **Error Handling** — Toast notifications, form validation errors
- **Dashboard Analytics** — Lead stats, status breakdown, conversion rate

---

## 🛠 Tech Stack

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express.js | Server framework |
| TypeScript | Type safety |
| MongoDB + Mongoose | Database + ODM |
| JWT + bcryptjs | Auth + password hashing |
| express-validator | Request validation |
| morgan | HTTP logging |

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| TailwindCSS | Styling |
| TanStack Query | Server state + caching |
| Zustand | Client state (auth, theme) |
| React Hook Form + Zod | Forms + validation |
| React Router v6 | Routing |
| Axios | HTTP client |
| react-hot-toast | Notifications |

---

## 📁 Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── leads.controller.ts
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts        # JWT authenticate + authorize
│   │   │   ├── errorHandler.ts
│   │   │   └── validate.ts
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   └── Lead.ts
│   │   ├── routes/            # Express routers
│   │   │   ├── auth.routes.ts
│   │   │   └── leads.routes.ts
│   │   ├── types/             # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── utils/             # Helpers
│   │   │   ├── db.ts
│   │   │   ├── response.ts
│   │   │   └── seed.ts
│   │   ├── app.ts             # Express app
│   │   └── server.ts          # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/               # API layer
│   │   │   ├── client.ts      # Axios instance
│   │   │   ├── auth.ts
│   │   │   └── leads.ts
│   │   ├── components/        # Reusable UI
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LeadFormModal.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── ProtectedLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useDebounce.ts
│   │   │   └── useLeads.ts
│   │   ├── pages/             # Route pages
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── LeadsPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── store/             # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── themeStore.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/             # Helpers + constants
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20+
- MongoDB 7+ (local) or MongoDB Atlas
- npm or yarn

### Option 1: Local Development

#### 1. Clone & install
```bash
git clone https://github.com/aakash1612/Smart_Lead_Dashboard
cd smart-leads-dashboard

# Backend
cd backend
npm install
cp .env.example .env   # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env
```

#### 2. Configure backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### 3. Start services
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

#### 4. (Optional) Seed demo data
```bash
cd backend
npm run seed
```
This creates:
- **Admin**: `admin@smartleads.com` / `admin123`
- **Sales**: `sales@smartleads.com` / `sales123`
- 20 sample leads

App runs at: **http://localhost:3000**

---

### Option 2: Docker Compose

```bash
# Build and start all services (MongoDB + Backend + Frontend)
docker compose up --build

# Run in background
docker compose up -d --build

# Stop
docker compose down
```

App runs at: **http://localhost**
API runs at: **http://localhost:5000**

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### POST `/auth/register`
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "sales"   // "admin" | "sales"
}
```
**Response 201:**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "...", "email": "...", "role": "sales" }
  }
}
```

#### POST `/auth/login`
```json
{ "email": "rahul@example.com", "password": "password123" }
```

#### GET `/auth/me` 🔒
Returns current user info.

---

### Leads (all routes require `Authorization: Bearer <token>`)

#### GET `/leads`
Query params:
| Param | Type | Description |
|---|---|---|
| `status` | `New\|Contacted\|Qualified\|Lost` | Filter by status |
| `source` | `Website\|Instagram\|Referral` | Filter by source |
| `search` | `string` | Search name or email |
| `sort` | `latest\|oldest` | Sort order |
| `page` | `number` | Page number (default: 1) |
| `limit` | `number` | Per page (default: 10, max: 50) |

**Response 200:**
```json
{
  "success": true,
  "message": "Leads fetched successfully.",
  "data": [...],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### GET `/leads/:id` 🔒
Get single lead by ID.

#### POST `/leads` 🔒
```json
{
  "name": "Priya Mehta",
  "email": "priya@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Interested in pro plan"
}
```

#### PUT `/leads/:id` 🔒
Any subset of lead fields.

#### DELETE `/leads/:id` 🔒 (Admin only)

#### GET `/leads/export/csv` 🔒
Same query params as GET `/leads`. Returns CSV file download.

---

### Error Response Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required", "Email must be valid"]
}
```

### Status Codes
| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Server error |

---

## 🎨 Design Decisions

- **DM Sans** body font + **Syne** display font for a modern, editorial feel
- CSS custom properties for seamless dark/light theming without flash
- TanStack Query for optimistic updates and intelligent caching
- Zustand with `persist` middleware so auth and theme survive page reloads
- Debounced search (400ms) prevents excessive API calls while typing
- Sales users automatically scoped to their own leads at the DB query level (not just UI)
- Admins are the only ones who can delete leads — protected both in backend middleware and hidden in UI

---


