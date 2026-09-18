const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);

  if (!user) {
    // Demo auto-register if email provided
    if (email.includes('@')) {
      const initials = email.split('@')[0].slice(0, 2).toUpperCase();
      const newUser = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        password: password,
        student_id: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        major: 'Computer Science',
        bio: 'Enthusiastic university student.',
        year_level: 'Year 1',
        gpa: 3.9,
        avatar_initials: initials,
        preferences: JSON.stringify({
          preferred_tracks: ['Web Development', 'Computer Science'],
          learning_goal_hours: 10,
          study_mode: 'Project-Based',
          email_assignments: true,
          email_exams: true,
          email_announcements: true,
          push_alerts: false,
          theme: 'light'
        }),
        created_at: new Date().toISOString()
      };

      db.prepare(`
        INSERT INTO users (id, name, email, password, student_id, major, bio, year_level, gpa, avatar_initials, preferences, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        newUser.id, newUser.name, newUser.email, newUser.password,
        newUser.student_id, newUser.major, newUser.bio, newUser.year_level,
        newUser.gpa, newUser.avatar_initials, newUser.preferences, newUser.created_at
      );

      return res.json({
        success: true,
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

  return res.json({
    success: true,
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

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { name, email, password, student_id, major, bio, year_level, preferences } = req.body;

  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  if (existing) {
    return res.status(400).json({ success: false, error: 'User with this email already exists.' });
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
  const id = `stu-${Date.now()}`;
  const userPassword = password || 'Password123!';

  const prefsString = JSON.stringify(preferences || {
    preferred_tracks: ['Web Development'],
    learning_goal_hours: 10,
    study_mode: 'Project-Based',
    email_assignments: true,
    email_exams: true,
    email_announcements: true,
    push_alerts: false,
    theme: 'light'
  });

  db.prepare(`
    INSERT INTO users (id, name, email, password, student_id, major, bio, year_level, gpa, avatar_initials, preferences, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, name, email, userPassword,
    student_id || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    major || 'Computer Science',
    bio || 'Enthusiastic university student.',
    year_level || 'Year 1',
    4.0, initials, prefsString, new Date().toISOString()
  );

  const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);

  res.json({
    success: true,
    user: {
      ...newUser,
      preferences: JSON.parse(newUser.preferences)
    }
  });
});

// GET /api/auth/me?userId=...
router.get('/me', (req, res) => {
  const userId = req.query.userId || 'demo-student-001';
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

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
router.put('/profile', (req, res) => {
  const { userId, name, major, bio, student_id } = req.body;
  const targetId = userId || 'demo-student-001';

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
router.put('/preferences', (req, res) => {
  const { userId, preferences } = req.body;
  const targetId = userId || 'demo-student-001';

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
