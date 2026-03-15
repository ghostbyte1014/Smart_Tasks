import { useState, useEffect, useMemo } from 'react';
import { Plus, Moon, Sun, HelpCircle, Layers } from 'lucide-react';
import { Button } from './components/ui/button';
import { TaskList } from './components/TaskList';
import { AddTaskDialog } from './components/AddTaskDialog';
import { GamificationPanel } from './components/GamificationPanel';
import { ProgressTracker } from './components/ProgressTracker';
import { RewardAnimation } from './components/RewardAnimation';
import { Task } from './components/TaskCard';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { CommandPalette } from './components/CommandPalette';
import { FocusTimer } from './components/FocusTimer';
import { SkillTree } from './components/SkillTree';
import { ProductivityHeatmap } from './components/ProductivityHeatmap';
import { HowItWorksPage } from './components/HowItWorksPage';
import { Logo } from './components/Logo';

import { initialTasks, initialWeeklyData, pitchModeTasks, pitchModeWeeklyData, generateHeatmapSeedData } from '../lib/mockData';
import confetti from 'canvas-confetti';
import { AuthPage } from './AuthPage';

type Page = 'dashboard' | 'howItWorks';

const HEATMAP_SEED = generateHeatmapSeedData();

export default function App() {
  // ── Core State ──────────────────────────────────────────────────────────────
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [lastXpGain, setLastXpGain] = useState(0);

  // ── Gamification State ───────────────────────────────────────────────────────
  const [xp, setXp] = useState(350);
  const [level, setLevel] = useState(3);
  const [streak, setStreak] = useState(5);
  const [badges, setBadges] = useState<string[]>(['first-task', 'streak-3']);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(2);
  const [weeklyData, setWeeklyData] = useState(initialWeeklyData);

  // ── UI Mode State ────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPitchMode, setIsPitchMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  // ── Command Palette ──────────────────────────────────────────────────────────
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // ── Focus Timer ──────────────────────────────────────────────────────────────
  const [focusTimerId, setFocusTimerId] = useState<string | null>(null);
  const [pendingMultiplier, setPendingMultiplier] = useState(1);

  // ── Batch Mode ───────────────────────────────────────────────────────────────
  const [batchCategory, setBatchCategory] = useState<string | null>(null);

  // ── Dark mode persist ────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // ── Global Cmd+K Listener ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── XP Calculation ───────────────────────────────────────────────────────────
  const calculateXP = (priority: string, multiplier = 1) => {
    const xpMap = { low: 10, medium: 20, high: 30 };
    const base = xpMap[priority as keyof typeof xpMap] || 10;
    return Math.round(base * multiplier);
  };

  // ── Level Up Watcher ─────────────────────────────────────────────────────────
  useEffect(() => {
    const xpForNextLevel = level * 100;
    if (xp >= xpForNextLevel) {
      const newLevel = level + 1;
      setLevel(newLevel);
      toast.success(`🎉 Level Up! You're now level ${newLevel}!`);
      if (newLevel === 5) setBadges(prev => [...new Set([...prev, 'level-5'])]);
      if (newLevel === 10) setBadges(prev => [...new Set([...prev, 'level-10'])]);
    }
  }, [xp, level]);

  // ── Achievement Badge Watcher ─────────────────────────────────────────────────
  useEffect(() => {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount >= 1 && !badges.includes('first-task')) {
      setBadges(prev => [...prev, 'first-task']);
      toast.success('🏆 Achievement: First Steps!');
    }
    if (completedCount >= 10 && !badges.includes('tasks-10')) {
      setBadges(prev => [...prev, 'tasks-10']);
      toast.success('🏆 Achievement: Task Master!');
    }
    if (streak >= 7 && !badges.includes('streak-7')) {
      setBadges(prev => [...prev, 'streak-7']);
      toast.success('🏆 Achievement: Week Warrior!');
    }
  }, [tasks, streak, badges]);

  // ── Pitch Mode Toggle ─────────────────────────────────────────────────────────
  const togglePitchMode = () => {
    if (!isPitchMode) {
      setTasks(pitchModeTasks);
      setWeeklyData(pitchModeWeeklyData);
      setXp(7450); setLevel(28); setStreak(114);
      setBadges(['first-task', 'tasks-10', 'streak-3', 'streak-7', 'level-5', 'level-10', 'level-25']);
      setTasksCompletedToday(8);
      toast.success('🚀 Pitch Mode Activated!');
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } else {
      setTasks(initialTasks);
      setWeeklyData(initialWeeklyData);
      setXp(350); setLevel(3); setStreak(5);
      setBadges(['first-task', 'streak-3']);
      setTasksCompletedToday(2);
      toast.info('Returned to Normal Mode');
    }
    setIsPitchMode(prev => !prev);
    setFocusTimerId(null);
    setBatchCategory(null);
  };

  // ── Task Handlers ─────────────────────────────────────────────────────────────
  const handleToggleTask = (id: string, multiplierOverride?: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const multiplier = multiplierOverride ?? pendingMultiplier;

    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined }
          : t
      )
    );

    if (!task.completed) {
      const xpGained = calculateXP(task.priority, focusTimerId === id ? multiplier : 1);
      setXp(prev => prev + xpGained);
      setTasksCompletedToday(prev => prev + 1);
      setLastXpGain(xpGained);
      setShowReward(true);
      const multiplierNote = focusTimerId === id ? ' (Focus 1.5×!)' : '';
      toast.success(`✅ Task complete! +${xpGained} XP${multiplierNote}`);
      if (focusTimerId === id) setFocusTimerId(null);
    } else {
      const xpLost = calculateXP(task.priority);
      setXp(prev => Math.max(0, prev - xpLost));
      setTasksCompletedToday(prev => Math.max(0, prev - 1));
      toast.info('Task marked as incomplete');
    }
    setPendingMultiplier(1);
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task?.isBoss && !task.completed) {
      toast.warning('⚠️ Daily Boss abandoned! You lose your momentum bonus.', { duration: 4000 });
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    if (focusTimerId === id) setFocusTimerId(null);
    toast.success('Task deleted');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(prev =>
        prev.map(t => (t.id === editingTask.id ? { ...taskData, id: t.id } : t))
      );
      toast.success('Task updated');
    } else {
      const newTask: Task = { ...taskData, id: Date.now().toString() };
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task added!');
    }
    setEditingTask(null);
  };

  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) setEditingTask(null);
  };

  // ── Focus Timer ───────────────────────────────────────────────────────────────
  const handleTimerComplete = (taskId: string, multiplier: number) => {
    setPendingMultiplier(multiplier);
    toast.success(`⏱ Pomodoro done! Complete the task for ${multiplier}× XP!`, { duration: 5000 });
  };

  const focusTask = useMemo(
    () => tasks.find(t => t.id === focusTimerId) ?? null,
    [tasks, focusTimerId]
  );

  // ── Batch Mode ────────────────────────────────────────────────────────────────
  const availableCategories = useMemo(
    () => [...new Set(tasks.map(t => t.category))].sort(),
    [tasks]
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  const dark = isDarkMode || isPitchMode;

  if (!isAuthenticated) {
    return (
      <>
        <AuthPage onLogin={() => setIsAuthenticated(true)} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  if (currentPage === 'howItWorks') {
    return (
      <>
        <HowItWorksPage onBack={() => setCurrentPage('dashboard')} isDarkMode={dark} />
        <Toaster position="bottom-right" />
      </>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${dark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* ── Top Navigation Bar ─────────────────────────────────────────────────── */}
      <header className={`border-b ${dark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur-md sticky top-0 z-50`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">

          <div className="flex items-center gap-3">
            <Logo isDarkMode={dark} />
            <h1 className="text-xl font-semibold tracking-tight">SmartTasks</h1>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 flex-wrap justify-end">

            {/* Cmd+K hint */}
            <button
              onClick={() => setCmdPaletteOpen(true)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                dark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
              }`}
            >
              Search & Commands
              <kbd className={`text-xs px-1.5 py-0.5 rounded ${dark ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-600 border border-slate-200'}`}>
                Ctrl+K
              </kbd>
            </button>

            {/* How It Works */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage('howItWorks')}
              className={`gap-1.5 ${dark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : ''}`}
            >
              <HelpCircle className="size-4" />
              <span className="hidden sm:inline">How it Works</span>
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDarkMode(m => !m)}
              className={dark ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}
            >
              {isDarkMode ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>

            <div className={`h-6 w-px ${dark ? 'bg-slate-700' : 'bg-slate-200'}`} />

            {/* Pitch Mode */}
            <Button
              variant={isPitchMode ? 'default' : 'outline'}
              onClick={togglePitchMode}
              className={`transition-all duration-300 text-sm ${isPitchMode ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/20' : 'hover:bg-slate-100'}`}
              size="sm"
            >
              {isPitchMode ? '✨ Pitch Demo Active' : 'Demo Mode'}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => setIsAuthenticated(false)}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Left Column: Task List ─────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Task List Header */}
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-semibold tracking-tight ${dark ? 'text-slate-100' : 'text-slate-800'}`}>
                {batchCategory ? `📦 Batch: ${batchCategory}` : 'Current Projects'}
              </h2>
              <div className="flex items-center gap-2">
                {/* Batch Mode */}
                {batchCategory ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBatchCategory(null)}
                    className={`gap-1.5 text-sm ${dark ? 'border-teal-700 text-teal-400 hover:bg-teal-900/30' : 'border-teal-400 text-teal-700 hover:bg-teal-50'}`}
                  >
                    <Layers className="size-3.5" />
                    End Batch
                  </Button>
                ) : (
                  <div className="relative group">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`gap-1.5 text-sm ${dark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : ''}`}
                    >
                      <Layers className="size-3.5" />
                      Batch
                    </Button>
                    {/* Dropdown on hover */}
                    <div className={`absolute right-0 top-full mt-1 z-20 min-w-36 rounded-lg border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ${
                      dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                      {availableCategories.map(cat => (
                        <button
                          key={cat}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            dark ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                          onClick={() => setBatchCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => setDialogOpen(true)}
                  size="sm"
                  className={`gap-1.5 ${dark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}
                >
                  <Plus className="size-4" />
                  New Task
                </Button>
              </div>
            </div>

            {/* Task List Container */}
            <div className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${dark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <TaskList
                tasks={tasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                onStartTimer={setFocusTimerId}
                activeTimerId={focusTimerId}
                isPitchMode={isPitchMode}
                isDarkMode={isDarkMode}
                batchCategory={batchCategory}
              />
            </div>

            {/* Productivity Heatmap */}
            <ProductivityHeatmap
              tasks={tasks}
              seedTimestamps={HEATMAP_SEED}
              isDarkMode={dark}
            />
          </div>

          {/* ── Right Column: Analytics & Gamification ─────────────────────────── */}
          <div className="lg:col-span-4 space-y-5">

            {/* Focus Timer (visible only when active) */}
            {focusTimerId && (
              <FocusTimer
                activeTaskId={focusTimerId}
                activeTaskTitle={focusTask?.title ?? ''}
                onComplete={handleTimerComplete}
                onClear={() => setFocusTimerId(null)}
                isDarkMode={dark}
              />
            )}

            <GamificationPanel
              xp={xp}
              level={level}
              streak={streak}
              badges={badges}
              isPitchMode={isPitchMode}
            />

            <ProgressTracker
              tasksCompletedToday={tasksCompletedToday}
              weeklyData={weeklyData}
              isPitchMode={isPitchMode}
            />

            <SkillTree tasks={tasks} isDarkMode={dark} />
          </div>
        </div>
      </main>

      {/* ── Dialogs & Overlays ───────────────────────────────────────────────────── */}
      <CommandPalette
        open={cmdPaletteOpen}
        onOpenChange={setCmdPaletteOpen}
        tasks={tasks}
        onNewTask={() => { setDialogOpen(true); setCmdPaletteOpen(false); }}
        onTogglePitchMode={togglePitchMode}
        onToggleDarkMode={() => setIsDarkMode(m => !m)}
        onSearchSelect={(task) => {
          setEditingTask(task);
          setDialogOpen(true);
        }}
        isPitchMode={isPitchMode}
        isDarkMode={isDarkMode}
      />

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogChange}
        onSave={handleSaveTask}
        editTask={editingTask}
        existingTasks={tasks}
      />

      <RewardAnimation
        show={showReward}
        xpGained={lastXpGain}
        onComplete={() => setShowReward(false)}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}
