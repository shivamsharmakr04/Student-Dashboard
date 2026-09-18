const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

// GET /api/analytics
router.get('/', (req, res) => {
  const userId = req.userId || 'demo-student-001';

  const user = db.prepare('SELECT gpa, name FROM users WHERE id = ?').get(userId);
  const currentGpa = user ? user.gpa : 3.92;
  const userName = user ? user.name : 'Student';

  const subjectPerformance = [
    { course_code: 'CS-401', course_name: 'Advanced React & Next.js Architecture', score: 95, grade: 'A+', credits: 4, color: 'from-blue-600 to-indigo-600' },
    { course_code: 'DS-402', course_name: 'Machine Learning Engineering', score: 91, grade: 'A', credits: 4, color: 'from-emerald-500 to-teal-700' },
    { course_code: 'CS-301', course_name: 'Data Structures & Algorithms', score: 88, grade: 'A-', credits: 4, color: 'from-purple-600 to-pink-600' },
    { course_code: 'DES-204', course_name: 'UI/UX Design Systems', score: 96, grade: 'A+', credits: 3, color: 'from-amber-500 to-rose-500' },
    { course_code: 'SE-305', course_name: 'Cloud Infrastructure & DevOps', score: 86, grade: 'B+', credits: 3, color: 'from-cyan-500 to-blue-600' }
  ];

  const monthlyStudyDistribution = [
    { month: 'Jan', hours: 28, target: 30 },
    { month: 'Feb', hours: 35, target: 30 },
    { month: 'Mar', hours: 42, target: 35 },
    { month: 'Apr', hours: 38, target: 35 },
    { month: 'May', hours: 46, target: 40 },
    { month: 'Jun', hours: 30, target: 30 },
    { month: 'Jul', hours: 24, target: 25 },
    { month: 'Aug', hours: 39, target: 35 },
    { month: 'Sep', hours: 44, target: 40 }
  ];

  const skillMastery = [
    { skill: 'Fullstack Next.js 16', level: 94, category: 'Web Architecture', status: 'Mastered' },
    { skill: 'PyTorch & Neural Nets', level: 88, category: 'Machine Learning', status: 'Proficient' },
    { skill: 'Figma Design Tokens', level: 96, category: 'UI/UX Design', status: 'Mastered' },
    { skill: 'Graph Algorithms (BFS/DFS)', level: 85, category: 'Algorithms', status: 'Proficient' },
    { skill: 'Kubernetes & Docker', level: 78, category: 'DevOps', status: 'Developing' }
  ];

  const academicInsights = [
    {
      id: '1',
      title: 'Top 5% Academic Honor Roll Candidate',
      category: 'milestone',
      description: `Your current ${currentGpa} GPA qualifies you for the Spring 2026 Dean’s High Honor List.`,
      impact: 'High'
    },
    {
      id: '2',
      title: 'Excellence in Frontend & Component Architecture',
      category: 'strength',
      description: 'Scored 95%+ across Server Components, UI token systems, and web performance optimization.',
      impact: 'High'
    },
    {
      id: '3',
      title: 'Focus Opportunity: Kubernetes Deployment Ingress',
      category: 'recommendation',
      description: 'Spending 45 additional minutes on Helm charts will help boost your DevOps grade from B+ to A-.',
      impact: 'Medium'
    }
  ];

  res.json({
    success: true,
    gpa: currentGpa,
    total_study_hours: 142.5,
    attendance_rate: 96.5,
    assignment_index: 94,
    subjectPerformance,
    monthlyStudyDistribution,
    skillMastery,
    academicInsights
  });
});

module.exports = router;
