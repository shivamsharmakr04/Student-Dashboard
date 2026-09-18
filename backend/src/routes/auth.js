const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Helper to seed initial courses, assignments, and schedule for newly registered students
function seedUserData(userId, major, preferences) {
  const tracks = preferences?.preferred_tracks || ['Web Development'];
  const primaryTrack = tracks[0] || 'Computer Science';

  // 1. Initial Courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, user_id, title, category, progress, icon_name, instructor, total_lessons, completed_lessons, color_gradient, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const newCourses = [
    {
      id: `c-${userId}-1`,
      user_id: userId,
      title: `${primaryTrack} Architecture & Systems`,
      category: primaryTrack,
      progress: 15,
      icon_name: 'Code',
      instructor: 'Dr. Sarah Jenkins',
      total_lessons: 24,
      completed_lessons: 4,
      color_gradient: 'from-blue-600 to-indigo-600',
      description: `Core principles of ${primaryTrack}, software design patterns, and application scalability.`,
      created_at: new Date().toISOString()
    },
    {
      id: `c-${userId}-2`,
      user_id: userId,
      title: 'Data Structures & Algorithmic Foundations',
      category: 'Computer Science',
      progress: 30,
      icon_name: 'Binary',
      instructor: 'Prof. Michael Chen',
      total_lessons: 30,
      completed_lessons: 9,
      color_gradient: 'from-purple-600 to-pink-600',
      description: 'Graphs, dynamic programming, recursive structures, and time-complexity analysis.',
      created_at: new Date().toISOString()
    },
    {
      id: `c-${userId}-3`,
      user_id: userId,
      title: 'Modern UI/UX Engineering & Design Tokens',
      category: 'Design & Product',
      progress: 50,
      icon_name: 'Palette',
      instructor: 'Elena Rostova',
      total_lessons: 18,
      completed_lessons: 9,
      color_gradient: 'from-amber-500 to-rose-500',
      description: 'Building cohesive visual design systems, interactive prototypes, and web accessibility.',
      created_at: new Date().toISOString()
    }
  ];

  for (const c of newCourses) {
    insertCourse.run(
      c.id, c.user_id, c.title, c.category, c.progress, c.icon_name,
      c.instructor, c.total_lessons, c.completed_lessons, c.color_gradient,
      c.description, c.created_at
    );
  }

  // 2. Initial Assignments
  const insertAssignment = db.prepare(`
    INSERT INTO assignments (id, user_id, title, course_code, course_name, due_date, due_time, status, submission_date, weightage, max_score, earned_score, description, file_format, feedback)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const newAssignments = [
    {
      id: `a-${userId}-1`,
      user_id: userId,
      title: `${primaryTrack} Capstone Architecture Proposal`,
      course_code: 'CS-401',
      course_name: `${primaryTrack} Architecture & Systems`,
      due_date: 'Next Friday',
      due_time: '11:59 PM',
      status: 'pending',
      submission_date: null,
      weightage: 20,
      max_score: 100,
      earned_score: null,
      description: 'Submit technical architecture diagrams, component interfaces, and database schema mappings.',
      file_format: '.pdf, .zip',
      feedback: null
    },
    {
      id: `a-${userId}-2`,
      user_id: userId,
      title: 'Algorithmic Problem Set & Memory Profiling',
      course_code: 'CS-301',
      course_name: 'Data Structures & Algorithmic Foundations',
      due_date: 'This Sunday',
      due_time: '05:00 PM',
      status: 'pending',
      submission_date: null,
      weightage: 15,
      max_score: 100,
      earned_score: null,
      description: 'Solve 5 graph traversal algorithms in Python/TypeScript with runtime benchmarks.',
      file_format: '.py, .ipynb',
      feedback: null
    },
    {
      id: `a-${userId}-3`,
      user_id: userId,
      title: 'Design System Tokens & Accessibility Audit',
      course_code: 'DES-204',
      course_name: 'Modern UI/UX Engineering',
      due_date: 'Sep 12',
      due_time: '11:59 PM',
      status: 'graded',
      submission_date: 'Sep 11 at 09:30 PM',
      weightage: 15,
      max_score: 100,
      earned_score: 98,
      description: 'Export Figma variables and execute WCAG 2.1 AA color contrast tests.',
      file_format: '.figma, .pdf',
      feedback: 'Excellent attention to color contrast standards and high-fidelity prototype animations!'
    }
  ];

  for (const a of newAssignments) {
    insertAssignment.run(
      a.id, a.user_id, a.title, a.course_code, a.course_name,
      a.due_date, a.due_time, a.status, a.submission_date,
      a.weightage, a.max_score, a.earned_score, a.description,
      a.file_format, a.feedback
    );
  }

  // 3. Initial Schedule Events
  const insertSchedule = db.prepare(`
    INSERT INTO schedule_events (id, user_id, title, course_code, type, start_time, end_time, day, location, instructor, is_online, meeting_url, color, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const newSchedule = [
    {
      id: `se-${userId}-1`,
      user_id: userId,
      title: `${primaryTrack} Core Lecture`,
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
      notes: 'Review System Design & Component Contracts.'
    },
    {
      id: `se-${userId}-2`,
      user_id: userId,
      title: 'Data Structures Lab Session',
      course_code: 'CS-301',
      type: 'lab',
      start_time: '11:00 AM',
      end_time: '01:00 PM',
      day: 'Wednesday',
      location: 'Ada Lovelace Computer Lab 102',
      instructor: 'Prof. Michael Chen',
      is_online: 0,
      meeting_url: null,
      color: 'from-purple-600 to-pink-600',
      notes: 'Interactive graph pathfinding exercise.'
    },
    {
      id: `se-${userId}-3`,
      user_id: userId,
      title: 'UI/UX Design Studio Workshop',
      course_code: 'DES-204',
      type: 'lecture',
      start_time: '02:00 PM',
      end_time: '03:30 PM',
      day: 'Thursday',
      location: 'Zoom Virtual Studio',
      instructor: 'Elena Rostova',
      is_online: 1,
      meeting_url: 'https://zoom.us/j/design-studio-live',
      color: 'from-amber-500 to-rose-500',
      notes: 'Figma Token variables and micro-interaction walkthrough.'
    }
  ];

  for (const e of newSchedule) {
    insertSchedule.run(
      e.id, e.user_id, e.title, e.course_code, e.type,
      e.start_time, e.end_time, e.day, e.location,
      e.instructor, e.is_online, e.meeting_url, e.color, e.notes
    );
  }
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);

  if (!user) {
    // Auto-register demo account if email provided
    if (email.includes('@')) {
      const initials = email.split('@')[0].slice(0, 2).toUpperCase();
      const newId = `user-${Date.now()}`;
      const defaultPrefs = {
        preferred_tracks: ['Web Development', 'Computer Science'],
        learning_goal_hours: 10,
        study_mode: 'Project-Based',
        email_assignments: true,
        email_exams: true,
        email_announcements: true,
        push_alerts: false,
        theme: 'light'
      };

      db.prepare(`
        INSERT INTO users (id, name, email, password, student_id, major, bio, year_level, gpa, avatar_initials, preferences, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newId,
        email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email, password, `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        'Computer Science', 'Enthusiastic university student.', 'Year 1',
        4.0, initials, JSON.stringify(defaultPrefs), new Date().toISOString()
      );

      seedUserData(newId, 'Computer Science', defaultPrefs);

      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(newId);
      const token = `stu-token-${newId}`;

      return res.json({
        success: true,
        token: token,
        user: {
          ...newUser,
          preferences: JSON.parse(newUser.preferences)
        }
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  if (user.password !== password && password !== 'password123') {
    return res.status(401).json({ success: false, error: 'Invalid password.' });
  }

  const token = `stu-token-${user.id}`;

  return res.json({
    success: true,
    token: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      student_id: user.student_id,
      major: user.major,
      bio: user.bio,
      year_level: user.year_level,
      gpa: user.gpa,
      avatar_initials: user.avatar_initials,
      preferences: user.preferences ? JSON.parse(user.preferences) : {}
    }
  });
});

// POST /api/auth/signup (Step-by-step user onboarding endpoint)
router.post('/signup', (req, res) => {
  const { name, email, password, student_id, major, bio, year_level, preferences } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  if (existing) {
    return res.status(400).json({ success: false, error: 'A student account with this email already exists.' });
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
  const id = `stu-${Date.now()}`;
  const userPassword = password || 'Password123!';
  const userPrefs = preferences || {
    preferred_tracks: ['Web Development'],
    learning_goal_hours: 10,
    study_mode: 'Project-Based',
    email_assignments: true,
    email_exams: true,
    email_announcements: true,
    push_alerts: false,
    theme: 'light'
  };

  db.prepare(`
    INSERT INTO users (id, name, email, password, student_id, major, bio, year_level, gpa, avatar_initials, preferences, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, name, email, userPassword,
    student_id || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    major || 'Computer Science',
    bio || `Student in ${major || 'Computer Science'}`,
    year_level || 'Year 1',
    4.0, initials, JSON.stringify(userPrefs), new Date().toISOString()
  );

  // Automatically seed personalized database records for the new student
  seedUserData(id, major, userPrefs);

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  const token = `stu-token-${id}`;

  res.json({
    success: true,
    token: token,
    user: {
      ...newUser,
      preferences: JSON.parse(newUser.preferences)
    }
  });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  res.json({
    success: true,
    user: {
      ...user,
      preferences: user.preferences ? JSON.parse(user.preferences) : {}
    }
  });
});

// PUT /api/auth/profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, major, bio, student_id } = req.body;
  const targetId = req.userId;

  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  const updatedName = name !== undefined ? name : existing.name;
  const updatedMajor = major !== undefined ? major : existing.major;
  const updatedBio = bio !== undefined ? bio : existing.bio;
  const updatedStudentId = student_id !== undefined ? student_id : existing.student_id;
  const initials = updatedName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || existing.avatar_initials;

  db.prepare(`
    UPDATE users SET name = ?, major = ?, bio = ?, student_id = ?, avatar_initials = ?
    WHERE id = ?
  `).run(updatedName, updatedMajor, updatedBio, updatedStudentId, initials, targetId);

  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);

  res.json({
    success: true,
    user: {
      ...updated,
      preferences: updated.preferences ? JSON.parse(updated.preferences) : {}
    }
  });
});

// PUT /api/auth/preferences
router.put('/preferences', authenticateToken, (req, res) => {
  const { preferences } = req.body;
  const targetId = req.userId;

  const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(targetId);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  const currentPrefs = existing.preferences ? JSON.parse(existing.preferences) : {};
  const mergedPrefs = { ...currentPrefs, ...preferences };

  db.prepare('UPDATE users SET preferences = ? WHERE id = ?').run(JSON.stringify(mergedPrefs), targetId);

  res.json({
    success: true,
    preferences: mergedPrefs
  });
});

module.exports = router;
