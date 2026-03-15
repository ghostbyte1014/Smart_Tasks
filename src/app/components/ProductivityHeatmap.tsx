import { useMemo } from 'react';
import { Card } from './ui/card';
import { Activity } from 'lucide-react';
import { Task } from './TaskCard';

interface ProductivityHeatmapProps {
  tasks: Task[];
  seedTimestamps?: number[];
  isDarkMode?: boolean;
}

function dateKey(ts: number) {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export function ProductivityHeatmap({ tasks, seedTimestamps = [], isDarkMode }: ProductivityHeatmapProps) {
  const dark = isDarkMode;

  const { grid, maxCount, monthLabels } = useMemo(() => {
    // Build count map from tasks + seed data
    const countMap: Record<string, number> = {};

    for (const ts of seedTimestamps) {
      const k = dateKey(ts);
      countMap[k] = (countMap[k] || 0) + 1;
    }
    for (const task of tasks) {
      if (task.completedAt) {
        const k = dateKey(task.completedAt);
        countMap[k] = (countMap[k] || 0) + 1;
      }
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const start = startOfWeek(new Date(today));
    start.setDate(start.getDate() - 51 * 7); // go back 52 weeks

    const weeks: Array<Array<{ date: Date; count: number; key: string }>> = [];
    const monthLabels: Array<{ label: string; col: number }> = [];
    let lastMonth = -1;

    const cur = new Date(start);
    for (let w = 0; w < 52; w++) {
      const week: Array<{ date: Date; count: number; key: string }> = [];
      for (let d = 0; d < 7; d++) {
        const key = dateKey(cur.getTime());
        week.push({ date: new Date(cur), count: countMap[key] || 0, key });
        const m = cur.getMonth();
        if (m !== lastMonth && cur <= today) {
          monthLabels.push({ label: MONTHS[m], col: w });
          lastMonth = m;
        }
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }

    const maxCount = Math.max(1, ...Object.values(countMap));
    return { grid: weeks, maxCount, monthLabels };
  }, [tasks, seedTimestamps]);

  const getColor = (count: number) => {
    if (count === 0) return dark ? '#1e293b' : '#f1f5f9';
    const intensity = count / maxCount;
    if (intensity < 0.25) return dark ? '#1d4ed8' : '#bfdbfe';
    if (intensity < 0.5)  return dark ? '#2563eb' : '#60a5fa';
    if (intensity < 0.75) return dark ? '#3b82f6' : '#3b82f6';
    return dark ? '#60a5fa' : '#1d4ed8';
  };

  const CELL = 12;
  const GAP = 2;
  const STEP = CELL + GAP;

  return (
    <Card className={`p-5 ${dark ? 'bg-slate-800 border-slate-700' : ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <Activity className={`size-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
        <h3 className={`font-semibold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>Productivity Heatmap</h3>
        <span className={`ml-auto text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>52 weeks</span>
      </div>

      <div className="overflow-x-auto">
        <svg
          width={52 * STEP + 30}
          height={7 * STEP + 24}
          className="block mx-auto"
        >
          {/* Month labels */}
          {monthLabels.map(({ label, col }) => (
            <text
              key={`${label}-${col}`}
              x={col * STEP + 30}
              y={10}
              fontSize={9}
              fill={dark ? '#64748b' : '#94a3b8'}
              fontFamily="monospace"
            >
              {label}
            </text>
          ))}

          {/* Day labels */}
          {[1, 3, 5].map(d => (
            <text key={d} x={2} y={d * STEP + 22} fontSize={8} fill={dark ? '#475569' : '#94a3b8'} fontFamily="monospace">
              {DAYS[d].slice(0, 1)}
            </text>
          ))}

          {/* Grid cells */}
          {grid.map((week, wi) =>
            week.map((cell, di) => (
              <rect
                key={cell.key}
                x={wi * STEP + 28}
                y={di * STEP + 14}
                width={CELL}
                height={CELL}
                rx={2}
                fill={getColor(cell.count)}
              >
                <title>{cell.key}: {cell.count} tasks</title>
              </rect>
            ))
          )}
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-1 justify-end mt-2">
          <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Less</span>
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="size-3 rounded-sm"
              style={{ backgroundColor: getColor(i * Math.ceil(maxCount / 4)) }}
            />
          ))}
          <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>More</span>
        </div>
      </div>
    </Card>
  );
}
