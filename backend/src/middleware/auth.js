const db = require('../db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  let userId = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    // Token format: stu-token-<userId> or direct userId
    if (token.startsWith('stu-token-')) {
      userId = token.replace('stu-token-', '');
    } else {
      userId = token;
    }
  } else if (req.headers['x-user-id']) {
    userId = req.headers['x-user-id'];
  } else if (req.query.userId) {
    userId = req.query.userId;
  }

  // Fallback to demo user if no token provided for public browsing
  if (!userId) {
    userId = 'demo-student-001';
  }

  const user = db.prepare('SELECT id, name, email, student_id, major, bio, year_level, gpa, avatar_initials, preferences FROM users WHERE id = ?').get(userId);

  if (user) {
    req.userId = user.id;
    req.user = {
      ...user,
      preferences: user.preferences ? JSON.parse(user.preferences) : {}
    };
  } else {
    req.userId = userId;
  }

  next();
}

module.exports = { authenticateToken };
