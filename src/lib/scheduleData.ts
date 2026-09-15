import { ScheduleEvent } from '@/types/schedule'

export const MOCK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Monday
  {
    id: '1',
    title: 'Advanced React & Next.js Architecture',
    course_code: 'CS-401',
    type: 'lecture',
    start_time: '09:00 AM',
    end_time: '10:30 AM',
    day: 'Monday',
    location: 'Turing Science Center 204',
    instructor: 'Dr. Sarah Jenkins',
    is_online: false,
    color: 'from-blue-600 to-indigo-600',
    notes: 'Review Server Components, Streaming SSR, and Parallel Routes.'
  },
  {
    id: '2',
    title: 'Data Structures & Algorithms Lab',
    course_code: 'CS-301',
    type: 'lab',
    start_time: '11:00 AM',
    end_time: '01:00 PM',
    day: 'Monday',
    location: 'Ada Lovelace Computer Lab 102',
    instructor: 'Prof. Michael Chen',
    is_online: false,
    color: 'from-purple-600 to-pink-600',
    notes: 'Hands-on practice with Graph Traversal algorithms (BFS & DFS).'
  },
  {
    id: '3',
    title: 'Machine Learning Office Hours',
    course_code: 'DS-402',
    type: 'office_hours',
    start_time: '02:30 PM',
    end_time: '04:00 PM',
    day: 'Monday',
    location: 'Zoom Virtual Office',
    instructor: 'Alex Rivera',
    is_online: true,
    meeting_url: 'https://zoom.us/j/mock-ml-office-hours',
    color: 'from-emerald-500 to-teal-700',
    notes: 'Q&A session regarding PyTorch gradient descent assignment.'
  },

  // Tuesday
  {
    id: '4',
    title: 'UI/UX Design Systems Workshop',
    course_code: 'DES-204',
    type: 'lecture',
    start_time: '10:00 AM',
    end_time: '11:30 AM',
    day: 'Tuesday',
    location: 'Design Studio 405',
    instructor: 'Elena Rostova',
    is_online: false,
    color: 'from-amber-500 to-rose-500',
    notes: 'Design tokens, Figma variable components, and color contrast ratios.'
  },
  {
    id: '5',
    title: 'Cloud Infrastructure & DevOps',
    course_code: 'SE-305',
    type: 'lecture',
    start_time: '01:30 PM',
    end_time: '03:00 PM',
    day: 'Tuesday',
    location: 'Zoom Virtual Classroom',
    instructor: 'Marcus Vance',
    is_online: true,
    meeting_url: 'https://zoom.us/j/mock-devops-class',
    color: 'from-cyan-500 to-blue-600',
    notes: 'Kubernetes Pod deployments, Helm charts, and CI/CD pipelines.'
  },

  // Wednesday
  {
    id: '6',
    title: 'Advanced React & Next.js Architecture',
    course_code: 'CS-401',
    type: 'lecture',
    start_time: '09:00 AM',
    end_time: '10:30 AM',
    day: 'Wednesday',
    location: 'Turing Science Center 204',
    instructor: 'Dr. Sarah Jenkins',
    is_online: false,
    color: 'from-blue-600 to-indigo-600',
    notes: 'Database ORM integration, Supabase Auth, and Row Level Security.'
  },
  {
    id: '7',
    title: 'Data Structures Midterm Prep Study Group',
    course_code: 'CS-301',
    type: 'study_group',
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    day: 'Wednesday',
    location: 'Library Study Pod B',
    instructor: 'Student Led',
    is_online: false,
    color: 'from-purple-600 to-indigo-700',
    notes: 'Collaborative problem solving on Dynamic Programming.'
  },

  // Thursday
  {
    id: '8',
    title: 'UI/UX Design Systems Studio',
    course_code: 'DES-204',
    type: 'lab',
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    day: 'Thursday',
    location: 'Design Studio 405',
    instructor: 'Elena Rostova',
    is_online: false,
    color: 'from-amber-500 to-rose-500',
    notes: 'Prototype user testing and interactive micro-animation reviews.'
  },
  {
    id: '9',
    title: 'Machine Learning Engineering',
    course_code: 'DS-402',
    type: 'lecture',
    start_time: '01:30 PM',
    end_time: '03:30 PM',
    day: 'Thursday',
    location: 'Turing Science Center 301',
    instructor: 'Alex Rivera',
    is_online: false,
    color: 'from-emerald-500 to-teal-700',
    notes: 'Convolutional Neural Networks and Image Classification models.'
  },

  // Friday
  {
    id: '10',
    title: 'Data Structures Midterm Examination',
    course_code: 'CS-301',
    type: 'exam',
    start_time: '10:00 AM',
    end_time: '12:00 PM',
    day: 'Friday',
    location: 'Main Examination Hall A',
    instructor: 'Prof. Michael Chen',
    is_online: false,
    color: 'from-rose-600 to-red-700',
    notes: 'Bring student ID card and approved non-programmable calculator.'
  },
  {
    id: '11',
    title: 'DevOps & Cloud Systems Lab',
    course_code: 'SE-305',
    type: 'lab',
    start_time: '02:00 PM',
    end_time: '04:00 PM',
    day: 'Friday',
    location: 'Virtual AWS Cloud Sandbox',
    instructor: 'Marcus Vance',
    is_online: true,
    meeting_url: 'https://zoom.us/j/mock-cloud-lab',
    color: 'from-cyan-500 to-blue-600',
    notes: 'Provisioning EC2 instances and configuring VPC security groups.'
  }
]
