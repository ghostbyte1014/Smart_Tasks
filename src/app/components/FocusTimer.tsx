import { useState, useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Timer, Play, Square, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface FocusTimerProps {
  activeTaskId: string | null;
  activeTaskTitle: string;
  onComplete: (taskId: string, multiplier: number) => void;
  onClear: () => void;
  isDarkMode?: boolean;
}

const POMODORO_SECONDS = 25 * 60;

export function FocusTimer({ activeTaskId, activeTaskTitle, onComplete, onClear, isDarkMode }: FocusTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_SECONDS);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset when task changes
  useEffect(() => {
    setSecondsLeft(POMODORO_SECONDS);
    setRunning(false);
    setFinished(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [activeTaskId]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setFinished(true);
            if (activeTaskId) onComplete(activeTaskId, 1.5);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, activeTaskId, onComplete]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const progress = ((POMODORO_SECONDS - secondsLeft) / POMODORO_SECONDS) * 100;
  const circumference = 2 * Math.PI * 38;

  if (!activeTaskId) return null;

  const dark = isDarkMode;

  return (
    <Card className={`p-5 ${dark ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100'}`}>
      <div className="flex items-center gap-2 mb-4">
        <Timer className={`size-5 ${dark ? 'text-violet-400' : 'text-violet-600'}`} />
        <h3 className={`font-semibold text-sm ${dark ? 'text-slate-100' : 'text-slate-800'}`}>Focus Timer</h3>
        {finished && (
          <span className="ml-auto text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">+1.5x XP!</span>
        )}
      </div>

      <p className={`text-xs mb-4 truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
        🎯 {activeTaskTitle}
      </p>

      <div className="flex flex-col items-center gap-4">
        {/* Circular Timer */}
        <div className="relative size-24">
          <svg className="size-24 -rotate-90" viewBox="0 0 88 88">
            <circle cx="44" cy="44" r="38" fill="none" strokeWidth="6"
              className={dark ? 'stroke-slate-700' : 'stroke-violet-100'} />
            <motion.circle
              cx="44" cy="44" r="38" fill="none" strokeWidth="6"
              strokeLinecap="round"
              className={finished ? 'stroke-green-500' : 'stroke-violet-500'}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress / 100)}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-mono font-bold ${dark ? 'text-slate-100' : 'text-slate-800'}`}>
              {minutes}:{seconds}
            </span>
          </div>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            size="sm"
            className={`flex-1 ${running ? 'bg-rose-500 hover:bg-rose-600' : 'bg-violet-600 hover:bg-violet-700'}`}
            onClick={() => setRunning(r => !r)}
            disabled={finished}
          >
            {running ? <Square className="size-3.5 mr-1" /> : <Play className="size-3.5 mr-1" />}
            {running ? 'Pause' : 'Start'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSecondsLeft(POMODORO_SECONDS);
              setRunning(false);
              setFinished(false);
            }}
            className={dark ? 'border-slate-600 text-slate-300' : ''}
          >
            <RotateCcw className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Exit
          </Button>
        </div>
      </div>
    </Card>
  );
}
