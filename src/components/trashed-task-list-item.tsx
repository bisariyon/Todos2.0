
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Todo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Undo2, Trash2, Clock } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import TaskListItemDialog from './task-list-item-dialog';

const EXPIRATION_TIME = 60 * 1000; // 1 minute

const calculateRemainingTime = (deletedAt: string | undefined) => {
    if (!deletedAt) return EXPIRATION_TIME;
    const expiration = new Date(deletedAt).getTime() + EXPIRATION_TIME;
    const now = new Date().getTime();
    const timeLeft = expiration - now;
    return timeLeft > 0 ? timeLeft : 0;
};

interface TrashedTaskListItemProps {
  todo: Todo;
  onRestoreTodo: (id: string) => void;
  onPermanentDelete: (id: string) => void;
}

export default function TrashedTaskListItem({ todo, onRestoreTodo, onPermanentDelete }: TrashedTaskListItemProps) {
    const [remainingTime, setRemainingTime] = useState(() => calculateRemainingTime(todo.deletedAt));

    useEffect(() => {
        const interval = setInterval(() => {
            const timeLeft = calculateRemainingTime(todo.deletedAt);
            setRemainingTime(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(interval);
                onPermanentDelete(todo.id);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [todo.id, todo.deletedAt, onPermanentDelete]);

    const remainingSeconds = Math.ceil(remainingTime / 1000);
    const progress = (remainingTime / EXPIRATION_TIME) * 100;
    
    const isLongText = useMemo(() => todo.title.length > 50, [todo.title]);

    const truncatedTitle = useMemo(() => {
        if (isLongText) {
            return todo.title.substring(0, 50) + '...';
        }
        return todo.title;
    }, [todo.title, isLongText]);

    return (
        <motion.div
          whileTap={{ scale: 0.98, y: -2 }}
          className="group relative rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col h-full border bg-neutral-300/60 border-neutral-400/70 backdrop-blur-sm p-5 text-gray-800"
        >
            <div className="flex-grow">
                 {isLongText ? (
                    <Dialog>
                        <DialogTrigger asChild>
                             <p className="font-semibold text-lg text-black/60 line-through cursor-pointer break-words">
                                {truncatedTitle}
                            </p>
                        </DialogTrigger>
                        <TaskListItemDialog todo={todo} />
                    </Dialog>
                ) : (
                    <p className="font-semibold text-lg text-black/60 line-through break-words">
                        {todo.title}
                    </p>
                )}
            </div>
            
            <div className="mt-4">
                <div className="relative h-2 w-full bg-neutral-400/50 rounded-full overflow-hidden">
                    <motion.div 
                        className="absolute top-0 left-0 h-full bg-red-500/70"
                        initial={{ width: `${progress}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                </div>
                <div className="flex justify-between items-center mt-1 text-xs text-black/50 font-medium">
                    <div className="flex items-center gap-1">
                       <Clock className="h-3 w-3" />
                       <span>Deleting in {remainingSeconds}s</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={() => onRestoreTodo(todo.id)} className="h-8 w-8 text-gray-500 hover:text-green-500 hover:bg-green-500/20 rounded-full">
                        <Undo2 className="h-4 w-4" />
                    </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => onPermanentDelete(todo.id)} className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-500/20 rounded-full">
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
