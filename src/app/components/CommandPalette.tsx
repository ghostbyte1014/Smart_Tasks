import { useEffect, useState, useCallback } from 'react';
import { Dialog, DialogContent } from './ui/dialog';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandSeparator } from './ui/command';
import { Plus, Zap, Moon, Sun, BookOpen, Search } from 'lucide-react';
import { Task } from './TaskCard';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: Task[];
  onNewTask: () => void;
  onTogglePitchMode: () => void;
  onToggleDarkMode: () => void;
  onSearchSelect: (task: Task) => void;
  isPitchMode: boolean;
  isDarkMode: boolean;
}

export function CommandPalette({
  open,
  onOpenChange,
  tasks,
  onNewTask,
  onTogglePitchMode,
  onToggleDarkMode,
  onSearchSelect,
  isPitchMode,
  isDarkMode,
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  const filteredTasks = search.length > 0
    ? tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  const runAction = useCallback((fn: () => void) => {
    fn();
    onOpenChange(false);
    setSearch('');
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-lg overflow-hidden">
        <Command className="rounded-xl border-0 shadow-none">
          <div className="flex items-center border-b px-3">
            <Search className="size-4 text-slate-400 mr-2 shrink-0" />
            <CommandInput
              placeholder="Type a command or search tasks…"
              value={search}
              onValueChange={setSearch}
              className="border-0 ring-0 focus:ring-0 shadow-none"
            />
          </div>
          <CommandList className="max-h-80">
            <CommandGroup heading="Actions">
              <CommandItem onSelect={() => runAction(onNewTask)} className="gap-2 cursor-pointer">
                <Plus className="size-4 text-blue-500" />
                <span>New Task</span>
                <kbd className="ml-auto text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">N</kbd>
              </CommandItem>
              <CommandItem onSelect={() => runAction(onTogglePitchMode)} className="gap-2 cursor-pointer">
                <Zap className="size-4 text-purple-500" />
                <span>{isPitchMode ? 'Exit Pitch Mode' : 'Enable Pitch Mode'}</span>
              </CommandItem>
              <CommandItem onSelect={() => runAction(onToggleDarkMode)} className="gap-2 cursor-pointer">
                {isDarkMode ? (
                  <Sun className="size-4 text-amber-500" />
                ) : (
                  <Moon className="size-4 text-slate-600" />
                )}
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </CommandItem>
            </CommandGroup>

            {filteredTasks.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Tasks">
                  {filteredTasks.map(task => (
                    <CommandItem
                      key={task.id}
                      onSelect={() => runAction(() => onSearchSelect(task))}
                      className="gap-2 cursor-pointer"
                    >
                      <BookOpen className="size-4 text-slate-400" />
                      <span className={task.completed ? 'line-through text-slate-400' : ''}>{task.title}</span>
                      <span className="ml-auto text-xs text-slate-400">{task.category}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
