import { Assignment } from '@/types/assignment'

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: '1',
    title: 'UI Component Library & Design Tokens',
    course_code: 'DES-204',
    course_name: 'UI/UX Design Systems',
    due_date: 'Friday, Sep 19',
    due_time: '11:59 PM',
    status: 'pending',
    weightage: 15,
    max_score: 100,
    description: 'Export an interactive Figma prototype and document token variables for color, typography, and elevation scales.',
    file_format: '.figma, .pdf, .zip'
  },
  {
    id: '2',
    title: 'PyTorch Image Classification Pipeline',
    course_code: 'DS-402',
    course_name: 'Machine Learning Engineering',
    due_date: 'Sunday, Sep 21',
    due_time: '05:00 PM',
    status: 'pending',
    weightage: 20,
    max_score: 100,
    description: 'Train a ResNet-18 model on CIFAR-10, measure accuracy & loss curves, and submit a Jupyter Notebook with output plots.',
    file_format: '.ipynb, .pdf'
  },
  {
    id: '3',
    title: 'Next.js App Router & Server Actions Lab',
    course_code: 'CS-401',
    course_name: 'Advanced React & Next.js Architecture',
    due_date: 'Sep 14',
    due_time: '11:59 PM',
    status: 'submitted',
    submission_date: 'Sep 13 at 09:45 PM',
    weightage: 10,
    max_score: 50,
    description: 'Build a CRUD task manager leveraging Server Actions, optimistic UI updates, and Supabase database binding.',
    file_format: '.zip, GitHub URL'
  },
  {
    id: '4',
    title: 'Graph Algorithms & Shortest Path Solver',
    course_code: 'CS-301',
    course_name: 'Data Structures & Algorithms',
    due_date: 'Sep 10',
    due_time: '11:59 PM',
    status: 'graded',
    submission_date: 'Sep 09 at 10:15 PM',
    weightage: 15,
    max_score: 100,
    earned_score: 96,
    description: 'Implement Dijkstra and A* pathfinding in Python with time complexity analysis and memory benchmarks.',
    file_format: '.py, .pdf',
    feedback: 'Exceptional code structure and clear Big-O notation proofs! Minor point off for edge case handling in negative weights.'
  },
  {
    id: '5',
    title: 'Docker Containerization & Kubernetes Helm Deployment',
    course_code: 'SE-305',
    course_name: 'Cloud Infrastructure & DevOps',
    due_date: 'Sep 08',
    due_time: '11:59 PM',
    status: 'graded',
    submission_date: 'Sep 08 at 08:20 PM',
    weightage: 10,
    max_score: 100,
    earned_score: 92,
    description: 'Write Dockerfiles for microservices, configure ingress controllers, and package into a Helm release.',
    file_format: '.yaml, .sh',
    feedback: 'Well-structured Helm charts. Great use of multi-stage Docker builds to keep image sizes minimal.'
  },
  {
    id: '6',
    title: 'Database Schema Normalization & SQL Triggers',
    course_code: 'DB-201',
    course_name: 'Database Management Systems',
    due_date: 'Sep 05',
    due_time: '11:59 PM',
    status: 'overdue',
    weightage: 10,
    max_score: 50,
    description: 'Design a 3NF relational database schema for an e-commerce platform and write automated audit triggers.',
    file_format: '.sql, .png'
  }
]
