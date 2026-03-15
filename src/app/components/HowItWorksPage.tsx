import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Command, Timer, TreePine, Activity, Link2, Crown,
  LayersIcon, Sun, Moon, ChevronDown, ChevronUp,
  Zap, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface HowItWorksPageProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

const features = [
  {
    icon: <Command className="size-6" />,
    color: 'from-blue-500 to-cyan-500',
    title: 'Command Palette (Ctrl+K)',
    shortDesc: 'Your universal shortcut for everything',
    steps: [
      'Press Ctrl+K (or Cmd+K on Mac) anywhere in the app to open the palette.',
      'Type a task name to instantly search through your task list.',
      'Use quick actions: "New Task", toggle Pitch Mode, or switch Dark Mode.',
      'Press Escape or click outside to dismiss.'
    ],
    tip: 'The command palette is context-aware — it works from any page.'
  },
  {
    icon: <Timer className="size-6" />,
    color: 'from-violet-500 to-purple-500',
    title: 'Focus Mode (Pomodoro Timer)',
    shortDesc: '25-minute deep focus sessions with XP bonuses',
    steps: [
      'Hover over any task card and click the ⏱ Timer icon that appears.',
      'A 25-minute countdown begins in the right sidebar.',
      'Click "Start" to begin. Pause and reset anytime.',
      'If the Pomodoro completes while the task is active, you earn 1.5× XP when you mark it done!'
    ],
    tip: 'Complete your Daily Boss task during a Pomodoro for maximum XP rewards.'
  },
  {
    icon: <TreePine className="size-6" />,
    color: 'from-green-500 to-emerald-500',
    title: 'Skill Tree (RPG Classes)',
    shortDesc: 'Level up skills by completing category tasks',
    steps: [
      'Every task belongs to a category (Study, Fitness, Work, Admin, Code, etc.).',
      'Completing tasks earns category-specific XP.',
      'Watch your skill bars grow in the Skill Tree panel.',
      'Reach Level 5 in any category to unlock the exclusive ⭐ Master Badge!'
    ],
    tip: 'Different categories award different XP amounts. Code tasks give the most!'
  },
  {
    icon: <Activity className="size-6" />,
    color: 'from-amber-500 to-orange-500',
    title: 'Productivity Heatmap',
    shortDesc: 'GitHub-style 52-week activity grid',
    steps: [
      'Every task you complete is recorded with a timestamp.',
      'The heatmap renders a 52-week grid — each cell = one day.',
      'Darker blue = more tasks completed on that day.',
      'Hover over any cell to see the exact date and task count.'
    ],
    tip: 'The heatmap is seeded with demo data so it looks active from day one!'
  },
  {
    icon: <Link2 className="size-6" />,
    color: 'from-rose-500 to-pink-500',
    title: 'Task Dependencies',
    shortDesc: 'Block tasks until prerequisites are done',
    steps: [
      'When creating or editing a task, select a "Blocked By" prerequisite task.',
      'The dependent task\'s checkbox is locked with a 🔒 Lock icon.',
      'A message shows which task is blocking it.',
      'Complete the prerequisite task — the dependent task unlocks automatically!'
    ],
    tip: 'Great for project workflows where steps must happen in sequence.'
  },
  {
    icon: <Crown className="size-6" />,
    color: 'from-orange-500 to-red-500',
    title: 'The Daily Boss Task',
    shortDesc: 'One epic task that defines your day',
    steps: [
      'Mark any task as "Daily Boss" when creating or editing it.',
      'The Boss task glows with an orange ring and pulses to grab attention.',
      'Completing the Boss task gives a massive XP bonus.',
      'Deleting or ignoring a Boss task triggers a ⚠️ Penalty warning toast!'
    ],
    tip: 'Set your most important daily goal as the Boss to stay focused.'
  },
  {
    icon: <LayersIcon className="size-6" />,
    color: 'from-teal-500 to-cyan-500',
    title: 'Smart Batching',
    shortDesc: 'Batch-process tasks by category',
    steps: [
      'Click the "Batch" button next to any category in the task header area.',
      'The task list filters to show only that category\'s tasks.',
      'A progress bar shows how many tasks in the batch are complete.',
      'Click "End Batch" to return to the full task list.'
    ],
    tip: 'Use batching for focused sprints like "clear all Fitness tasks this morning."'
  }
];

function FeatureCard({ feature, isDarkMode }: { feature: typeof features[0]; isDarkMode: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const dark = isDarkMode;

  return (
    <Card className={`overflow-hidden transition-all ${dark ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'hover:shadow-md'}`}>
      <button
        className="w-full text-left p-5 flex items-center gap-4"
        onClick={() => setExpanded(e => !e)}
      >
        <div className={`size-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shrink-0`}>
          {feature.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-base ${dark ? 'text-slate-100' : 'text-slate-800'}`}>{feature.title}</h3>
          <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{feature.shortDesc}</p>
        </div>
        {expanded
          ? <ChevronUp className={`size-5 shrink-0 ${dark ? 'text-slate-400' : 'text-slate-400'}`} />
          : <ChevronDown className={`size-5 shrink-0 ${dark ? 'text-slate-400' : 'text-slate-400'}`} />
        }
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`px-5 pb-5 border-t ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
              <h4 className={`text-sm font-medium mt-4 mb-3 ${dark ? 'text-slate-300' : 'text-slate-700'}`}>How to use it:</h4>
              <ol className="space-y-2">
                {feature.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={`text-xs font-bold mt-0.5 size-5 rounded-full flex items-center justify-center shrink-0 ${dark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{step}</span>
                  </li>
                ))}
              </ol>
              {feature.tip && (
                <div className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${dark ? 'bg-blue-900/30 border border-blue-700/40' : 'bg-blue-50 border border-blue-100'}`}>
                  <Zap className="size-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className={`text-xs ${dark ? 'text-blue-300' : 'text-blue-700'}`}><strong>Pro tip:</strong> {feature.tip}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function HowItWorksPage({ onBack, isDarkMode }: HowItWorksPageProps) {
  const dark = isDarkMode;

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Hero */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <Logo isDarkMode={dark} className="size-12" />
            <span className="text-3xl font-bold">SmartTasks</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-3"
          >
            How It Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-lg max-w-xl mx-auto ${dark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            SmartTasks is a gamified, RPG-inspired productivity system. Complete tasks, level up skills, and maintain streaks — all in your browser.
          </motion.p>
        </div>

        {/* System Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl p-6 mb-8 ${dark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'}`}
        >
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CheckCircle2 className="size-5 text-green-500" />
            System Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Local-First', desc: 'All data stays in your browser. No accounts required for core features.', icon: '🔒' },
              { title: 'Gamified', desc: 'Earn XP, level up, unlock badges, maintain streaks, and defeat Daily Bosses.', icon: '🎮' },
              { title: 'ISO 9241-210', desc: 'Designed following human-centered UX principles for optimal usability.', icon: '📐' }
            ].map(item => (
              <div key={item.title} className={`p-4 rounded-xl ${dark ? 'bg-slate-700' : 'bg-slate-50'}`}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-semibold text-sm mb-1">{item.title}</div>
                <div className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature Cards */}
        <h2 className="font-bold text-xl mb-4">Feature Guide</h2>
        <div className="space-y-3 mb-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <FeatureCard feature={f} isDarkMode={dark ?? false} />
            </motion.div>
          ))}
        </div>

        {/* Back button */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={onBack}
            className={`gap-2 ${dark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}
          >
            <ArrowRight className="size-4 rotate-180" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
