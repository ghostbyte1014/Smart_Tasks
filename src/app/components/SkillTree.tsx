import { useMemo } from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Task } from './TaskCard';
import { Code2, Dumbbell, ClipboardList, BookOpen, Briefcase, Star } from 'lucide-react';

interface SkillTreeProps {
  tasks: Task[];
  isDarkMode?: boolean;
}

const CATEGORY_META: Record<string, { icon: React.ReactNode; color: string; darkColor: string; xpPerTask: number }> = {
  Study:   { icon: <BookOpen className="size-4" />,      color: 'from-blue-500 to-cyan-500',    darkColor: 'bg-blue-500',   xpPerTask: 20 },
  Fitness: { icon: <Dumbbell className="size-4" />,      color: 'from-green-500 to-emerald-500', darkColor: 'bg-green-500', xpPerTask: 15 },
  Work:    { icon: <Briefcase className="size-4" />,     color: 'from-violet-500 to-purple-500', darkColor: 'bg-violet-500', xpPerTask: 25 },
  Admin:   { icon: <ClipboardList className="size-4" />, color: 'from-amber-500 to-orange-500',  darkColor: 'bg-amber-500',  xpPerTask: 10 },
  Code:    { icon: <Code2 className="size-4" />,         color: 'from-rose-500 to-pink-500',     darkColor: 'bg-rose-500',   xpPerTask: 30 },
};

const DEFAULT_META = { icon: <Star className="size-4" />, color: 'from-slate-400 to-slate-500', darkColor: 'bg-slate-500', xpPerTask: 15 };

const XP_PER_LEVEL = 100;

function categoryLevel(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function SkillBadge({ category, level }: { category: string; level: number }) {
  const meta = CATEGORY_META[category] || DEFAULT_META;
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${meta.color} shadow`}>
      {meta.icon}
      {category} Lv.{level}
    </div>
  );
}

function UnlockedBadge({ category }: { category: string }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-yellow-500">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill="currentColor" />
      </svg>
      <span className="text-xs text-yellow-600 font-semibold">{category} Master</span>
    </div>
  );
}

export function SkillTree({ tasks, isDarkMode }: SkillTreeProps) {
  const dark = isDarkMode;

  const categoryStats = useMemo(() => {
    const stats: Record<string, { xp: number; completed: number; total: number }> = {};

    for (const task of tasks) {
      const cat = task.category || 'Other';
      if (!stats[cat]) stats[cat] = { xp: 0, completed: 0, total: 0 };
      stats[cat].total += 1;
      if (task.completed) {
        const meta = CATEGORY_META[cat] || DEFAULT_META;
        stats[cat].xp += meta.xpPerTask;
        stats[cat].completed += 1;
      }
    }

    return Object.entries(stats).map(([cat, data]) => {
      const level = categoryLevel(data.xp);
      const xpInLevel = data.xp % XP_PER_LEVEL;
      const progress = (xpInLevel / XP_PER_LEVEL) * 100;
      return { cat, ...data, level, progress, unlocked: level >= 5 };
    }).sort((a, b) => b.xp - a.xp);
  }, [tasks]);

  return (
    <Card className={`p-5 ${dark ? 'bg-slate-800 border-slate-700' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <Code2 className={`size-5 ${dark ? 'text-violet-400' : 'text-violet-600'}`} />
        <h3 className={`font-semibold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>Skill Tree</h3>
        <span className={`ml-auto text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          Reach Lv.5 to unlock badge
        </span>
      </div>

      {categoryStats.length === 0 && (
        <p className={`text-sm text-center py-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          Complete tasks to grow your skills!
        </p>
      )}

      <div className="space-y-4">
        {categoryStats.map(({ cat, xp, level, progress, completed, total, unlocked }) => {
          const meta = CATEGORY_META[cat] || DEFAULT_META;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md bg-gradient-to-br ${meta.color} text-white`}>
                    {meta.icon}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{cat}</div>
                    {unlocked && <UnlockedBadge category={cat} />}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>Lv.{level}</div>
                  <div className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{completed}/{total}</div>
                </div>
              </div>
              <Progress
                value={progress}
                className={`h-2 ${dark ? 'bg-slate-700' : 'bg-slate-100'}`}
              />
              <div className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                {xp % XP_PER_LEVEL} / {XP_PER_LEVEL} XP to next level
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
