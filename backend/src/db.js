const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new DatabaseSync(dbPath);

// Enable WAL mode for better concurrency performance
db.exec('PRAGMA journal_mode = WAL;');

function initDatabase() {
  // 1. Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      student_id TEXT,
      major TEXT,
      bio TEXT,
      year_level TEXT,
      gpa REAL,
      avatar_initials TEXT,
      preferences TEXT,
      created_at TEXT
    );
  `);

  // 2. Courses Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      category TEXT,
      progress INTEGER DEFAULT 0,
      icon_name TEXT,
      instructor TEXT,
      total_lessons INTEGER DEFAULT 20,
      completed_lessons INTEGER DEFAULT 0,
      color_gradient TEXT,
      description TEXT,
      created_at TEXT
    );
  `);

  // 3. Assignments Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      course_code TEXT,
      course_name TEXT,
      due_date TEXT,
      due_time TEXT,
      status TEXT,
      submission_date TEXT,
      weightage INTEGER,
      max_score INTEGER,
      earned_score INTEGER,
      description TEXT,
      file_format TEXT,
      feedback TEXT
    );
  `);

  // 4. Schedule Events Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule_events (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      course_code TEXT,
      type TEXT,
      start_time TEXT,
      end_time TEXT,
      day TEXT,
      location TEXT,
      instructor TEXT,
      is_online INTEGER,
      meeting_url TEXT,
      color TEXT,
      notes TEXT
    );
  `);

  // Seed default demo user if not exists
  const checkUser = db.prepare('SELECT id FROM users WHERE id = ?').get('demo-student-001');
  if (!checkUser) {
    seedDatabase();
  }
}

function seedDatabase() {
  console.log('Seeding initial student database...');

  const defaultPreferences = JSON.stringify({
    preferred_tracks: ['Web Development', 'Computer Science'],
    learning_goal_hours: 10,
    study_mode: 'Project-Based',
    email_assignments: true,
    email_exams: true,
    email_announcements: true,
    push_alerts: false,
    theme: 'light'
  });

  // Seed User Alex Morgan
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, student_id, major, bio, year_level, gpa, avatar_initials, preferences, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertUser.run(
    'demo-student-001',
    'Alex Morgan',
    'alex.morgan@university.edu',
    'password123',
    'STU-2026-8942',
    'Computer Science & Software Engineering',
    'Passionate fullstack engineering student focused on Next.js, distributed systems, and machine learning.',
    'Year 3',
    3.92,
    'AL',
    defaultPreferences,
    new Date().toISOString()
  );

  // Seed Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, user_id, title, category, progress, icon_name, instructor, total_lessons, completed_lessons, color_gradient, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const courses = [
    {
      id: 'c-1',
      user_id: 'demo-student-001',
      title: 'Advanced React & Next.js 16 Architecture',
      category: 'Web Development',
      progress: 85,
      icon_name: 'Code',
      instructor: 'Dr. Sarah Jenkins',
      total_lessons: 24,
      completed_lessons: 20,
      color_gradient: 'from-blue-600 to-indigo-600',
      description: 'Master server components, streaming, performance tuning, and fullstack state management.',
      created_at: new Date().toISOString()
    },
    {
      id: 'c-2',
      user_id: 'demo-student-001',
      title: 'Data Structures & Algorithms in Python',
      category: 'Computer Science',
      progress: 60,
      icon_name: 'Binary',
      instructor: 'Prof. Michael Chen',
      total_lessons: 30,
      completed_lessons: 18,
      color_gradient: 'from-purple-600 to-pink-600',
      description: 'In-depth exploration of graph algorithms, dynamic programming, and complexity analysis.',
      created_at: new Date().toISOString()
    },
    {
      id: 'c-3',
      user_id: 'demo-student-001',
      title: 'UI/UX Design Systems & Micro-Interactions',
      category: 'Design & Product',
      progress: 42,
      icon_name: 'Palette',
      instructor: 'Elena Rostova',
      total_lessons: 18,
      completed_lessons: 8,
      color_gradient: 'from-amber-500 to-rose-500',
      description: 'Crafting cohesive token systems, high-fidelity prototypes, and accessible interface designs.',
      created_at: new Date().toISOString()
    },
    {
      id: 'c-4',
      user_id: 'demo-student-001',
      title: 'Machine Learning Engineering Fundamentals',
      category: 'Data Science',
      progress: 90,
      icon_name: 'Cpu',
      instructor: 'Alex Rivera',
      total_lessons: 20,
      completed_lessons: 18,
      color_gradient: 'from-emerald-500 to-teal-700',
      description: 'Building pipeline workflows, model deployment, and feature engineering with PyTorch.',
      created_at: new Date().toISOString()
    },
    {
      id: 'c-5',
      user_id: 'demo-student-001',
      title: 'Cloud Infrastructure & DevOps Mastery',
      category: 'Cloud Computing',
      progress: 25,
      icon_name: 'Cloud',
      instructor: 'Marcus Vance',
      total_lessons: 16,
      completed_lessons: 4,
      color_gradient: 'from-cyan-500 to-blue-600',
      description: 'Docker containerization, Kubernetes orchestration, CI/CD automation, and Terraform.',
      created_at: new Date().toISOString()
    }
  ];

  for (const c of courses) {
    insertCourse.run(
      c.id, c.user_id, c.title, c.category, c.progress, c.icon_name,
      c.instructor, c.total_lessons, c.completed_lessons, c.color_gradient,
      c.description, c.created_at
    );
  }

  // Seed Assignments
  const insertAssignment = db.prepare(`
    INSERT INTO assignments (id, user_id, title, course_code, course_name, due_date, due_time, status, submission_date, weightage, max_score, earned_score, description, file_format, feedback)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const assignments = [
    {
      id: 'a-1',
      user_id: 'demo-student-001',
      title: 'UI Component Library & Design Tokens',
      course_code: 'DES-204',
      course_name: 'UI/UX Design Systems',
      due_date: 'Friday, Sep 19',
      due_time: '11:59 PM',
      status: 'pending',
      submission_date: null,
      weightage: 15,
      max_score: 100,
      earned_score: null,
      description: 'Export an interactive Figma prototype and document token variables for color, typography, and elevation scales.',
      file_format: '.figma, .pdf, .zip',
      feedback: null
    },
    {
      id: 'a-2',
      user_id: 'demo-student-001',
      title: 'PyTorch Image Classification Pipeline',
      course_code: 'DS-402',
      course_name: 'Machine Learning Engineering',
      due_date: 'Sunday, Sep 21',
      due_time: '05:00 PM',
      status: 'pending',
      submission_date: null,
      weightage: 20,
      max_score: 100,
      earned_score: null,
      description: 'Train a ResNet-18 model on CIFAR-10, measure accuracy & loss curves, and submit a Jupyter Notebook with output plots.',
      file_format: '.ipynb, .pdf',
      feedback: null
    },
    {
      id: 'a-3',
      user_id: 'demo-student-001',
      title: 'Next.js App Router & Server Actions Lab',
      course_code: 'CS-401',
      course_name: 'Advanced React & Next.js Architecture',
      due_date: 'Sep 14',
      due_time: '11:59 PM',
      status: 'submitted',
      submission_date: 'Sep 13 at 09:45 PM',
      weightage: 10,
      max_score: 50,
      earned_score: null,
      description: 'Build a CRUD task manager leveraging Server Actions, optimistic UI updates, and Supabase database binding.',
      file_format: '.zip, GitHub URL',
      feedback: null
    },
    {
      id: 'a-4',
      user_id: 'demo-student-001',
      title: 'Graph Algorithms & Shortest Path Solver',
      course_code: 'CS-301',
      course_name: 'Data Structures & Algorithms',
      due_date: 'Sep 10',
      due_time: '11:59 PM',
      status: 'graded',
      submission_date: 'Sep 09 at 10:15 PM',
      weightage: 15,
      max_score: 100,
      earned_score: 96,
      description: 'Implement Dijkstra and A* pathfinding in Python with time complexity analysis and memory benchmarks.',
      file_format: '.py, .pdf',
      feedback: 'Exceptional code structure and clear Big-O notation proofs! Minor point off for edge case handling in negative weights.'
    },
    {
      id: 'a-5',
      user_id: 'demo-student-001',
      title: 'Docker Containerization & Kubernetes Helm Deployment',
      course_code: 'SE-305',
      course_name: 'Cloud Infrastructure & DevOps',
      due_date: 'Sep 08',
      due_time: '11:59 PM',
      status: 'graded',
      submission_date: 'Sep 08 at 08:20 PM',
      weightage: 10,
      max_score: 100,
      earned_score: 92,
      description: 'Write Dockerfiles for microservices, configure ingress controllers, and package into a Helm release.',
      file_format: '.yaml, .sh',
      feedback: 'Well-structured Helm charts. Great use of multi-stage Docker builds to keep image sizes minimal.'
    }
  ];

  for (const a of assignments) {
    insertAssignment.run(
      a.id, a.user_id, a.title, a.course_code, a.course_name,
      a.due_date, a.due_time, a.status, a.submission_date,
      a.weightage, a.max_score, a.earned_score, a.description,
      a.file_format, a.feedback
    );
  }

  // Seed Schedule Events
  const insertSchedule = db.prepare(`
    INSERT INTO schedule_events (id, user_id, title, course_code, type, start_time, end_time, day, location, instructor, is_online, meeting_url, color, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const events = [
    {
      id: 'se-1',
      user_id: 'demo-student-001',
      title: 'Advanced React & Next.js Architecture',
      course_code: 'CS-401',
      type: 'lecture',
      start_time: '09:00 AM',
      end_time: '10:30 AM',
      day: 'Monday',
      location: 'Turing Science Center 204',
      instructor: 'Dr. Sarah Jenkins',
      is_online: 0,
      meeting_url: null,
      color: 'from-blue-600 to-indigo-600',
      notes: 'Review Server Components, Streaming SSR, and Parallel Routes.'
    },
    {
      id: 'se-2',
      user_id: 'demo-student-001',
      title: 'Data Structures & Algorithms Lab',
      course_code: 'CS-301',
      type: 'lab',
      start_time: '11:00 AM',
      end_time: '01:00 PM',
      day: 'Monday',
      location: 'Ada Lovelace Computer Lab 102',
      instructor: 'Prof. Michael Chen',
      is_online: 0,
      meeting_url: null,
      color: 'from-purple-600 to-pink-600',
      notes: 'Hands-on practice with Graph Traversal algorithms (BFS & DFS).'
    },
    {
      id: 'se-3',
      user_id: 'demo-student-001',
      title: 'Machine Learning Office Hours',
      course_code: 'DS-402',
      type: 'office_hours',
      start_time: '02:30 PM',
      end_time: '04:00 PM',
      day: 'Monday',
      location: 'Zoom Virtual Office',
      instructor: 'Alex Rivera',
      is_online: 1,
      meeting_url: 'https://zoom.us/j/mock-ml-office-hours',
      color: 'from-emerald-500 to-teal-700',
      notes: 'Q&A session regarding PyTorch gradient descent assignment.'
    },
    {
      id: 'se-4',
      user_id: 'demo-student-001',
      title: 'UI/UX Design Systems Workshop',
      course_code: 'DES-204',
      type: 'lecture',
      start_time: '10:00 AM',
      end_time: '11:30 AM',
      day: 'Tuesday',
      location: 'Design Studio 405',
      instructor: 'Elena Rostova',
      is_online: 0,
      meeting_url: null,
      color: 'from-amber-500 to-rose-500',
      notes: 'Design tokens, Figma variable components, and color contrast ratios.'
    },
    {
      id: 'se-5',
      user_id: 'demo-student-001',
      title: 'Cloud Infrastructure & DevOps',
      course_code: 'SE-305',
      type: 'lecture',
      start_time: '01:30 PM',
      end_time: '03:00 PM',
      day: 'Tuesday',
      location: 'Zoom Virtual Classroom',
      instructor: 'Marcus Vance',
      is_online: 1,
      meeting_url: 'https://zoom.us/j/mock-devops-class',
      color: 'from-cyan-500 to-blue-600',
      notes: 'Kubernetes Pod deployments, Helm charts, and CI/CD pipelines.'
    }
  ];

  for (const e of events) {
    insertSchedule.run(
      e.id, e.user_id, e.title, e.course_code, e.type,
      e.start_time, e.end_time, e.day, e.location,
      e.instructor, e.is_online, e.meeting_url, e.color, e.notes
    );
  }

  console.log('Database seeded successfully!');
}

// Initialize on module load
initDatabase();

module.exports = db;
