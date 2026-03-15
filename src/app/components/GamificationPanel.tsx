import { motion } from 'motion/react';
import { Trophy, Zap, Flame, Star, Target, Award, BookOpen, Rocket } from 'lucide-react';
import { Progress } from './ui/progress';
import { Card } from './ui/card';

interface GamificationPanelProps {
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  isPitchMode?: boolean;
}

const xpForNextLevel = (level: number) => level * 100;

const allBadges = [
  { id: 'first-task', name: 'First Steps', icon: Star, description: 'Complete your first task' },
  { id: 'streak-3', name: 'On Fire', icon: Flame, description: '3 day streak' },
  { id: 'streak-7', name: 'Week Warrior', icon: Target, description: '7 day streak' },
  { id: 'tasks-10', name: 'Task Master', icon: Trophy, description: 'Complete 10 tasks' },
  { id: 'tasks-50', name: 'Productivity Pro', icon: Award, description: 'Complete 50 tasks' },
  { id: 'level-5', name: 'Rising Star', icon: Rocket, description: 'Reach level 5' },
  { id: 'category-study', name: 'Scholar', icon: BookOpen, description: 'Complete 10 study tasks' },
];

export function GamificationPanel({ xp, level, streak, badges, isPitchMode }: GamificationPanelProps) {
  const xpRequired = xpForNextLevel(level);
  const xpProgress = (xp % xpRequired) / xpRequired * 100;
  const xpCurrent = xp % xpRequired;

  return (
    <div className="space-y-4">
      {/* Level & XP */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="size-5 text-purple-600" />
              <span className="text-2xl text-gray-800">Level {level}</span>
            </div>
            <p className="text-sm text-gray-600">
              {xpCurrent} / {xpRequired} XP
            </p>
          </div>
          <motion.div
            className={`size-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ${level > 10 ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 shadow-orange-500/50' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}
            animate={{ 
              scale: level > 10 ? [1, 1.15, 1] : [1, 1.05, 1],
              rotate: level > 10 ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: level > 10 ? 1 : 2, repeat: Infinity }}
          >
            {level}
          </motion.div>
        </div>
        <Progress value={xpProgress} className="h-3" />
      </Card>

      {/* Streak Counter */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ 
              rotate: streak > 30 ? [0, 15, -15, 0] : [0, 10, -10, 0],
              scale: streak > 30 ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: streak > 30 ? 1 : 2, repeat: Infinity }}
          >
            <Flame className={`size-10 ${streak > 30 ? 'text-red-500 drop-shadow-lg' : 'text-orange-500'}`} />
          </motion.div>
          <div>
            <div className="text-3xl text-gray-800">{streak} Days</div>
            <p className="text-sm text-gray-600">Current Streak 🔥</p>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="text-lg mb-4 text-gray-800 flex items-center gap-2">
          <Trophy className="size-5 text-yellow-600" />
          Achievements
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {allBadges.map((badge) => {
            const earned = badges.includes(badge.id);
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: earned ? 1.05 : 1 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300'
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <Icon className={`size-6 mb-2 ${earned ? 'text-yellow-600' : 'text-gray-400'}`} />
                <div className="text-xs text-gray-800">{badge.name}</div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
