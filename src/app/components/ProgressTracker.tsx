import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface ProgressTrackerProps {
  tasksCompletedToday: number;
  weeklyData: Array<{ day: string; tasks: number }>;
  isPitchMode?: boolean;
}

export function ProgressTracker({ tasksCompletedToday, weeklyData, isPitchMode }: ProgressTrackerProps) {
  const totalWeeklyTasks = weeklyData.reduce((sum, day) => sum + day.tasks, 0);
  const avgDaily = (totalWeeklyTasks / 7).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Today's Progress */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="size-8 text-white" />
          </div>
          <div>
            <div className="text-3xl text-gray-800">{tasksCompletedToday}</div>
            <p className="text-sm text-gray-600">Tasks Completed Today</p>
          </div>
        </div>
      </Card>

      {/* Weekly Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-gray-800 flex items-center gap-2">
            <TrendingUp className="size-5 text-blue-600" />
            Weekly Progress
          </h3>
          <div className="text-right">
            <div className="text-sm text-gray-600">Daily Average</div>
            <div className="text-xl text-gray-800">{avgDaily}</div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <defs>
              <linearGradient id="taskBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              stroke="#999"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#999"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="tasks" 
              fill="url(#taskBarGradient)" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="text-lg mb-4 text-gray-800">This Week</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50">
            <div className="text-2xl text-blue-600">{totalWeeklyTasks}</div>
            <div className="text-xs text-gray-600 mt-1">Total Tasks</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50">
            <div className="text-2xl text-purple-600">{weeklyData.filter(d => d.tasks > 0).length}</div>
            <div className="text-xs text-gray-600 mt-1">Active Days</div>
          </div>
        </div>
      </Card>
    </div>
  );
}