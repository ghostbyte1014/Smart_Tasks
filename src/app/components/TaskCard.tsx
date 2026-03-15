import { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Calendar, Flag, Trash2, Edit2, Lock, Timer, Crown } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  // Extended fields
  blockedBy?: string;       // Task dependency: id of prerequisite task
  isBoss?: boolean;         // Daily Boss designation
  completedAt?: number;     // Unix timestamp for heatmap
}

interface TaskCardProps {
  task: Task;
  tasks: Task[];            // Full task list for dependency checking
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartTimer?: (taskId: string) => void;
  activeTimerId?: string | null;
  isPitchMode?: boolean;
  isDarkMode?: boolean;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-700 border-blue-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  high: 'bg-rose-100 text-rose-700 border-rose-200'
};

const priorityIcons = {
  low: <Flag className="size-3" />,
  medium: <Flag className="size-3" />,
  high: <Flag className="size-3 fill-current" />
};

export const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, tasks, onToggle, onDelete, onEdit, onStartTimer, activeTimerId, isPitchMode, isDarkMode }, ref) => {
    const blockingTask = task.blockedBy ? tasks.find(t => t.id === task.blockedBy) : null;
    const isBlocked = !!blockingTask && !blockingTask.completed;
    const isTimerActive = activeTimerId === task.id;

    const darkCard = isDarkMode || isPitchMode;

    const cardBase = darkCard
      ? 'bg-slate-800 border-slate-700 hover:border-slate-500'
      : 'bg-white border-gray-100 hover:shadow-md';

    const bossRing = task.isBoss && !task.completed
      ? 'ring-4 ring-orange-500 animate-pulse'
      : '';

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl p-4 shadow-sm border transition-all group ${cardBase} ${bossRing} ${
          task.completed ? 'opacity-55' : ''
        } ${isBlocked ? 'opacity-60' : ''}`}
      >
        <div className="flex items-start gap-3">
          {/* Dependency lock or checkbox */}
          {isBlocked ? (
            <div className="mt-1 flex items-center justify-center size-4" title={`Blocked by: ${blockingTask?.title}`}>
              <Lock className="size-4 text-slate-400" />
            </div>
          ) : (
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-1"
              disabled={isBlocked}
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {task.isBoss && (
                <Crown className="size-4 text-orange-500 shrink-0" />
              )}
              <h3 className={`text-base ${task.completed ? 'line-through text-gray-400' : darkCard ? 'text-slate-100' : 'text-gray-800'}`}>
                {task.title}
              </h3>
              {isTimerActive && (
                <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                  Focus
                </span>
              )}
            </div>

            {isBlocked && (
              <p className="text-xs text-orange-400 mb-1">
                🔒 Blocked by: <span className="font-medium">{blockingTask?.title}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={`text-xs ${darkCard ? 'border-slate-600 text-slate-300' : ''}`}>
                {task.category}
              </Badge>

              <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                <span className="flex items-center gap-1">
                  {priorityIcons[task.priority]}
                  {task.priority}
                </span>
              </Badge>

              <span className={`flex items-center gap-1 text-xs ${darkCard ? 'text-slate-400' : 'text-gray-500'}`}>
                <Calendar className="size-3" />
                {task.dueDate}
              </span>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onStartTimer && !task.completed && !isBlocked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartTimer(task.id)}
                className={`h-8 w-8 p-0 ${isTimerActive ? 'text-green-500' : 'text-gray-400'}`}
                title="Start Focus Timer"
              >
                <Timer className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="h-8 w-8 p-0"
            >
              <Edit2 className={`size-4 ${darkCard ? 'text-slate-400' : 'text-gray-500'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }
);