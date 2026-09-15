# 🎓 EduPulse - Student Dashboard & Learning Hub

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**EduPulse** is a modern, responsive, and full-featured Student Dashboard application built with Next.js 16 (App Router & Turbopack), React 19, TypeScript, and Tailwind CSS v4. Designed with a crisp, professional light theme, EduPulse provides students with complete control over their academic life, course progression, assignment deadlines, weekly timetable, learning analytics, and profile settings.

---

## ✨ Key Features

### 📊 1. Main Student Dashboard (`/Dashboard`)
- **Personalized Welcome Banner**: Displays student greeting, 12-day study streak badge, overall GPA (3.92), and direct "Resume Learning" CTA.
- **Weekly Learning Hours Visualizer**: Bar chart tracking daily study hours vs weekly targets.
- **Enrolled Courses Grid**: Visual progress bars, category tags, instructor names, and lesson completion counters.
- **Upcoming Deadlines Widget**: Real-time listing of exams, assignment deadlines, and project submissions for the current week.

### 📅 2. Academic Schedule & Timetable (`/Schedule`)
- **Interactive Day Selector**: Toggle between Monday through Sunday to inspect daily class schedules.
- **Session Filters**: Filter timetable events by *Lectures*, *Practical Labs*, *Office Hours*, and *Online Only*.
- **Online Class Links**: One-click **"Join Online Lecture"** buttons for Zoom/Meet sessions alongside physical hall numbers.
- **Academic Reminders Panel**: Quick view of upcoming midterm exam locations and submission cutoffs.

### 📝 3. Coursework & Assignments (`/Assignments`)
- **Status Tracking**: Categorized tabs for *Pending*, *Submitted*, *Graded*, and *Overdue* coursework.
- **Grade & Feedback Reports**: Displays earned score (`96/100`) alongside detailed instructor feedback notes.
- **Submission Upload Trigger**: Simulated file upload trigger accepting `.pdf`, `.zip`, `.ipynb`, and `.figma` formats.
- **Metric Summaries**: Real-time assignment completion rate (%) and overall average grade calculations.

### 📈 4. Analytics & Performance Report (`/Analytics`)
- **Academic KPI Cards**: Cumulative GPA (3.92 / 4.0), Total Study Hours (142.5 hrs), Attendance (96.5%), and Assignment Index (94%).
- **Subject Grade Breakdown**: Visual grade bar comparisons across all enrolled courses (`CS-401`, `DS-402`, `CS-301`, `DES-204`, `SE-305`).
- **Technical Skill Mastery**: Percentage progress bars across Web Architecture, Algorithms, Machine Learning, UI/UX Systems, and DevOps.
- **AI Academic Growth Insights**: Dean's High Honor List milestones and targeted grade improvement recommendations.
- **Export PDF Report**: One-click **"Export PDF Report"** button trigger (`window.print()`) formatted cleanly for printing academic transcripts or saving to PDF.

### 📚 5. My Courses Catalog (`/Courses`)
- **Course Catalog Filters**: Search courses by title or topic and filter between *All*, *In Progress*, and *Completed*.
- **Interactive Video Lesson Player**: Clicking "Resume Course Modules" opens an interactive modal overlay to preview upcoming video lessons and syllabus modules.

### ⚙️ 6. Account & System Settings (`/Settings`)
- **Student Profile Management**: Customize full name, student ID, university email, academic major, and bio description.
- **Notification Preferences**: Toggle email reminders for assignment due dates, exam alerts, and department announcements.
- **Account Security**: Update account passwords and toggle Two-Factor Authentication (2FA).
- **Interactive Feedback**: Save changes trigger with an animated success notification toast.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16 (App Router + Turbopack)
- **UI & Logic**: React 19, TypeScript
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";`), Lucide React Icons
- **Database & Data Layer**: Supabase Client Integration (`@supabase/supabase-js`) with a resilient mock data fallback mechanism when environment variables are not configured.

---

## 📁 Folder Structure

```text
student-dashboard-main/
├── src/
│   ├── app/
│   │   ├── Analytics/      # Analytics & Report page route
│   │   ├── Assignments/    # Coursework & Assignments page route
│   │   ├── Courses/        # My Courses catalog & video player route
│   │   ├── Dashboard/      # Main Student Dashboard page route
│   │   ├── Schedule/       # Academic Schedule & Timetable route
│   │   ├── Settings/       # Student Settings & Profile route
│   │   ├── globals.css     # Global Tailwind CSS v4 styling
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Homepage (Renders Dashboard)
│   ├── components/
│   │   ├── ActivityCard.tsx # Metric cards & weekly bar chart component
│   │   ├── Course.tsx       # Course card component
│   │   ├── HeroCard.tsx     # Student banner component
│   │   ├── ProgressBar.tsx  # Animated progress bar component
│   │   └── Sidebar.tsx      # Responsive sidebar navigation component
│   ├── lib/
│   │   ├── analyticsData.ts # Data layer for analytics & subject scores
│   │   ├── assignmentData.ts# Data layer for coursework & grades
│   │   ├── scheduleData.ts  # Data layer for weekly timetable events
│   │   └── supabase.ts      # Supabase client & mock fallback data
│   └── types/
│       ├── analytics.ts     # TypeScript interfaces for analytics
│       ├── assignment.ts    # TypeScript interfaces for assignments
│       ├── course.ts        # TypeScript interfaces for courses
│       ├── schedule.ts      # TypeScript interfaces for timetable
│       └── settings.ts      # TypeScript interfaces for user settings
└── package.json
```

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/shivamsharmakr04/Student-Dashboard.git
cd Student-Dashboard/student-dashboard-main
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

Developed by [shivamsharmakr04](https://github.com/shivamsharmakr04).
