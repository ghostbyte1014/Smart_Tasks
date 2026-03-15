import { Task } from '../app/components/TaskCard';

// Helper: timestamp N days ago
const daysAgo = (n: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
};

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete React assignment',
    dueDate: '2026-03-17',
    priority: 'high',
    category: 'Study',
    completed: false,
    isBoss: true // Daily Boss
  },
  {
    id: '2',
    title: 'Prepare presentation slides',
    dueDate: '2026-03-16',
    priority: 'medium',
    category: 'Work',
    completed: false,
    blockedBy: '1' // Blocked by task 1
  },
  {
    id: '3',
    title: 'Morning workout',
    dueDate: '2026-03-15',
    priority: 'low',
    category: 'Fitness',
    completed: true,
    completedAt: daysAgo(0, 7)
  },
  {
    id: '4',
    title: 'Read "Atomic Habits" chapter 5',
    dueDate: '2026-03-18',
    priority: 'medium',
    category: 'Study',
    completed: false
  },
  {
    id: '5',
    title: 'Weekly budget review',
    dueDate: '2026-03-15',
    priority: 'medium',
    category: 'Admin',
    completed: true,
    completedAt: daysAgo(1)
  }
];

export const initialWeeklyData = [
  { day: 'Mon', tasks: 5 },
  { day: 'Tue', tasks: 7 },
  { day: 'Wed', tasks: 4 },
  { day: 'Thu', tasks: 8 },
  { day: 'Fri', tasks: 6 },
  { day: 'Sat', tasks: 3 },
  { day: 'Sun', tasks: 2 }
];

// ─── Heatmap seed data: past 52 weeks of completedAt timestamps ───────────────
export const generateHeatmapSeedData = (): number[] => {
  const timestamps: number[] = [];
  for (let i = 0; i < 365; i++) {
    const taskCount = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 6);
    for (let j = 0; j < taskCount; j++) {
      timestamps.push(daysAgo(i, Math.floor(Math.random() * 12) + 7));
    }
  }
  return timestamps;
};

// ─── Pitch Mode ───────────────────────────────────────────────────────────────
export const pitchModeTasks: Task[] = [
  {
    id: 'pitch-1',
    title: 'Finalize Series A Funding Deck',
    dueDate: '2026-03-15',
    priority: 'high',
    category: 'Work',
    completed: false,
    isBoss: true,
    completedAt: undefined
  },
  {
    id: 'pitch-2',
    title: 'Review Product Roadmap Q3',
    dueDate: '2026-03-16',
    priority: 'high',
    category: 'Work',
    completed: true,
    completedAt: daysAgo(0, 9)
  },
  {
    id: 'pitch-3',
    title: 'Interview Lead UX Designer',
    dueDate: '2026-03-17',
    priority: 'medium',
    category: 'Admin',
    completed: false,
    blockedBy: 'pitch-1'
  },
  {
    id: 'pitch-4',
    title: 'Launch SmartTasks v1.0',
    dueDate: '2026-03-18',
    priority: 'high',
    category: 'Study',
    completed: false
  },
  {
    id: 'pitch-5',
    title: 'Check server logs for anomalies',
    dueDate: '2026-03-15',
    priority: 'low',
    category: 'Admin',
    completed: true,
    completedAt: daysAgo(1)
  },
  {
    id: 'pitch-6',
    title: '10km morning run',
    dueDate: '2026-03-15',
    priority: 'medium',
    category: 'Fitness',
    completed: true,
    completedAt: daysAgo(0, 6)
  },
  {
    id: 'pitch-7',
    title: 'Refactor auth module',
    dueDate: '2026-03-16',
    priority: 'high',
    category: 'Study',
    completed: true,
    completedAt: daysAgo(2)
  },
  {
    id: 'pitch-8',
    title: 'Investor call follow-up emails',
    dueDate: '2026-03-15',
    priority: 'medium',
    category: 'Work',
    completed: false
  }
];

export const pitchModeWeeklyData = [
  { day: 'Mon', tasks: 12 },
  { day: 'Tue', tasks: 15 },
  { day: 'Wed', tasks: 18 },
  { day: 'Thu', tasks: 20 },
  { day: 'Fri', tasks: 25 },
  { day: 'Sat', tasks: 5 },
  { day: 'Sun', tasks: 8 }
];
