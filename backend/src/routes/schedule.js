const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/schedule?userId=...
router.get('/', (req, res) => {
  const userId = req.query.userId || 'demo-student-001';
  let events = db.prepare('SELECT * FROM schedule_events WHERE user_id = ?').all(userId);

  if (!events || events.length === 0) {
    events = db.prepare('SELECT * FROM schedule_events WHERE user_id = ?').all('demo-student-001');
  }

  // Convert SQLite integer (0 or 1) for is_online to boolean for frontend compatibility
  const formatted = events.map(e => ({
    ...e,
    is_online: Boolean(e.is_online)
  }));

  res.json({ success: true, events: formatted });
});

// POST /api/schedule (Add new schedule event)
router.post('/', (req, res) => {
  const { userId, title, course_code, type, start_time, end_time, day, location, instructor, is_online, meeting_url, color, notes } = req.body;

  if (!title || !day) {
    return res.status(400).json({ success: false, error: 'Title and day are required' });
  }

  const id = `evt-${Date.now()}`;
  const targetUserId = userId || 'demo-student-001';

  db.prepare(`
    INSERT INTO schedule_events (id, user_id, title, course_code, type, start_time, end_time, day, location, instructor, is_online, meeting_url, color, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, targetUserId, title,
    course_code || 'GEN-101',
    type || 'lecture',
    start_time || '10:00 AM',
    end_time || '11:00 AM',
    day,
    location || 'Main Campus',
    instructor || 'Instructor',
    is_online ? 1 : 0,
    meeting_url || null,
    color || 'from-blue-600 to-indigo-600',
    notes || ''
  );

  const newEvent = db.prepare('SELECT * FROM schedule_events WHERE id = ?').get(id);

  res.json({
    success: true,
    event: {
      ...newEvent,
      is_online: Boolean(newEvent.is_online)
    }
  });
});

module.exports = router;
