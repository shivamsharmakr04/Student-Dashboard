const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all course routes
router.use(authenticateToken);

// GET /api/courses
router.get('/', (req, res) => {
  const userId = req.userId || 'demo-student-001';
  let courses = db.prepare('SELECT * FROM courses WHERE user_id = ?').all(userId);

  if (!courses || courses.length === 0) {
    courses = db.prepare('SELECT * FROM courses WHERE user_id = ?').all('demo-student-001');
  }

  res.json({ success: true, courses });
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE id = ? AND (user_id = ? OR user_id = "demo-student-001")').get(req.params.id, req.userId);
  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  res.json({ success: true, course });
});

// PUT /api/courses/:id/progress
router.put('/:id/progress', (req, res) => {
  const { progress, completed_lessons } = req.body;
  const courseId = req.params.id;

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }

  const newProgress = Math.min(100, Math.max(0, Number(progress)));
  const total = course.total_lessons || 20;
  const newCompleted = completed_lessons !== undefined
    ? Number(completed_lessons)
    : Math.min(total, Math.round((newProgress / 100) * total));

  db.prepare(`
    UPDATE courses SET progress = ?, completed_lessons = ? WHERE id = ?
  `).run(newProgress, newCompleted, courseId);

  const updatedCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);

  res.json({ success: true, course: updatedCourse });
});

module.exports = router;
