
'use client';

import { useState, useMemo } from 'react';
import type { Todo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import TaskListItemDialog from './task-list-item-dialog';
import EditTaskDialog from './edit-task-dialog';

const cardColors = [
    'bg-yellow-200/60 border-yellow-300/70',
    'bg-orange-200/60 border-orange-300/70',
    'bg-red-200/60 border-red-300/70',
    'bg-pink-200/60 border-pink-300/70',
    'bg-purple-200/60 border-purple-300/70',
    'bg-indigo-200/60 border-indigo-300/70',
    'bg-blue-200/60 border-blue-300/70',
    'bg-cyan-200/60 border-cyan-300/70',
    'bg-teal-200/60 border-teal-300/70',
    'bg-green-200/60 border-green-300/70',
    'bg-lime-200/60 border-lime-300/70',
    'bg-emerald-200/60 border-emerald-300/70',
    'bg-sky-200/60 border-sky-300/70',
    'bg-violet-200/60 border-violet-300/70',
    'bg-fuchsia-200/60 border-fuchsia-300/70',
    'bg-rose-200/60 border-rose-300/70',
    'bg-amber-200/60 border-amber-300/70',
    'bg-stone-200/60 border-stone-300/70',
    'bg-gray-200/60 border-gray-300/70',
    'bg-slate-200/60 border-slate-300/70',
]

const tapeColors = [
    'bg-yellow-400/40',
    'bg-orange-400/40',
    'bg-red-400/40',
    'bg-pink-400/40',
    'bg-purple-400/40',
    'bg-indigo-400/40',
    'bg-blue-400/40',
    'bg-cyan-400/40',
    'bg-teal-400/40',
    'bg-green-400/40',
    'bg-lime-400/40',
    'bg-emerald-400/40',
    'bg-sky-400/40',
    'bg-violet-400/40',
    'bg-fuchsia-400/40',
    'bg-rose-400/40',
    'bg-amber-400/40',
    'bg-stone-400/40',
    'bg-gray-400/40',
    'bg-slate-400/40',
]

interface TaskListItemProps {
  todo: Todo;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, title: string) => void;
}

export default function TaskListItem({ todo, onToggleTodo, onDeleteTodo, onEditTodo }: TaskListItemProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    
    const { cardColor, tapeColor, rotation } = useMemo(() => {
        const hash = todo.colorKey;
        const cardIndex = Math.floor(hash * cardColors.length);
        const tapeIndex = Math.floor(hash * tapeColors.length);
        const rotation = (hash * 4) - 2; // -2 to 2 degree rotation
        return {
            cardColor: cardColors[cardIndex],
            tapeColor: tapeColors[tapeIndex],
            rotation: `rotate(${rotation}deg)`
        }
    }, [todo.colorKey]);

    const isLongText = useMemo(() => todo.title.length > 50 || todo.title.split(' ').some(word => word.length > 30), [todo.title]);

    const truncatedTitle = useMemo(() => {
        if (isLongText) {
            return todo.title.substring(0, 50) + '...';
        }
        return todo.title;
    }, [todo.title, isLongText]);

    return (
        <motion.div
          whileTap={{ scale: 0.98, y: -2 }}
          style={{ transform: rotation }}
          className={cn(
            "group relative rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border backdrop-blur-sm p-5 text-gray-800 float-on-hover glow-on-hover",
            cardColor,
            todo.completed ? 'opacity-60' : 'opacity-100',
        )}>
            <div className={cn("absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 rounded-sm opacity-70", tapeColor)} />

            <div className="flex-grow">
                <div className="flex items-start gap-4">
                    <Checkbox
                        id={`todo-pinterest-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => onToggleTodo(todo.id)}
                        className={cn(
                            "h-6 w-6 rounded-full mt-1",
                            'bg-white/50 border-black/20 data-[state=checked]:bg-green-400 data-[state=checked]:text-white data-[state=checked]:border-green-500'
                        )}
                        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                    />
                    <div className="flex-grow">
                        <Dialog>
                            <DialogTrigger asChild>
                                <p className={cn("font-semibold text-lg cursor-pointer break-all", todo.completed && "line-through text-black/40")}>
                                    {isLongText ? truncatedTitle : todo.title}
                                </p>
                            </DialogTrigger>
                            <TaskListItemDialog todo={todo} />
                        </Dialog>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center justify-end mt-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                            <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-full", 'hover:bg-black/10')}>
                                <Edit className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </DialogTrigger>
                    <EditTaskDialog todo={todo} onEditTodo={onEditTodo} onClose={() => setIsEditDialogOpen(false)} />
                </Dialog>
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteTodo(todo.id)} className={cn("h-8 w-8 rounded-full", 'text-gray-500 hover:text-red-500 hover:bg-red-500/20')}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
