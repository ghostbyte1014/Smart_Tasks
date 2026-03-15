import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Task } from './TaskCard';
import { Crown, Link2 } from 'lucide-react';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  editTask?: Task | null;
  existingTasks?: Task[];
}

const categories = ['Work', 'Study', 'Personal', 'Fitness', 'Admin', 'Code', 'Learning', 'Project'];

export function AddTaskDialog({ open, onOpenChange, onSave, editTask, existingTasks = [] }: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Work');
  const [blockedBy, setBlockedBy] = useState<string>('');
  const [isBoss, setIsBoss] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDueDate(editTask.dueDate);
      setPriority(editTask.priority);
      setCategory(editTask.category);
      setBlockedBy(editTask.blockedBy || '');
      setIsBoss(editTask.isBoss || false);
    } else {
      setTitle('');
      setDueDate('');
      setPriority('medium');
      setCategory('Work');
      setBlockedBy('');
      setIsBoss(false);
    }
  }, [editTask, open]);

  const handleSave = () => {
    if (!title.trim() || !dueDate) return;

    onSave({
      title: title.trim(),
      dueDate,
      priority,
      category,
      completed: editTask?.completed || false,
      blockedBy: blockedBy || undefined,
      isBoss: isBoss || undefined,
      completedAt: editTask?.completedAt
    });

    setTitle('');
    setDueDate('');
    setPriority('medium');
    setCategory('Work');
    setBlockedBy('');
    setIsBoss(false);
    onOpenChange(false);
  };

  // Available tasks to block by (exclude self)
  const blockableTasks = existingTasks.filter(t => t.id !== editTask?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{editTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Date & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Blocked By */}
          <div className="space-y-2">
            <Label htmlFor="blockedBy" className="flex items-center gap-1.5">
              <Link2 className="size-3.5 text-rose-500" />
              Blocked By (dependency)
            </Label>
            <Select
              value={blockedBy || '__none__'}
              onValueChange={v => setBlockedBy(v === '__none__' ? '' : v)}
            >
              <SelectTrigger id="blockedBy">
                <SelectValue placeholder="None (independent)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None (independent)</SelectItem>
                {blockableTasks.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.title.length > 40 ? t.title.slice(0, 40) + '…' : t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Daily Boss Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2">
              <Crown className="size-4 text-orange-500" />
              <div>
                <div className="text-sm font-medium text-orange-800">Daily Boss Task</div>
                <div className="text-xs text-orange-600">Grants massive XP. Penalty if skipped!</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsBoss(b => !b)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                isBoss ? 'bg-orange-500' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg transform transition-transform ${
                  isBoss ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !dueDate}>
            {editTask ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
