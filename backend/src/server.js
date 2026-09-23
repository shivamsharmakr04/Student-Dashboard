const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/api/health', (_req, res) => res.json({
  status: 'ok',
  service: 'EduPulse Backend API',
  database: 'supabase',
  timestamp: new Date().toISOString()
}));
app.get('/', (_req, res) => res.json({ service: 'EduPulse Backend API', status: 'running' }));
app.listen(PORT, () => console.log(`EduPulse backend listening on ${PORT}`));
