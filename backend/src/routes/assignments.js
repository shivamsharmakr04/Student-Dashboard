const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/assignments
router.get('/', (req, res) => {
  const userId = req.userId || 'demo-student-001';
  let assignments = db.prepare('SELECT * FROM assignments WHERE user_id = ?').all(userId);

  if (!assignments || assignments.length === 0) {
    assignments = db.prepare('SELECT * FROM assignments WHERE user_id = ?').all('demo-student-001');
  }

  res.json({ success: true, assignments });
});

// POST /api/assignments/:id/submit
router.post('/:id/submit', (req, res) => {
  const assignmentId = req.params.id;
  const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);

  if (!assignment) {
    return res.status(404).json({ success: false, error: 'Assignment not found' });
  }

  const subDate = `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  db.prepare(`
    UPDATE assignments SET status = 'submitted', submission_date = ? WHERE id = ?
  `).run(subDate, assignmentId);

  const updatedAssignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);

  res.json({ success: true, assignment: updatedAssignment });
});

// POST /api/assignments
router.post('/', (req, res) => {
  const { title, course_code, course_name, due_date, due_time, weightage, max_score, description, file_format } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, error: 'Title is required' });
  }

  const id = `asgn-${Date.now()}`;
  const targetUserId = req.userId || 'demo-student-001';

  db.prepare(`
    INSERT INTO assignments (id, user_id, title, course_code, course_name, due_date, due_time, status, weightage, max_score, description, file_format)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, targetUserId, title,
    course_code || 'GEN-101',
    course_name || 'General Coursework',
    due_date || 'Upcoming',
    due_time || '11:59 PM',
    'pending',
    weightage || 10,
    max_score || 100,
    description || '',
    file_format || '.pdf, .zip'
  );

  const newAssignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(id);

  res.json({ success: true, assignment: newAssignment });
});

module.exports = router;
