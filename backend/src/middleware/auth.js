const supabase = require('../supabase');

async function authenticateToken(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, error: 'Authentication required.' });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
    req.authUser = data.user;
    req.userId = data.user.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, error: 'Authentication failed.' });
  }
}
module.exports = { authenticateToken };
