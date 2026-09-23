# Student Dashboard

A modern student dashboard built with Next.js, TypeScript, Tailwind CSS, and Supabase. The project focuses on responsive UI, reusable components, data-driven screens, and a modern full-stack React workflow.

## ✨ Highlights

- 📚 Student-focused dashboard experience
- ⚡ Next.js application architecture
- 🔷 TypeScript for type-safe development
- 🗄️ Supabase integration
- 🎨 Tailwind CSS responsive styling
- 🎬 Framer Motion interactions
- 🧩 Reusable React components
- 📱 Responsive layouts

## 🧰 Tech Stack

**Framework:** Next.js  
**Language:** TypeScript  
**UI:** React, Tailwind CSS, Framer Motion, Lucide React  
**Backend/Data:** Supabase  
**Tooling:** ESLint, Git, GitHub

## 🚀 Getting Started

```bash
git clone https://github.com/shivamsharmakr04/Student-Dashboard.git
cd Student-Dashboard
npm install
npm run dev
```

Create the required environment variables from .env.example and backend/.env.example before running the application. The frontend uses the public Supabase URL/anon key; the backend uses the server-only service-role key.

For a production build:

```bash
npm run build
npm start
```

## 📌 What This Project Demonstrates

- Next.js development
- TypeScript
- Modern React patterns
- Supabase integration
- Responsive dashboard UI
- Component-driven development

## 👨‍💻 Author

**Shivam Kumar** — Full-Stack Developer

[GitHub](https://github.com/shivamsharmakr04) · [LinkedIn](https://linkedin.com/in/shivam-kumar-b0aab2209)

---

## Production data flow

The frontend and Express API now use Supabase as the single source of truth:

- Supabase Auth handles student accounts and JWT sessions.
- Express verifies Supabase access tokens and performs protected database operations.
- Courses, assignments, schedules, profiles, and activity logs are stored in Supabase.
- Supabase Realtime broadcasts database changes to the dashboard.
- Row Level Security isolates each student's records.
- SQLite is no longer used by the active backend request path.

### Supabase setup

1. Open the Supabase SQL editor and run supabase_schema.sql.
2. Copy .env.example to .env.local and add the Supabase project URL and anon key.
3. Copy backend/.env.example to backend/.env and add the same project URL plus the service-role key.
4. Never expose SUPABASE_SERVICE_ROLE_KEY in the browser, GitHub, or NEXT_PUBLIC_* variables.
5. Start the frontend with npm run dev.
6. Start the API from backend with npm install && npm start.

For deployment, configure these variables in the frontend and backend hosting environments rather than committing .env files.
