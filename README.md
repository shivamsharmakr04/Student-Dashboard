# Student Dashboard

A production-oriented full-stack student management dashboard built with **Next.js, React, TypeScript, Express, Supabase, and Tailwind CSS**. The application provides authenticated student accounts, course progress, assignments, schedules, analytics, profile management, and realtime data synchronization.

## ✨ Features

- 🎓 Student dashboard with personalized academic data
- 🔐 Supabase Authentication with email/password login and signup
- 👤 Student profile and preferences management
- 📚 Course listing and progress tracking
- 📝 Assignment management and submission status
- 🗓️ Class/schedule management
- 📊 Academic and study analytics
- ⚡ Supabase Realtime database synchronization
- 🛡️ Row Level Security (RLS) for student-owned data
- 🔌 Express REST API for protected backend operations
- 📱 Responsive UI for desktop and mobile
- 🧩 Reusable React/TypeScript components
- 🎨 Tailwind CSS styling with Framer Motion interactions

## 🏗️ Architecture

The project uses Supabase as the **single source of truth** for application data.

```text
┌───────────────────────────┐
│       Next.js Frontend    │
│ React + TypeScript        │
│ Tailwind + Supabase Auth  │
└─────────────┬─────────────┘
              │
       Access Token / API
              │
              ▼
┌───────────────────────────┐
│      Express Backend      │
│ Auth + REST API           │
│ JWT verification          │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│          Supabase         │
│ PostgreSQL + Auth         │
│ RLS + Realtime            │
└─────────────┬─────────────┘
              │
        Realtime events
              │
              ▼
┌───────────────────────────┐
│       Live Dashboard      │
│ Automatic data updates    │
└───────────────────────────┘
```

### Data flow

1. A student signs in through Supabase-backed authentication.
2. The frontend receives an access token.
3. Protected requests send the token to the Express API.
4. Express verifies the token with Supabase Auth.
5. Backend operations read/write the student's records in Supabase PostgreSQL.
6. Supabase Realtime publishes database changes to subscribed frontend screens.
7. Row Level Security ensures authenticated students can access only their own records.

## 🧰 Tech Stack

### Frontend

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**

### Backend

- **Node.js**
- **Express**
- **Supabase JavaScript SDK**
- **Supabase Auth token verification**
- **REST APIs**

### Database & Services

- **Supabase PostgreSQL**
- **Supabase Authentication**
- **Supabase Realtime**
- **PostgreSQL Row Level Security**

### Development

- npm
- ESLint
- Git / GitHub

## 📁 Project Structure

```text
Student-Dashboard/
├── src/
│   ├── app/
│   │   ├── Analytics/
│   │   ├── Assignments/
│   │   ├── Courses/
│   │   ├── Dashboard/
│   │   ├── Login/
│   │   ├── Schedule/
│   │   └── Settings/
│   ├── components/
│   ├── context/
│   └── lib/
│       ├── backendApi.ts
│       ├── realtimeService.ts
│       └── ...
├── backend/
│   └── src/
│       ├── middleware/
│       │   └── auth.js
│       ├── routes/
│       │   ├── analytics.js
│       │   ├── assignments.js
│       │   ├── auth.js
│       │   ├── courses.js
│       │   └── schedule.js
│       ├── supabase.js
│       └── server.js
├── supabase_schema.sql
├── .env.example
├── backend/.env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/shivamsharmakr04/Student-Dashboard.git
cd Student-Dashboard
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure Supabase

Create a Supabase project and open its **SQL Editor**.

Run:

```text
supabase_schema.sql
```

The schema creates/updates the main application tables:

- `profiles`
- `courses`
- `assignments`
- `schedule_events`
- `activity_logs`

It also configures indexes, Row Level Security policies, and Supabase Realtime publication for the application tables.

### 4. Configure frontend environment variables

Copy the template:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

On Windows PowerShell, you can create the file manually or use your preferred environment-file workflow.

### 5. Configure the backend

```bash
cd backend
npm install
```

Create `backend/.env` using `backend/.env.example`:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_KEY
```

> **Important:** Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser and never commit it to GitHub.

### 6. Start the backend

From the `backend` directory:

```bash
npm start
```

The API runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 7. Start the frontend

Open another terminal at the project root:

```bash
npm run dev
```

The Next.js application runs on:

```text
http://localhost:3000
```

## 🔌 API

The Express backend exposes protected API routes for the main dashboard features:

| Route | Purpose |
|---|---|
| `/api/health` | Backend health check |
| `/api/auth` | Login, signup, current user, profile and preferences |
| `/api/courses` | Course data and progress |
| `/api/assignments` | Assignment data and submissions |
| `/api/schedule` | Schedule/class data |
| `/api/analytics` | Student analytics and aggregated academic data |

Protected routes require:

```http
Authorization: Bearer <supabase-access-token>
```

## ⚡ Realtime Data

Realtime synchronization is powered by Supabase.

The application is configured around these realtime tables:

- `profiles`
- `courses`
- `assignments`
- `schedule_events`
- `activity_logs`

When supported records change in Supabase, subscribed frontend components can receive the change without requiring a full page refresh.

## 🛡️ Security

The production data flow is designed around authenticated, user-scoped access:

- Supabase Auth manages user identity and sessions.
- Express verifies access tokens before protected operations.
- Database queries are scoped to the authenticated user's ID.
- Supabase Row Level Security protects direct database access from the frontend.
- The service-role key remains backend-only.
- Environment files are ignored by Git.
- SQLite is no longer used by the active backend request path.

## 🧪 Production Build

Build the frontend:

```bash
npm run build
npm start
```

Build and start the backend:

```bash
cd backend
npm install
npm start
```

For deployment, configure the environment variables in your hosting providers instead of committing `.env` files.

### Frontend deployment variables

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_BACKEND_URL
```

### Backend deployment variables

```text
PORT
FRONTEND_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## 📝 Development Notes

- The frontend and backend are intentionally separated.
- Supabase is the shared persistent database and authentication provider.
- The Express layer is used for protected server-side business/data operations.
- Realtime updates depend on the Supabase project having the required tables and realtime publication configured by `supabase_schema.sql`.
- Do not use the server service-role key in frontend environment variables.

## 👨‍💻 Author

**Shivam Kumar** — Full-Stack Developer

- GitHub: https://github.com/shivamsharmakr04
- LinkedIn: https://linkedin.com/in/shivam-kumar-b0aab2209

---

**Built with Next.js, TypeScript, Express, Supabase, and Tailwind CSS.**
