import { motion, AnimatePresence } from 'motion/react';
import { TaskCard, Task } from './TaskCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ListTodo } from 'lucide-react';
import { Progress } from './ui/progress';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStartTimer?: (taskId: string) => void;
  activeTimerId?: string | null;
  isPitchMode?: boolean;
  isDarkMode?: boolean;
  batchCategory?: string | null;
}

export function TaskList({
  tasks,
  onToggle,
  onDelete,
  onEdit,
  onStartTimer,
  activeTimerId,
  isPitchMode,
  isDarkMode,
  batchCategory
}: TaskListProps) {
  const dark = isDarkMode || isPitchMode;

  // Apply batch filter if active
  const filteredTasks = batchCategory
    ? tasks.filter(t => t.category === batchCategory)
    : tasks;

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  // Batch progress
  const batchTotal = filteredTasks.length;
  const batchDone = filteredTasks.filter(t => t.completed).length;
  const batchProgress = batchTotal > 0 ? (batchDone / batchTotal) * 100 : 0;

  const renderTaskList = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <div className={`text-center py-12 ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
          <ListTodo className="size-12 mx-auto mb-3 opacity-50" />
          <p>No tasks here</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {taskList.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              tasks={tasks}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onStartTimer={onStartTimer}
              activeTimerId={activeTimerId}
              isPitchMode={isPitchMode}
              isDarkMode={isDarkMode}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div>
      {/* Batch Mode Progress Banner */}
      {batchCategory && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-xl border ${dark ? 'bg-teal-900/40 border-teal-700' : 'bg-teal-50 border-teal-200'}`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${dark ? 'text-teal-300' : 'text-teal-700'}`}>
              🚀 Batch: {batchCategory}
            </span>
            <span className={`text-sm font-bold ${dark ? 'text-teal-200' : 'text-teal-800'}`}>
              {batchDone}/{batchTotal} done
            </span>
          </div>
          <Progress value={batchProgress} className={`h-2 ${dark ? 'bg-teal-800' : 'bg-teal-100'}`} />
        </motion.div>
      )}

      <Tabs defaultValue="active" className="w-full">
        <TabsList className={`grid w-full grid-cols-2 mb-6 ${dark ? 'bg-slate-700' : ''}`}>
          <TabsTrigger value="active" className={dark ? 'data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400' : ''}>
            Active ({activeTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className={dark ? 'data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-400' : ''}>
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-0">
          {renderTaskList(activeTasks)}
        </TabsContent>

        <TabsContent value="completed" className="mt-0">
          {renderTaskList(completedTasks)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
