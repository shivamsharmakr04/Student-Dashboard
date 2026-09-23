const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const { authenticateToken } = require('../middleware/auth');

function profileFromUser(user, profile = {}) {
  return {
    id: user.id,
    name: profile.name || user.user_metadata?.name || user.email?.split('@')[0] || 'Student',
    email: user.email || profile.email || '',
    student_id: profile.student_id || user.user_metadata?.student_id || '',
    major: profile.major || user.user_metadata?.major || 'Computer Science',
    bio: profile.bio || user.user_metadata?.bio || '',
    year_level: profile.year_level || user.user_metadata?.year_level || 'Year 1',
    gpa: profile.gpa ?? null,
    avatar_initials: profile.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'ST',
    preferences: profile.preferences || user.user_metadata?.preferences || {}
  };
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success:false, error:'Email and password are required.' });
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) return res.status(401).json({ success:false, error:error?.message || 'Invalid email or password.' });
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
  res.json({ success:true, token:data.session.access_token, refresh_token:data.session.refresh_token, user:profileFromUser(data.user, profile || {}) });
});

router.post('/signup', async (req, res) => {
  const { name, email, password, student_id, major, bio, year_level, preferences } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success:false, error:'Name, email and password are required.' });
  const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm:true, user_metadata:{ name, student_id, major, bio, year_level, preferences } });
  if (error || !data.user) return res.status(400).json({ success:false, error:error?.message || 'Unable to create account.' });
  const profile = { id:data.user.id, name, email, student_id:student_id || null, major:major || 'Computer Science', bio:bio || null, year_level:year_level || 'Year 1', gpa:null, preferences:preferences || {} };
  const { error: profileError } = await supabase.from('profiles').upsert(profile);
  if (profileError) return res.status(500).json({ success:false, error:profileError.message });
  const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({ email, password });
  if (sessionError || !sessionData.session) return res.json({ success:true, user:profileFromUser(data.user, profile), message:'Account created. Please sign in.' });
  res.status(201).json({ success:true, token:sessionData.session.access_token, refresh_token:sessionData.session.refresh_token, user:profileFromUser(data.user, profile) });
});

router.get('/me', authenticateToken, async (req, res) => {
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', req.userId).maybeSingle();
  res.json({ success:true, user:profileFromUser(req.authUser, profile || {}) });
});

router.put('/profile', authenticateToken, async (req, res) => {
  const allowed = ['name','major','bio','student_id','year_level'];
  const patch = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
  const { data, error } = await supabase.from('profiles').update({ ...patch, updated_at:new Date().toISOString() }).eq('id', req.userId).select().single();
  if (error) return res.status(400).json({ success:false, error:error.message });
  res.json({ success:true, user:data });
});

router.put('/preferences', authenticateToken, async (req, res) => {
  const { data: current } = await supabase.from('profiles').select('preferences').eq('id', req.userId).maybeSingle();
  const preferences = { ...(current?.preferences || {}), ...(req.body.preferences || {}) };
  const { data, error } = await supabase.from('profiles').update({ preferences, updated_at:new Date().toISOString() }).eq('id', req.userId).select().single();
  if (error) return res.status(400).json({ success:false, error:error.message });
  res.json({ success:true, preferences:data.preferences });
});

module.exports = router;
